import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, UntypedFormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { AccountPhoneService } from './services';
import { AccountPhoneMandatoryRule, AccountPhoneTypeItem, AccountPhoneEmitter, AccountPhone } from './models';

@Component({
  selector: 'app-account-phone',
  templateUrl: './account-phone.component.html',
  styleUrls: ['./account-phone.component.scss']
})
export class AccountPhoneComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Output('AccountPhoneComponent') AccountPhoneComponent: EventEmitter<AccountPhoneEmitter> = new EventEmitter<AccountPhoneEmitter>();

  formGroup: FormGroup;
  saveState: boolean = false;
  phoneTypeList: AccountPhoneTypeItem[] = [];
  indexOfFormGroupValidatingPhoneNumber: number = null;
  
  private phoneNumberErrorMssageFromBackend: string;
  private mandatoryList: AccountPhoneMandatoryRule[] = [];
  private unsubscribeAll$: Subject<any> = new Subject<any>();
  
  constructor(
    private tranService: TranService,
    private accountPhoneService: AccountPhoneService,
    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    this.formGroup = this.formBuilder.group({
      AccountPhoneUsage: new FormArray([])
    });
    this.formGroup.valueChanges.subscribe(() => {
      this.AccountPhoneComponent.emit({
        type: 'valueChange',
        data: this.formGroup.valid
      });
    });
  }

  ngOnInit(): void {
    this.addNewPhone();
    this.getMandatoryList();
    this.getPhoneTypes();
  }

  get accountPhonesFormControl(): FormArray {
    return this.formGroup.get('AccountPhoneUsage') as FormArray;
  }

  addNewPhone(): void {
    this.accountPhonesFormControl.push(this.formBuilder.group({
      PhoneNumber: ['', [Validators.required, Validators.pattern('[0-9]{5,}')]],
      PhoneTypes: ['', [Validators.required, this.mandatoryListValidator()]]
    }));
  }

  getMandatoryList(): void {
    this.accountPhoneService.getAccountPhoneMandatoryRules(this.ContactCode)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => this.mandatoryList = result,
        error: error => this.tranService.errorMessage(error)
      });
  }

  getPhoneTypes(): void {
    this.accountPhoneService.getPhoneTypeList()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => this.phoneTypeList = result,
        error: error => this.tranService.errorMessage(error)
      });
  }

  deletePhone(index: number): void {
    this.accountPhonesFormControl.removeAt(index);
  }
  
  checkPhoneNumberFromBackend(event: Event, i: number): void {
    if (this.accountPhonesFormControl.controls[i].get('PhoneNumber').valid) {
      this.indexOfFormGroupValidatingPhoneNumber = i;

      this.accountPhoneService.getPhoneNumberValidationResult((event.target as HTMLInputElement).value)
        .pipe(takeUntil(this.unsubscribeAll$))
        .subscribe({
          next: result => {
            this.indexOfFormGroupValidatingPhoneNumber = null;
            if (!result.Valid) {
              this.phoneNumberErrorMssageFromBackend = result.Results.map(s => s.Message).toString();
              this.accountPhonesFormControl.controls[i].get('PhoneNumber').setErrors({
                'BackendValidation': !this.phoneNumberErrorMssageFromBackend 
                  ? this.tranService.instant('invalid_phone_number') 
                  : this.phoneNumberErrorMssageFromBackend
              });
            }
          },
          error: error => {
            this.indexOfFormGroupValidatingPhoneNumber = null;
            this.tranService.errorMessage(error);
          }
        });
    }
  }

  getSubmitData(): AccountPhone[] {
    return ( this.formGroup.valid) 
      ? this.accountPhonesFormControl.controls.map((list:FormGroup)=>({
          PhoneNumber: list.get('PhoneNumber').value,
          PhoneTypes: list.get('PhoneTypes').value.map((item:string)=>({ Code:item }))
        })) 
      : [];
  }

  private mandatoryListValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.value?.length && !this.mandatoryList.every(s => control.value.includes(s.TypeCode)) 
        ? { MandatodyValidation: this.tranService.instant('EveryPhoneNumberMustHave') + ' ' + this.mandatoryList.map(s => s.Type + ',') }
        : null;
    };
  }
}
