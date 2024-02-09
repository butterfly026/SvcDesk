import { FormArray, FormGroup, FormBuilder, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TranService } from 'src/services';
import { AccountPhoneService } from '../../services';
import { AccountContactPhonesFormGroup, AccountPhoneMandatoryRule, AccountPhoneTypeItem } from '../../models';

@Component({
  selector: 'app-new-account-contact-phones',
  templateUrl: './new-account-contact-phones.component.html',
  styleUrls: ['./new-account-contact-phones.component.scss'],
})
export class NewAccountContactPhonesComponent implements OnInit {

  @Input() formGroup: FormGroup<AccountContactPhonesFormGroup>;
  @Input() contactCode: string = '';

  phoneTypeList: AccountPhoneTypeItem[] = [];

  private mandatoryList: AccountPhoneMandatoryRule[] = [];
  private unsubscribeAll$: Subject<any> = new Subject<any>();
  
  constructor(
    private accountPhoneService: AccountPhoneService,
    private tranService: TranService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.addNewPhone();
    this.getMandatoryList();
    this.getPhoneTypes();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  get accountPhonesFormControl(): FormArray {
    return this.formGroup.controls.ContactPhones as FormArray;
  }

  addNewPhone(): void {
    this.accountPhonesFormControl.push(this.formBuilder.group({
      PhoneNumber: ['', [Validators.required, Validators.pattern('[0-9]{5,}')]],
      PhoneTypes: ['', [Validators.required, this.mandatoryListValidator()]]
    }));
  }

  deletePhone(index: number): void {
    this.accountPhonesFormControl.removeAt(index);
  }

  private getMandatoryList(): void {
    this.accountPhoneService.getAccountPhoneMandatoryRules(this.contactCode)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => this.mandatoryList = result,
        error: error => this.tranService.errorMessage(error)
      });
  }

  private getPhoneTypes(): void {
    this.accountPhoneService.getPhoneTypeList()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => this.phoneTypeList = result,
        error: error => this.tranService.errorMessage(error)
      });
  }

  private mandatoryListValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.value?.length && !this.mandatoryList.every(s => control.value.includes(s.TypeCode)) 
        ? { MandatodyValidation: this.tranService.instant('EveryPhoneNumberMustHave') + ' ' + this.mandatoryList.map(s => s.Type + ',') }
        : null;
    };
  }


}
