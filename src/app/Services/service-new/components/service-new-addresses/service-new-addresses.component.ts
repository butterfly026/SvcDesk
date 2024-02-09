import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CountryDetail, PostCodeDetail, ServiceAddressType } from 'src/app/Services/service-address/models';
import { ServiceAddressService } from 'src/app/Services/service-address/services';
import { ContactAddressMandatoryRules } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { FifthFormGroup } from '../../models';

@Component({
  selector: 'app-service-new-addresses',
  templateUrl: './service-new-addresses.component.html',
  styleUrls: ['./service-new-addresses.component.scss'],
})
export class ServiceNewAddressesComponent implements OnInit {

  @Input() formGroup: FormGroup<FifthFormGroup>;
  @Input() ServiceTypeId: number;
  @Output('ServiceNewAddressesComponent') ServiceNewAddressesComponent: EventEmitter<string> = new EventEmitter<string>();

  addressTypes: ServiceAddressType[] = [];
  countrys: CountryDetail[] = [];
  addressFormats: { Id: string; Name: string; }[] = [];

  private mandatoryList: ContactAddressMandatoryRules[] = [];
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private addressService: ServiceAddressService,
    private formBuilder: FormBuilder,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
  }

  ngOnInit() {
    this.addNewAddress();
    this.getAddressConfiguration();
    this.getAddressTypeList();
    this.getMandatoryList();
    this.getCountryList();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  get contactAddressUsageFormControl(): FormArray {
    return this.formGroup.controls.ContactAddressUsage as FormArray;
  }

  addNewAddress(): void {
    this.contactAddressUsageFormControl.push(this.formBuilder.group({
      Address: ['', Validators.required],
      AddressLine1: ['', Validators.required],
      AddressLine2: '',
      Suburb: ['', Validators.required],
      City: '',
      State: ['', Validators.required],
      PostCode: ['', [Validators.required, Validators.pattern('[0-9]{4,}')]],
      CountryCode: ['', Validators.required],
      AddressTypes: ['', [Validators.required, this.mandatoryValidator()]],
      AddressFormat: 'ADDRESSIFY',
      ShowSpinner: false,
      AddressList: [],
      StateList: [],
      SuburbList: [],
    }));
  }

  deleteAddress(index): void {
    this.contactAddressUsageFormControl.removeAt(index);
  }

  submitTrigger(): void {
    document.getElementById('submitButton').click();
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
        timer(1000).pipe(takeUntil(this.unsubscribeAll$)).subscribe(() => {
          if (item.get('Address').value !== '') {
            this.getAddressList(item.get('Address').value, item);
          }
        })
        break;
    }
  }

  focustOutAddress(item: FormGroup) {
    item.get('ShowSpinner').setValue(false);
  }

  changeAddressFormat(item: FormGroup, addressFormat: { Id: string; Name: string } ): void {
    if (addressFormat.Id === 'ADDRESSIFY') {
      if (item.get('AddressLine1').value) {
        this.getAddressList(item.get('AddressLine1').value, item);
      } else {
        this.getAddressList(item.get('Address').value, item);
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

  private getAddressList(Term, item: FormGroup): void {
    item.get('ShowSpinner').setValue(true);
    item.get('AddressList').setValue([]);
    item.get('Address').setErrors(null);

    this.addressService.getAustraliaAddressList({ Term })
      .subscribe({
        next: result => {
          item.get('ShowSpinner').setValue(false);
          setTimeout(() => {
            item.get('AddressList').setValue(result);
            item.get('Address').setErrors({
              invalid: this.tranService.instant(
                result.length === 0 ? 'InvalidAddress': 'AddressShouldBeSelectedFromList'
              )
            });            
          }, 500);
        },
        error: error => {
          item.get('ShowSpinner').setValue(false);
          this.tranService.errorMessage(error);
        }
      });
  }
  
  private checkStringValue(value): string {
    return value || '';
  }

  private getAddressConfiguration(): void {
    this.addressService.getAddressConfiguration()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => {
          this.addressFormats = [
            { Id: result.DefaultComponent, Name: result.DefaultComponentLabel },
            { Id: result.AlternateComponent, Name: result.AlternateComponentLabel }
          ];
        },
        error: error => this.tranService.errorMessage(error)
      });
  }

  private getAddressTypeList(): void {
    this.addressService.getServiceAddressTypes()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => this.addressTypes = result,
        error: error => this.tranService.errorMessage(error)
      });
  }

  private getMandatoryList(): void {
    this.addressService.getServiceAddressMandatoryRules(this.ServiceTypeId)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => this.mandatoryList = result,
        error: error => this.tranService.errorMessage(error)
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

  private getCountryList(): void {
    this.addressService.getCountries()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => this.countrys = result,
        error: error => this.tranService.errorMessage(error)
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

  private mandatoryValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.value?.length && !this.mandatoryList.every(s => control.value.includes(s.TypeCode)) 
        ? { MandatoryValidation: this.tranService.instant('EveryAddressMustHave') + ' : ' + this.mandatoryList.map(s => ' ' + s.Type).toString() }
        : null;
    };
  }

}
