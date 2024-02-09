import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { TranService } from 'src/services';
import { TokenInterface, Token_config } from 'src/app/model';
import { GlobalService } from 'src/services/global-service.service';
import { PaymentMethodsService, SpinnerService } from 'src/app/Shared/services';

@Component({
  selector: 'app-payment-methods-new-credit-card',
  templateUrl: './payment-methods-new-credit-card.component.html',
  styleUrls: ['./payment-methods-new-credit-card.component.scss'],
})
export class PaymentMethodsNewCreditCardComponent implements OnInit, OnDestroy {

  formGroup: FormGroup;
  showFutureDate: boolean;
  maskCardNumber = [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  expireMonth: any[] =  [];
  expireYear: any[] = [];

  imagesForPaymentMethod: { Src: string; PaymentMethodCode: string }[] = [
    { Src: 'assets/imgs/payment/small_visa_icon.svg', PaymentMethodCode: 'VI' },
    { Src: 'assets/imgs/payment/small_two_point.svg', PaymentMethodCode: 'MC' },
    { Src: 'assets/imgs/payment/small_amex.svg', PaymentMethodCode: 'AM' },
    { Src: 'assets/imgs/payment/small_disc_ver.svg', PaymentMethodCode: 'DC' },
    { Src: 'assets/imgs/payment/direct-debit-1.svg', PaymentMethodCode: 'DD' }
  ]
  
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    public globService: GlobalService,
    private tranService: TranService,
    private spinnerService: SpinnerService,
    private paymentMethodsService: PaymentMethodsService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<PaymentMethodsNewCreditCardComponent>,
    @Inject(Token_config) private tokens: TokenInterface,
    @Inject(MAT_DIALOG_DATA) private data: { contactCode: string }
  ) { }

  ngOnInit(): void {
    this.setDefaultExpireState();

    this.formGroup = this.formBuilder.group({
      PayCode: '',
      FutureDate: '',
      AccountNumber: ['', [Validators.required, Validators.minLength(19)]],
      AccountName: [this.tokens.Name, Validators.required],
      ExpiryDate: '',
      CVV: '',
      StartDateTime: new Date().toISOString(),
      CustomerOwned: true,
      Token: null,
      Tokenise: false,
      Exported: false,
      ProtectNumber: false,
      Default: false,
      AllowExisting: false,
      CheckConfiguration: true,
      Name: '',
      CompanyName: '',
      AddressLine1: '',
      AddressLine2: '',
      City: '',
      State: '',
      Country: '',
      PhoneNumber: '',
      ExpireMonth: ['', Validators.required],
      ExpireYear: ['', Validators.required]
    })

    this.formGroup.get('AccountNumber').valueChanges
      .pipe(debounceTime(2000))
      .subscribe({
        next: result => {
          if (this.formGroup.get('AccountNumber').valid) {
            this.checkValidateCardNumber(result);
          }
        }
      });

    this.formGroup.get('ExpireYear').valueChanges
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe(result => {
        this.selectExpireYear(result);
      })
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  get formControls(): { [key: string]: AbstractControl<any, any> } {
    return this.formGroup.controls;
  }

  onSubmit(): void {
    let expDate = new Date();
    expDate.setMonth(this.formGroup.get('ExpireMonth').value);
    expDate.setFullYear(this.formGroup.get('ExpireYear').value);

    const reqBody = { 
      ...this.formGroup.value,
      AccountNumber: (this.formGroup.get('AccountNumber').value).replace(/-/g, ''),
      ExpiryDate: expDate.toISOString()
    };

    this.spinnerService.loading();
    this.paymentMethodsService.addCreditCardPaymentMethod(reqBody, this.data.contactCode)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: () => {      
          this.spinnerService.end();
          this.dialogRef.close('ok');
        }, 
        error: error => {
          this.spinnerService.end();      
          this.tranService.errorMessage(error);
        }
      });
  }

  updateFuterDate(): void {
    this.showFutureDate
      ? this.formGroup.get('FutureDate').enable()
      : this.formGroup.get('FutureDate').disable();
  }

  submitTrigger(): void {
    document.getElementById('creditCardFormSubmitButton').click();
  }

  private setDefaultExpireState(): void {
    for (let i = 1; i < 13; i++) {
      this.expireMonth.push(this.convertNumberToString(i));
    }

    for (let i = new Date().getFullYear(); i < new Date().getFullYear() + 10; i++) {
      this.expireYear.push(i);
    }
  }

  private selectExpireYear(result): void {
    if (parseInt(result, 10) === new Date().getFullYear()) {

      if (parseInt(this.formGroup.get('ExpireMonth').value, 10) < new Date().getMonth() + 1) {
        this.formGroup.get('ExpireMonth').setValue('');
        this.formGroup.get('ExpireMonth').setErrors({ 'invalid': true });
      }
      this.expireMonth = new Array();
      for (let i = new Date().getMonth() + 1; i < 13; i++) {
        this.expireMonth.push(this.convertNumberToString(i));
      }
    } else {
      this.expireMonth = new Array();
      for (let i = 1; i < 13; i++) {
        this.expireMonth.push(this.convertNumberToString(i));
      }
    }
  }

  private convertNumberToString(value): string {
    return value < 10 ? '0' + value : value;
  }

  private checkValidateCardNumber(cardNumber): void {
    this.spinnerService.loading();

    this.paymentMethodsService.validateCreditCardNumber(cardNumber.replace(/-/g, ''))
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result: any) => {
          this.spinnerService.end();
          
          if (!!result) {
            if (result.ValidationStatus && result.ValidationStatus === 'Error') {
              this.formGroup.get('AccountNumber').setErrors({ 'incorrect': true });
            } else {
              this.formGroup.get('PayCode').setValue(result.PayCode);
            }
          } else {
            this.formGroup.get('AccountNumber').setErrors({ 'incorrect': true });
          }
        },
        error: async (error: any) => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      });
  }
}
