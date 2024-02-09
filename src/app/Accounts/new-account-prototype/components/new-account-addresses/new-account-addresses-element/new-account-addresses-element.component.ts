import { FormGroup } from '@angular/forms';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

import { TranService } from 'src/services';
import { AccountAddressesService } from '../../../services';
import { SpinnerService } from 'src/app/Shared/services';
import { AccountAddressFormGroup, AccountAddressStateType, AccountAddressType, CountryDetail, PostCodeDetail } from '../../../models';

@Component({
  selector: 'app-new-account-addresses-element',
  templateUrl: './new-account-addresses-element.component.html',
  styleUrls: ['./new-account-addresses-element.component.scss'],
})
export class NewAccountAddressesElementComponent {

  @Input() formGroup: FormGroup<AccountAddressFormGroup>;
  @Input() addressTypes: AccountAddressType[] = [];
  @Input() countrys: CountryDetail[] = [];
  @Input() addressFormats: { Id: string; Name: string; }[] = [];
  @Output() onDeleteFormGroup = new EventEmitter<void>();

  @ViewChild('addressSearchField') addressSearchField: ElementRef<HTMLInputElement>;

  suburbList: PostCodeDetail[] = [];
  stateList: AccountAddressStateType[] = [];
  addressList: { Address: string }[] = [];
  showSpinner: boolean;

  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private accountAddressesService: AccountAddressesService,
    private tranService: TranService,
    private spinnerService: SpinnerService,
  ) { }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  deleteFormGroup(): void {
    this.onDeleteFormGroup.emit();
  }

  selectSuburb(suburb: PostCodeDetail): void {
    this.formGroup.controls.State.setValue(suburb.StateCode);
    this.formGroup.controls.CountryCode.setValue(suburb.CountryCode);
  }

  selectCountry(): void {
    this.formGroup.controls.State.reset();
    this.getStateList(this.formGroup.controls.CountryCode.value, 'update');
  }

  addressKyeUp(event): void {
    const els = [13, 16, 17, 18, 20, 27, 37, 38, 39, 40, 91];
    if (!els.includes(event.keyCode)) {
      if (this.formGroup.controls.Address.value.length === 8) {
        this.getAddressList(this.formGroup.controls.Address.value);
      }

      timer(1000)
        .pipe(takeUntil(this.unsubscribeAll$))
        .subscribe(() => {
          if (this.formGroup.controls.Address.value !== '') {
            this.getAddressList(this.formGroup.controls.Address.value);
          }
        });
    }
  }

  focustOutAddress(): void {
    this.showSpinner = false;
  }

  changeAddressFormat(addressFormat: { Id: string; Name: string } ): void {
    if (addressFormat.Id === 'ADDRESSIFY') {
      if (this.formGroup.controls.AddressLine1.value) {
        this.getAddressList(this.formGroup.controls.AddressLine1.value);
      }
    }
  }

  selectAddress(Term: string): void {
    this.addressSearchField.nativeElement.blur();
    this.spinnerService.loading();
    this.accountAddressesService.getAustraliaAddressDetail({ Term })
      .pipe(
        takeUntil(this.unsubscribeAll$),
        finalize(() => this.spinnerService.end())
      )
      .subscribe({
        next: result => {          
          this.formGroup.controls.AddressLine1.setValue(
            this.checkStringValue(result.BuildingName) + this.checkStringValue(result.LevelType)
              + this.checkStringValue(result.LevelNumber) + this.checkStringValue(result.UnitType) +
              this.checkStringValue(result.UnitNumber) + this.checkStringValue(result.StreetLine)
          );
          this.formGroup.controls.Suburb.setValue(result.Suburb);
          this.formGroup.controls.State.setValue(result.State);
          this.formGroup.controls.PostCode.setValue(result.Postcode);
          this.formGroup.controls.CountryCode.setValue('AU');

          this.getInitialSuburbList(result.Postcode, 'AU');
          this.getStateList('AU', 'initial');
        },
        error: error => this.tranService.errorMessage(error)
      })
  }

  checkPostalCode(): void {
    if (this.formGroup.controls.PostCode.valid) {
      this.spinnerService.loading();
      const countryCode = this.formGroup.controls.CountryCode.valid
        ? this.formGroup.controls.CountryCode.value
        : this.countrys.find(s => s.Default).Code;

      this.accountAddressesService.getPostalLocalities(this.formGroup.controls.PostCode.value, countryCode)
        .pipe(
          takeUntil(this.unsubscribeAll$),
          finalize(() => this.spinnerService.end())
        )
        .subscribe({
          next: result => {
            if (!!result) {
              this.getStateList(countryCode, 'update');
              this.formGroup.controls.State.reset();
              this.formGroup.controls.CountryCode.reset();
              this.suburbList = result;
            }
          },
          error: error => this.tranService.errorMessage(error)
        });
    }
  }

  
  private getAddressList(Term): void {
    this.showSpinner = true;
    this.addressList = [];

    this.accountAddressesService.getAustraliaAddressList({ Term })
      .pipe(
        takeUntil(this.unsubscribeAll$),
        finalize(() => this.showSpinner = false)
      )
      .subscribe({
        next: result => setTimeout(() => this.addressList = result, 500),
        error: error => this.tranService.errorMessage(error)
      });
  }
  
  private checkStringValue(value): string {
    return value || '';
  }

  private getInitialSuburbList(postCode: string, countryCode: string): void {
    this.spinnerService.loading();
    this.accountAddressesService.getPostalLocalities(postCode, countryCode)
      .pipe(
        takeUntil(this.unsubscribeAll$),
        finalize(() => this.spinnerService.end())
      )
      .subscribe({
        next: result => this.suburbList = result,
        error: error => this.tranService.errorMessage(error)
      });
  }

  private getStateList(countryCode: string, statement: 'initial' | 'update'): void {
    this.spinnerService.loading();
    this.accountAddressesService.getAddressStates(countryCode)
      .pipe(
        takeUntil(this.unsubscribeAll$),
        finalize(() => this.spinnerService.end())
      )
      .subscribe({
        next: result => {
          this.stateList = result;
          if (!result && statement === 'update') {
            this.formGroup.controls.State.setValue(result.find(s => !!s.Default).Code);
          }
        },
        error: error => this.tranService.errorMessage(error)
      });
  }

}
