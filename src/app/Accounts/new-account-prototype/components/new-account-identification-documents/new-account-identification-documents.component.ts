import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AccountIdentificationDocumentFormGroup, AccountIdentificationDocumentsFormGroup, AccountType, IdentificationMandatoryRule, IdentificationType } from '../../models';
import { Subject } from 'rxjs';
import { AccountIdentificationService } from '../../services';
import { takeUntil } from 'rxjs/operators';
import { TranService } from 'src/services';

@Component({
  selector: 'app-new-account-identification-documents',
  templateUrl: './new-account-identification-documents.component.html',
  styleUrls: ['./new-account-identification-documents.component.scss'],
})
export class NewAccountIdentificationDocumentsComponent implements OnChanges {

  @Input() formGroup: FormGroup<AccountIdentificationDocumentsFormGroup>;
  @Input() accountType: AccountType;

  identificationTypes: IdentificationType[] = [];

  private minimumPoints: number = 0;
  private mandatoryList: IdentificationMandatoryRule[] = [];
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private formBuilder: FormBuilder,
    private tranService: TranService,
    private accountIdentificationService: AccountIdentificationService
  ) { }

  ngOnInit(): void {
    this.getIdentificationTypes();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.accountType?.currentValue) {
      this.getMandatoryList();
    }

    if (changes.formGroup?.currentValue) {
      this.formGroup.controls.IdentificationItem.setValidators(this.mandatoryListValidator())
      this.addNewIdentificationDocument();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  get accountIdentificationDocumentFormControl(): FormArray<FormGroup<AccountIdentificationDocumentFormGroup>> {
    return this.formGroup.controls.IdentificationItem as FormArray<FormGroup<AccountIdentificationDocumentFormGroup>>;
  }

  addNewIdentificationDocument(): void {
    this.accountIdentificationDocumentFormControl.push(this.formBuilder.group({
      TypeId: ['', [Validators.required, Validators.email]],
      Value: ['', [Validators.required]],
      ExpiryDate: ['', [Validators.required]],
      IssueDate: ['', [Validators.required]],
    }));
  }

  deleteIdentificationDocument(index: number): void {
    this.accountIdentificationDocumentFormControl.removeAt(index);
  }

  private getIdentificationTypes(): void {
    this.accountIdentificationService.getIdentificationTypes()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => this.identificationTypes = result,
        error: error => this.tranService.errorMessage(error)
      });
  }

  private getMandatoryList(): void {
    this.accountIdentificationService.getIdentificationMandatoryRules(this.accountType)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => {
          this.minimumPoints = result.MinimumPoints;
          this.mandatoryList = result.IdentificationTypes;
        },
        error: error => this.tranService.errorMessage(error)
      });
  }

  private mandatoryListValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.value?.length && !this.mandatoryList.every(s => control.value.some(t => t.TypeId === s.TypeId))
        ? { MandatodyValidation: this.tranService.instant('FollowingDocumentsShouldBeAdded') + ' : ' + this.mandatoryList.map(s => ' ' + s.Type).toString() }
        : null;
    };
  }

}
