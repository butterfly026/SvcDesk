import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { TranService } from 'src/services';
import { ContactAddressMandatoryRules } from 'src/app/model';
import { GlobalService } from 'src/services/global-service.service';
import { SpinnerService } from 'src/app/Shared/services';
import { AccountAddressesService } from '../../services';
import { AccountAddressType, AccountAddressesFormGroup, AccountType, CountryDetail } from '../../models';

@Component({
  selector: 'app-new-account-addresses',
  templateUrl: './new-account-addresses.component.html',
  styleUrls: ['./new-account-addresses.component.scss'],
})
export class NewAccountAddressesComponent implements OnInit {

  @Input() formGroup: FormGroup<AccountAddressesFormGroup>;
  @Input() accountType: AccountType;

  addressTypes: AccountAddressType[] = [];
  countrys: CountryDetail[] = [];
  addressFormats: { Id: string; Name: string; }[] = [];

  private mandatoryList: ContactAddressMandatoryRules[] = [];
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private spinnerService: SpinnerService,
    private tranService: TranService,
    private accountAddressesService: AccountAddressesService,
    private formBuilder: FormBuilder,
    public globService: GlobalService,
  ) {

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

  get addressesFormControl(): FormArray {
    return this.formGroup.controls.Addresses as FormArray;
  }

  addNewAddress(): void {
    this.addressesFormControl.push(this.formBuilder.group({
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
    this.addressesFormControl.removeAt(index);
  }


  private getAddressConfiguration(): void {
    this.spinnerService.loading();
    this.accountAddressesService.getAddressConfiguration()
      .pipe(
        takeUntil(this.unsubscribeAll$),
        finalize(() => this.spinnerService.end())
      )
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
    this.spinnerService.loading();
    this.accountAddressesService.getAccountAddressTypes()
      .pipe(
        takeUntil(this.unsubscribeAll$),
        finalize(() => this.spinnerService.end())
      )
      .subscribe({
        next: result => this.addressTypes = result,
        error: error => this.tranService.errorMessage(error)
      });
  }

  private getMandatoryList(): void {
    this.spinnerService.loading();
    this.accountAddressesService.getAccountAddressMandatoryRules(this.accountType)
      .pipe(
        takeUntil(this.unsubscribeAll$),
        finalize(() => this.spinnerService.end())
      )
      .subscribe({
        next: result => this.mandatoryList = result,
        error: error => this.tranService.errorMessage(error)
      })
  }

  private getCountryList(): void {
    this.spinnerService.loading();
    this.accountAddressesService.getCountries()
      .pipe(
        takeUntil(this.unsubscribeAll$),
        finalize(() => this.spinnerService.end())
      )
      .subscribe({
        next: result => this.countrys = result,
        error: error => this.tranService.errorMessage(error)
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
