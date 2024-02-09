import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountEmail, AccountEmailMandatoryRule, AccountEmailTypeItem, AccountEmailsEmitter } from './models';
import { AccountEmailsService } from './services';
import { TranService } from 'src/services';


@Component({
  selector: 'app-account-emails',
  templateUrl: './account-emails.component.html',
  styleUrls: ['./account-emails.component.scss'],
})
export class AccountEmailsComponent implements OnInit, OnDestroy {

  @Input() ContactCode: string = '';
  @Output("AccountEmailsComponent") AccountEmailsComponent: EventEmitter<AccountEmailsEmitter> = new EventEmitter<AccountEmailsEmitter>();

  formGroup: FormGroup;
  emailTypeList: AccountEmailTypeItem[] = []

  private unsubscibeAll$: Subject<any> = new Subject<any>();
  private mandatoryList: AccountEmailMandatoryRule[] = [];

  constructor(
    private accountEmailsService: AccountEmailsService,
    private tranService: TranService,
    private formBuilder: FormBuilder
  ){
    this.formGroup = this.formBuilder.group({
      AccountEmailsUsage: new FormArray([])
    });
    this.formGroup.valueChanges.subscribe(() => {
      this.AccountEmailsComponent.emit({
        type: 'valueChanges',
        data: this.formGroup.valid
      })
    })
  }

  ngOnInit(): void {
    this.addNewEmail();
    this.getEmailTypes();
  }

  ngOnDestroy(): void {
    this.unsubscibeAll$.next(null);
    this.unsubscibeAll$.complete();
  }

  get accountEmailsFormControl(): FormArray {
    return this.formGroup.get('AccountEmailsUsage') as FormArray;
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

  getEmailTypes(): void {
    this.accountEmailsService.getEmailTypeList()
      .pipe(takeUntil(this.unsubscibeAll$))
      .subscribe({
        next: result => this.emailTypeList = result,
        error: error => this.tranService.errorMessage(error)
      });
  }

  getSubmitData(): AccountEmail[] {
    return this.formGroup.valid
      ? this.accountEmailsFormControl.controls.map((list:FormGroup) => ({
          EmailAddress: list.get('EmailAddress').value,
          EmailTypes: list.get('EmailTypes').value.map((item:string) => ({Code: item}))
        }))
      : [];
  }

  private mandatoryListValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.value?.length && !this.mandatoryList.every(s => control.value.includes(s.typeCode)) 
        ? { MandatodyValidation: this.tranService.instant('EveryEmailMustHave') + ' ' + this.mandatoryList.map(s => s.type + ',') }
        : null;
    };
  }
  
}
