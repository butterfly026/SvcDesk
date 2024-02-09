import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AccountPhoneFormGroup, AccountPhoneTypeItem } from '../../../models';
import { takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AccountPhoneService } from '../../../services';
import { TranService } from 'src/services';

@Component({
  selector: 'app-new-account-contact-phones-element',
  templateUrl: './new-account-contact-phones-element.component.html',
  styleUrls: ['./new-account-contact-phones-element.component.scss'],
})
export class NewAccountContactPhonesElementComponent implements OnInit {

  @Input() formGroup: FormGroup<AccountPhoneFormGroup>;
  @Input() phoneTypeList: AccountPhoneTypeItem[] = [];
  @Output() onDeleteFormGroup = new EventEmitter<void>();

  isLoading: boolean;

  private phoneNumberErrorMssageFromBackend: string;
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private accountPhoneService: AccountPhoneService,
    private tranService: TranService
  ) { }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }
  
  deleteFormGroup(): void {
    this.onDeleteFormGroup.emit();
  }

  checkPhoneNumberFromBackend(event: Event): void {
    if (this.formGroup.controls.PhoneNumber.valid) {
      this.isLoading = true;
      this.accountPhoneService.getPhoneNumberValidationResult((event.target as HTMLInputElement).value)
        .pipe(
          takeUntil(this.unsubscribeAll$),
          finalize(() => this.isLoading = false)
        )
        .subscribe({
          next: result => {
            if (!result.Valid) {
              this.phoneNumberErrorMssageFromBackend = result.Results.map(s => s.Message).toString();
              this.formGroup.controls.PhoneNumber.setErrors({
                'BackendValidation': !this.phoneNumberErrorMssageFromBackend 
                  ? this.tranService.instant('invalid_phone_number') 
                  : this.phoneNumberErrorMssageFromBackend
              });
            }
          },
          error: error => this.tranService.errorMessage(error)
        });
    }
  }

}
