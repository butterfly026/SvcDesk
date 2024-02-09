import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { finalize, takeUntil } from 'rxjs/operators';
import { ContactAddressMandatoryRules } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { AccountAddressService } from './services/account-address.service';
import { Subject, timer } from 'rxjs';
import { CountryDetail, PostCodeDetail, AccountAddressType, AccountAddressUpdateRequestBodyAddressUsage } from './models';

@Component({
  selector: 'app-account-address',
  templateUrl: './account-address.component.html',
  styleUrls: ['./account-address.component.scss'],
})
export class AccountAddressComponent implements OnInit {

  @Input() AccountType: string;
  @Output('AccountAddressComponent') AccountAddressComponent: EventEmitter<{type:string; data:boolean}> = new EventEmitter<{type:string; data:boolean}>();

  formGroup: FormGroup;
  addressTypes: AccountAddressType[] = [];
  countrys: CountryDetail[] = [];
  addressFormats: { Id: string; Name: string; }[] = [];

  private mandatoryList: ContactAddressMandatoryRules[] = [];
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private addressService: AccountAddressService,
    private formBuilder: FormBuilder,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    this.formGroup = this.formBuilder.group({
      ContactAddressUsage: this.formBuilder.array([])
    });
    this.formGroup.valueChanges.subscribe(() => {
      this.AccountAddressComponent.emit({
        type: 'valueChange',
        data: this.formGroup.valid
      });
    });
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
    return this.formGroup.get('ContactAddressUsage') as FormArray;
  }

  public getSubmitData(): {Addresses: AccountAddressUpdateRequestBodyAddressUsage[]}{
    return  { 
      Addresses : 
      this.formGroup.valid ? 
      this.contactAddressUsageFormControl.controls.map(
        (list: FormGroup)=>(
          {
            AddressLine1: list.get('AddressLine1').value,
            AddressLine2: list.get('AddressLine2').value,
            Suburb: list.get('Suburb').value,
            City: list.get('City').value,
            State: list.get('State').value,
            PostCode: list.get('PostCode').value,
            CountryCode: list.get('CountryCode').value,
            AddressTypes: list.get('AddressTypes').value.map((item: string) => ({ Code: item }))
          }
        )
      ) : []
    };
  }

  addNewAddress(): void {
    this.contactAddressUsageFormControl.push(this.formBuilder.group({
      Address: '',
      AddressLine1: ['', Validators.required],
      AddressLine2: '',
      Suburb: ['', Validators.required],
      City: '',
      State: ['', Validators.required],
      PostCode: ['', [Validators.required, Validators.pattern('[0-9]{4,}')]],
      CountryCode: ['', Validators.required],
      AddressTypes: ['', [Validators.required, this.mandatoryListValidator()]],
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
        timer(1000).pipe(
          takeUntil(this.unsubscribeAll$)
        ).subscribe(() => {
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
            if (!!result) {
              this.getStateList(countryCode, 'update', item);
              item.get('State').reset();
              item.get('CountryCode').reset();
              item.get('SuburbList').setValue(result);
            }
          },
          error: async error => {
            this.tranService.errorMessage(error);
          }
        });
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
  
  private checkStringValue(value): string {
    return value || '';
  }

  private async getAddressConfiguration(): Promise<void> {
    await this.loading.present();
    this.addressService.getAddressConfiguration()
      .pipe(
        takeUntil(this.unsubscribeAll$),
        finalize(async () => {
          await this.loading.dismiss();
        })
      )
      .subscribe({
        next: async result => {
          this.addressFormats = [
            { Id: result.DefaultComponent, Name: result.DefaultComponentLabel },
            { Id: result.AlternateComponent, Name: result.AlternateComponentLabel }
          ];
        },
        error: async error => {
          this.tranService.errorMessage(error);
        }
      });
  }

  private async getAddressTypeList(): Promise<void> {
    await this.loading.present();
    this.addressService.getAccountAddressTypes()
      .pipe(
        takeUntil(this.unsubscribeAll$),
        finalize(async () => {
          await this.loading.dismiss();
        })
      )
      .subscribe({
        next: async result => {
          this.addressTypes = result;
        },
        error: async error => {
          this.tranService.errorMessage(error);
        }
      });
  }

  private async getMandatoryList(): Promise<void> {
    await this.loading.present();
    this.addressService.getAccountAddressMandatoryRules(this.AccountType)
      .pipe(
        takeUntil(this.unsubscribeAll$),
        finalize(async () => {
          await this.loading.dismiss();
        })
      )
      .subscribe({
        next: async result => {
          this.mandatoryList = result;
        },
        error: async error => {
          this.tranService.errorMessage(error);
        }
      })
  }

  private async getStateList(countryCode: string, statement: 'initial' | 'update', item: FormGroup): Promise<void> {
    await this.loading.present();
    this.addressService.getAddressStates(countryCode)
      .pipe(
        takeUntil(this.unsubscribeAll$),
        finalize(async () => {
          await this.loading.dismiss();
        })
      )
      .subscribe({
        next: async result => {
          item.get('StateList').setValue(result);
          if (!result && statement === 'update') {
            item.get('State').setValue(result.find(s => !!s.Default).Code);
          }
        },
        error: async error => {
          this.tranService.errorMessage(error);
        }
      });
  }

  private async getCountryList(): Promise<void> {
    await this.loading.present();
    this.addressService.getCountries()
      .pipe(
        takeUntil(this.unsubscribeAll$),
        finalize(async () => {
          await this.loading.dismiss();
        })
      )
      .subscribe({
        next: async result => {
          this.countrys = result;
        },
        error: async error => {
          console.error('error =>', )
          this.tranService.errorMessage(error);
        }
      });
  }

  private async getInitialSuburbList(postCode: string, countryCode: string, item: FormGroup): Promise<void> {
    await this.loading.present();
    this.addressService.getPostalLocalities(postCode, countryCode)
      .pipe(
        takeUntil(this.unsubscribeAll$),
        finalize(async () => {
          await this.loading.dismiss();
        })
      )
      .subscribe({
        next: async result => {
          item.get('SuburbList').setValue(result);
        },
        error: async error => {
          this.tranService.errorMessage(error);
        }
      });
  }

  private mandatoryListValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.value?.length && !this.mandatoryList.every(s => control.value.includes(s.TypeCode)) 
        ? { MandatodyValidation: this.tranService.instant('EveryAddressMustHave') + ' : ' + this.mandatoryList.map(s => ' ' + s.Type).toString() }
        : null;
    };
  }

}
