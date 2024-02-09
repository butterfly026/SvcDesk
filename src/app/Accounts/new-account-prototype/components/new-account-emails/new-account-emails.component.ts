import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { TranService } from 'src/services';
import { AccountEmailsService } from '../../services';
import { AccountEmailMandatoryRule, AccountEmailTypeItem, AccountEmailsFormGroup } from '../../models';

@Component({
  selector: 'app-new-account-emails',
  templateUrl: './new-account-emails.component.html',
  styleUrls: ['./new-account-emails.component.scss'],
})
export class NewAccountEmailsComponent implements OnInit {

  @Input() formGroup: FormGroup<AccountEmailsFormGroup>;
  @Input() contactCode: string = '';

  emailTypeList: AccountEmailTypeItem[] = [];
  
  private unsubscribeAll$: Subject<any> = new Subject<any>();
  private mandatoryList: AccountEmailMandatoryRule[] = [];

  constructor(
    private accountEmailsService: AccountEmailsService,
    private tranService: TranService,
    private formBuilder: FormBuilder
  ){}

  ngOnInit(): void {
    this.addNewEmail();
    this.getEmailTypes();
    this.getMandatoryList();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  get accountEmailsFormControl(): FormArray {
    return this.formGroup.controls.Emails as FormArray;
  }

  addNewEmail(): void {
    this.accountEmailsFormControl.push(this.formBuilder.group({
      EmailAddress: ['', [Validators.required, Validators.email]],
      EmailTypes: ['', [Validators.required, this.mandatoryListValidator()]]
    }));
  }

  deleteEmail(index: number): void {
    this.accountEmailsFormControl.removeAt(index);
  }

  private getMandatoryList(): void {
    this.accountEmailsService.getAccountEmailMandatoryRules(this.contactCode)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => this.mandatoryList = result,
        error: error => this.tranService.errorMessage(error)
      });
  }

  private getEmailTypes(): void {
    this.accountEmailsService.getEmailTypeList()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => this.emailTypeList = result,
        error: error => this.tranService.errorMessage(error)
      });
  }

  private mandatoryListValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.value?.length && !this.mandatoryList.every(s => control.value.includes(s.typeCode)) 
        ? { MandatodyValidation: this.tranService.instant('EveryEmailMustHave') + ' ' + this.mandatoryList.map(s => s.type + ',') }
        : null;
    };
  }

}
