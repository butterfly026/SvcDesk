import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { ContactAddressMandatoryRules } from 'src/app/model';
import { Permission } from 'src/app/Shared/models';
import { AddressRequestBody, ServiceAddressType, CountryDetail, PostCodeDetail, ServiceAddressPermissionType } from '../../models';
import { LoadingService, ToastService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { DialogComponent } from 'src/app/Shared/components';
import { ServiceAddressService } from '../../services';
import { ServiceAddressHistoryComponent } from '..';

@Component({
  selector: 'app-service-address-management',
  templateUrl: './service-address-management.component.html',
  styleUrls: ['./service-address-management.component.scss'],
})
export class ServiceAddressManagementComponent implements OnInit, OnDestroy {

  @Input() ServiceReference: number;
  @Output('AddressManagementComponent') AddressManagementComponent: EventEmitter<string> = new EventEmitter<string>();

  formGroup: FormGroup;
  addressTypes: ServiceAddressType[] = [];
  countrys: CountryDetail[] = [];
  addressFormats: { Id: string; Name: string; }[] = [];
  addressTimer;
  permissions: ServiceAddressPermissionType[] = [];

  private mandatoryList: ContactAddressMandatoryRules[] = [];
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private addressService: ServiceAddressService,
    private formBuilder: UntypedFormBuilder,
    private alertCtrl: AlertController,
    private toast: ToastService,
    private dialog: MatDialog,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    this.formGroup = this.formBuilder.group({
      ContactAddressUsage: this.formBuilder.array([])
    });
  }

  ngOnInit() {
    this.getPermission();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  get contactAddressUsageFormControl(): FormArray {
    return this.formGroup.get('ContactAddressUsage') as FormArray;
  }

  addNewAddress(data?: AddressRequestBody): void {
    if (data) {
      this.contactAddressUsageFormControl.push(this.formBuilder.group({
        Address: data.Address,
        AddressLine1: [data.AddressLine1, Validators.required],
        AddressLine2: data.AddressLine2,
        Suburb: [data.Suburb, Validators.required],
        City: data.City,
        State: [data.State, Validators.required],
        PostCode: [data.PostCode, [Validators.required, Validators.pattern('[0-9]{4,}')]],
        CountryCode: [data.CountryCode, Validators.required],
        AddressTypes: [data.AddressTypes, Validators.required],
        AddressFormat: data.AddressFormat,
        ShowSpinner: false,
        AddressList: [],
        StateList: [],
        SuburbList: [],
      }));
    } else {
      this.contactAddressUsageFormControl.push(this.formBuilder.group({
        Address: '',
        AddressLine1: ['', Validators.required],
        AddressLine2: '',
        Suburb: ['', Validators.required],
        City: '',
        State: ['', Validators.required],
        PostCode: ['', [Validators.required, Validators.pattern('[0-9]{4,}')]],
        CountryCode: ['', Validators.required],
        AddressTypes: ['', Validators.required],
        AddressFormat: 'ADDRESSIFY',
        ShowSpinner: false,
        AddressList: [],
        StateList: [],
        SuburbList: [],
      }))
    }
  }

  deleteAddress(index): void {
    this.contactAddressUsageFormControl.removeAt(index);
  }

  submitTrigger(): void {
    document.getElementById('submitButton').click();
  }

  goBack(): void {
    !this.formGroup.valid
      ? this.presentAlert()
      : this.AddressManagementComponent.emit('close');
  }

  goToHistory(): void {
    this.dialog.open(DialogComponent, {
      width: '100%',
      maxWidth: '650px',
      panelClass: 'dialog',
      data: {
        component: ServiceAddressHistoryComponent,
        serviceReference: this.ServiceReference
      }
    });
  }

  selectSuburb(item: FormGroup, suburb: PostCodeDetail): void {
    item.get('State').setValue(suburb.StateCode);
    item.get('CountryCode').setValue(suburb.CountryCode);
  }

  selectCountry(item: FormGroup): void {
    item.get('State').reset();
    this.getStateList(item.get('CountryCode').value, 'update', item);
  }

  addresKyeUp(event, item: FormGroup): void {
    clearTimeout(this.addressTimer);
    switch (event.keyCode) {
      case 37:
      case 38:
      case 39:
      case 40:
      case 13:
      case 20:
      case 17:
      case 27:
      case 18:
      case 91:
      case 16:
        break;
      default:
        if (item.get('Address').value.length === 8) {
          this.getAddressList(item.get('Address').value, item);
        }
        this.addressTimer = setTimeout(() => {
          if (item.get('Address').value !== '') {
            this.getAddressList(item.get('Address').value, item);
          }
        }, 1000);
        break;
    }
  }

  focustOutAddress(item: FormGroup) {
    item.get('ShowSpinner').setValue(false);
  }

  checkPermission(val: ServiceAddressPermissionType): boolean {
    return this.permissions.includes(val);
  }

  changeAddressFormat(item: FormGroup, addressFormat: { Id: string; Name: string } ): void {
    if (addressFormat.Id === 'ADDRESSIFY') {
      if (item.get('AddressLine1').value) {
        this.getAddressList(item.get('AddressLine1').value, item);
      }
    }
  }

  selectAddress(item: FormGroup, Term: string): void {
    this.addressService.getAustraliaAddressDetail({ Term })
      .subscribe({
        next: result => {
          item.get('AddressLine1').setValue(
            this.checkStringValue(result.BuildingName) + this.checkStringValue(result.LevelType)
              + this.checkStringValue(result.LevelNumber) + this.checkStringValue(result.UnitType) +
              this.checkStringValue(result.UnitNumber) + this.checkStringValue(result.StreetLine)
          );
          item.get('Suburb').setValue(result.Suburb);
          item.get('State').setValue(result.State);
          item.get('PostCode').setValue(result.Postcode);
          item.get('CountryCode').setValue('AU');

          this.getInitialSuburbList(result.Postcode, 'AU', item);
          this.getStateList('AU', 'initial', item);
        },
        error: error => {
          this.tranService.errorMessage(error);
        }
      })
  }

  async checkPostalCode(item: FormGroup): Promise<void> {
    if (item.get('PostCode').valid) {
      await this.loading.present();
      const countryCode = item.get('CountryCode').valid 
        ? item.get('CountryCode').value 
        : this.countrys.find(s => s.Default).Code;

      this.addressService.getPostalLocalities(item.get('PostCode').value, countryCode)
        .subscribe({
          next: async result => {
            await this.loading.dismiss();
            if (!!result) {
              this.getStateList(countryCode, 'update', item);
              item.get('State').reset();
              item.get('CountryCode').reset();
              item.get('SuburbList').setValue(result);
            }
          },
          error: async error => {
            await this.loading.dismiss();
            this.tranService.errorMessage(error);
          }
        });
    }
  }

  async submitGroup(): Promise<void> {
    if (this.checkMandatoryList()) {
      if (this.formGroup.valid) {
        await this.loading.present();
        let reqData = {
          DeleteOtherAddresses: false,
          AddressUsage: []
        };

        reqData.AddressUsage = (this.contactAddressUsageFormControl.value as AddressRequestBody[]).map(s => ({
          AddressLine1: s.AddressLine1,
          AddressLine2: s.AddressLine2,
          Suburb: s.Suburb,
          City: s.City,
          State: s.State,
          PostCode: s.PostCode,
          CountryCode: s.CountryCode,
          AddressTypes: s.AddressTypes.map(t => ({ Code: t })),
        }));

        this.addressService.updateServiceAddressUsage(reqData, this.ServiceReference)
          .pipe(takeUntil(this.unsubscribeAll$))  
          .subscribe({
            next: async () => {
              this.tranService.errorMessageWithTime('address_management_updated');
              await this.loading.dismiss();
              this.getContactAddressUsage();
  
              setTimeout(() => {
                this.AddressManagementComponent.emit('submitted');
                this.goBack();
              }, 2000);
            },
            error: async error => {
              await this.loading.dismiss();
              this.tranService.errorMessage(error);
            }
          });
      }
    } else {
      const message = this.tranService.instant('must_have') + ' : ' + this.mandatoryList.map(s => ' ' + s.Type).toString();
      this.toast.present(message);
    }
  }

  private getAddressList(Term, item: FormGroup): void {
    item.get('ShowSpinner').setValue(true);
    item.get('AddressList').setValue([]);

    this.addressService.getAustraliaAddressList({ Term })
      .subscribe({
        next: result => {
          item.get('ShowSpinner').setValue(false);
          setTimeout(() => item.get('AddressList').setValue(result), 500);
        },
        error: error => {
          item.get('ShowSpinner').setValue(false);
          this.tranService.errorMessage(error);
        }
      });
  }

  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/Services/Addresses', "").replace('/', "") as ServiceAddressPermissionType);
  }
  
  private checkStringValue(value): string {
    return value || '';
  }

  private checkMandatoryList(): boolean {
    return (this.contactAddressUsageFormControl.value as { 
        AddressLine1: string;
        AddressLine2: string;
        Suburb: string;
        City: string;
        State: string;
        PostCode: string;
        CountryCode: string;
        AddressTypes: string[];
        AddressFormat: string;
      }[]
    ).every(s => this.mandatoryList.every(t => s.AddressTypes.includes(t.TypeCode)));
  }

  private async presentAlert(): Promise<void> {
    const alert = await this.alertCtrl.create({
      message: this.tranService.instant('are_you_sure'),
      subHeader: this.tranService.instant('your_change_lost'),
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Yes',
          handler: () => this.AddressManagementComponent.emit('close')
        }
      ]
    });
    await alert.present();
  }

  private async getPermission(): Promise<void> {
    await this.loading.present();
    this.globService.getAuthorization('/Services/Addresses', true)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result: Permission[]) => {
          await this.loading.dismiss();
          this.formatPermissions(result);
          if (this.permissions.includes('')) {
            this.getAddressConfiguration();
            this.getContactAddressUsage();
            this.getAddressTypeList();
            this.getMandatoryList();
            this.getCountryList();
          } else {
            this.tranService.errorMessage('resource_forbidden');
            setTimeout(() => this.AddressManagementComponent.emit('close'), 1000);
          }
        },
        error: async (error) => {
          await this.loading.dismiss();
          const errResult = this.globService.ConvertKeysToLowerCase(error);
          this.tranService.errorMessage('resource_forbidden');

          if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
            setTimeout(() => this.AddressManagementComponent.emit('close'), 1000);
          }
        }
      });
  }
    
  private async getAddressConfiguration(): Promise<void> {
    await this.loading.present();
    this.addressService.getAddressConfiguration()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async result => {
          await this.loading.dismiss();
          this.addressFormats = [
            { Id: result.DefaultComponent, Name: result.DefaultComponentLabel },
            { Id: result.AlternateComponent, Name: result.AlternateComponentLabel }
          ];
        },
        error: async error => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      });
  }

  private async getAddressTypeList(): Promise<void> {
    await this.loading.present();
    this.addressService.getServiceAddressTypes()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async result => {
          await this.loading.dismiss();
          this.addressTypes = result;
        },
        error: async error => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      });
  }

  private async getMandatoryList(): Promise<void> {
    await this.loading.present();
    this.addressService.getServiceAddressMandatoryRules(this.ServiceReference)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async result => {
          await this.loading.dismiss();
          this.mandatoryList = result;
        },
        error: async error => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      })
  }

  private async getStateList(countryCode: string, statement: 'initial' | 'update', item: FormGroup): Promise<void> {
    await this.loading.present();
    this.addressService.getAddressStates(countryCode)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async result => {
          await this.loading.dismiss();
          item.get('StateList').setValue(result);
          if (!result && statement === 'update') {
            item.get('State').setValue(result.find(s => !!s.Default).Code);
          }
        },
        error: async error => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      });
  }

  private async getCountryList(): Promise<void> {
    await this.loading.present();
    this.addressService.getCountries()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async result => {
          await this.loading.dismiss();
          this.countrys = result;
        },
        error: async error => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      });
  }

  private async getInitialSuburbList(postCode: string, countryCode: string, item: FormGroup): Promise<void> {
    await this.loading.present();
    this.addressService.getPostalLocalities(postCode, countryCode)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async result => {
          await this.loading.dismiss();
          item.get('SuburbList').setValue(result);
        },
        error: async error => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      });
  }

  private async getContactAddressUsage(): Promise<void> {
    await this.loading.present();
    this.addressService.getServiceAddressUsage(this.ServiceReference)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async result => {
          await this.loading.dismiss();
          if (!result) {
            this.tranService.errorMessage('no_contact_address');
          } else {
            result.AddressUsage.forEach((s, i) => {
              this.addNewAddress({
                Address: `${s.AddressLine1}, ${s.Suburb} ${s.State} ${s.PostCode}`,
                AddressLine1: s.AddressLine1,
                AddressLine2: s.AddressLine2,
                City: s.City,
                CountryCode: s.CountryCode,
                PostCode: s.PostCode,
                State: s.State,
                Suburb: s.Suburb,
                AddressTypes: s.AddressTypes.map(t => t.Code),
                AddressFormat: 'ADDRESSIFY',
                ShowSpinner: false,
                AddressList: [],
                StateList: [],
                SuburbList: []
              });

              this.getStateList(s.CountryCode, 'initial', this.contactAddressUsageFormControl.controls[i] as FormGroup);
              this.getInitialSuburbList(s.PostCode, s.CountryCode, this.contactAddressUsageFormControl.controls[i] as FormGroup);
            })
          }
        },
        error: async error => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      })
  }

}
