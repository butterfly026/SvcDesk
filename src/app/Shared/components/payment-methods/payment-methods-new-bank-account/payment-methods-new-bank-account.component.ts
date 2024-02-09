import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { PaymentMethodsService, SpinnerService } from 'src/app/Shared/services';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-payment-methods-new-bank-account',
  templateUrl: './payment-methods-new-bank-account.component.html',
  styleUrls: ['./payment-methods-new-bank-account.component.scss'],
})
export class PaymentMethodsNewBankAccountComponent implements OnInit, OnDestroy {

  formGroup: FormGroup;

  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    public globService: GlobalService,
    private spinnerSerice: SpinnerService,
    private paymentMethodsService: PaymentMethodsService,
    private tranService: TranService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<PaymentMethodsNewBankAccountComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { contactCode: string }
  ) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      AccountNumber: ['', Validators.required], 
      AccountName: ['', Validators.required],
      BSB: ['', Validators.required],
      Default: false,
      CheckConfiguration: true
    })
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  submitTrigger(): void {
    document.getElementById('bankAccountFormSubmitButton').click();
  }

  onSubmit(): void {
    this.spinnerSerice.loading();
    this.paymentMethodsService.addBankPaymentMethod(this.formGroup.value, this.data.contactCode)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: () => {
          this.spinnerSerice.end();
          this.dialogRef.close('ok');
        },
        error: error => {
          this.spinnerSerice.end();
          this.tranService.errorMessage(error);
        }
      })
  }
}
