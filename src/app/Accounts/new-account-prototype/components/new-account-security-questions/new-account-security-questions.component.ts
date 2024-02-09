import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TranService } from 'src/services';
import { AccountIdentificationService } from '../../services';
import { AccountSecurityQuestionFormGroup, AccountSecurityQuestionsFormGroup, AccountType, SecurityQuestion } from '../../models';

@Component({
  selector: 'app-new-account-security-questions',
  templateUrl: './new-account-security-questions.component.html',
  styleUrls: ['./new-account-security-questions.component.scss'],
})
export class NewAccountSecurityQuestionsComponent implements OnInit {

  @Input() formGroup: FormGroup<AccountSecurityQuestionsFormGroup>;
  @Input() accountType: AccountType;

  securityQuestions: SecurityQuestion[] = [];

  private minimumNumberOfQuestions: number = 0;
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private tranService: TranService,
    private accountIdentificationService: AccountIdentificationService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.getSecurityQuestions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.accountType?.currentValue) {
      this.getMandatoryList();
    }
    
    if (changes.formGroup?.currentValue) {
      this.formGroup.controls.IdentificationQuestions.setValidators(this.mandatoryListValidator());
      this.addNewSecurityQuestion();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  get accountSecurityQuestionsFormControl(): FormArray<FormGroup<AccountSecurityQuestionFormGroup>> {
    return this.formGroup.controls.IdentificationQuestions as FormArray<FormGroup<AccountSecurityQuestionFormGroup>>;
  }

  addNewSecurityQuestion(): void {
    this.accountSecurityQuestionsFormControl.push(this.formBuilder.group({
      Answer: ['', Validators.required],
      QuestionId: ['', Validators.required]
    }));
  }

  deleteSecurityQuestion(index: number): void {
    this.accountSecurityQuestionsFormControl.removeAt(index);
  }

  private getSecurityQuestions(): void {
    this.accountIdentificationService.getSecurityQuestions()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => this.securityQuestions = result,
        error: error => this.tranService.errorMessage(error)
      })
  }

  private getMandatoryList(): void {
    this.accountIdentificationService.getIdentificationMandatoryRules(this.accountType)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => this.minimumNumberOfQuestions = result.MinimumNumberOfQuestions,
        error: error => this.tranService.errorMessage(error)
      });
  }

  private mandatoryListValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.value?.length && control.value?.length < this.minimumNumberOfQuestions
        ? { MandatodyValidation: this.tranService.instant('SecurityQuestionsShouldBeSetAtLeast') + ' : ' + this.minimumNumberOfQuestions }
        : null;
    };
  }

}
