import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { debounceTime } from 'rxjs/operators';
import { Token_config, TokenInterface } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { NewPaymentMethodModalService } from './services/payment-method-modal.service';

@Component({
  selector: 'app-payment-method-modal',
  templateUrl: './payment-method-modal.component.html',
  styleUrls: ['./payment-method-modal.component.scss'],
})
export class PaymentMethodModalComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Input() Type: string = '';
  @Input() ComponentType = '';
  @Output('PaymentMethodNewComponent') PaymentMethodNewComponent: EventEmitter<string> = new EventEmitter<string>();


  @ViewChild('inputCardName') inputCardName: ElementRef;


  paymentForm: UntypedFormGroup;
  maskCardNumber = [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  typeList = [
    { id: 'C', name: 'credit_card' },
    { id: 'D', name: 'direct_debit' },
  ];
  expireMonth = [];
  expireYear = [];

  makeDefault: boolean = false;
  useContactAddress: boolean = false;
  checkCardState: boolean = false;
  PayCode: string = '';
  cardNumberValue: string = '';
  PaymentProviderId: number;
  Tokenise: boolean = false;
  customerOwned: boolean = false;

  minDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());
  futureDate: boolean = false;

  constructor(
    private loading: LoadingService,
    private tranService: TranService,

    private cdr: ChangeDetectorRef,
    private formBuilder: UntypedFormBuilder,
    private paymentService: NewPaymentMethodModalService,
    public globService: GlobalService,
    @Inject(Token_config) private tokens: TokenInterface,
    private modalCtrl: ModalController,
  ) {


    this.tranService.translaterService();
    this.paymentForm = this.formBuilder.group({
      Type: [''],
    });

    this.setDefaultExpireState();

    this.paymentForm.get('Type').valueChanges.subscribe(async (result: any) => {
      if (result) {

        switch (result) {
          case 'C':
            this.addFormControl('CardHolderName', this.tokens.Name, [Validators.required]);
            this.addFormControl('CreditCardNumber', '', [Validators.required, Validators.minLength(12)]);
            this.addFormControl('ExpireMonth', '', [Validators.required]);
            this.addFormControl('ExpireYear', '', [Validators.required]);

            this.paymentForm.get('CreditCardNumber').valueChanges.pipe(debounceTime(2000)).subscribe(async (result) => {
              if (result && this.paymentForm.get('CreditCardNumber').valid) {
                this.checkValidateCardNumber();
              } else {
              }
            })

            this.removeFormControl('DirectName');
            this.removeFormControl('DirectAccount');
            this.removeFormControl('DirectBSB');

            this.paymentForm.get('ExpireYear').valueChanges.subscribe(result => {
              this.selectExpireYear();
            })
            this.setFocusType('CreditCardNumber');
            break;
          case 'D':
            this.addFormControl('DirectName', '', [Validators.required]);
            this.addFormControl('DirectAccount', '', [Validators.required]);
            this.addFormControl('DirectBSB', '', [Validators.required]);

            this.removeFormControl('CardHolderName');
            this.removeFormControl('CreditCardNumber');
            this.removeFormControl('ExpireMonth');
            this.removeFormControl('ExpireYear');
            this.setFocusType('DirectName');
            break;
          default:
            break;
        }
      }
    });
  }

  async checkValidateCardNumber() {
    if (this.paymentForm.get('CreditCardNumber').valid) {
      await this.loading.present();
      let cardNum = this.paymentForm.get('CreditCardNumber').value;
      cardNum = cardNum.replace(/-/g, '');

      this.paymentService.ValidateCreditCardNumber(cardNum).subscribe(async (result: any) => {
        await this.loading.dismiss();

        if (result !== null && typeof (result) !== 'undefined') {
          if (result.ValidationStatus && result.ValidationStatus === 'Error') {
            this.paymentForm.get('CreditCardNumber').setErrors({ 'incorrect': true });
          } else {
            this.PayCode = result.PayCode;
            setTimeout(() => {
              this.inputCardName.nativeElement.focus();
            }, 1000);
            this.getPaymentProvider();

          }
        } else {
          this.paymentForm.get('CreditCardNumber').setErrors({ 'incorrect': true });
        }
      }, async (error: any) => {
        await this.loading.dismiss();

        this.tranService.errorMessage(error);
      });
    }
  }

  async getPaymentProvider() {
    if (this.paymentForm.get('CreditCardNumber').valid) {
      await this.loading.present();

      this.paymentService.getPaymentProvider(this.ContactCode, this.PayCode, 'WebPayment').subscribe(async (result: any) => {
        await this.loading.dismiss();
        if (result) {
          this.PaymentProviderId = result.ProviderId;
          this.Tokenise = result.Tokenise;
        }
      }, async (error: any) => {
        await this.loading.dismiss();

        this.tranService.errorMessage(error);
      });
    }
  }
  ngOnInit() {
    this.paymentForm.get('Type').setValue(this.Type);
  }

  get f() {
    return this.paymentForm.controls;
  }

  setDefaultExpireState() {
    for (let i = 1; i < 13; i++) {
      this.expireMonth.push(this.convertNumberToString(i));
    }

    for (let i = new Date().getFullYear(); i < new Date().getFullYear() + 10; i++) {
      this.expireYear.push(i);
    }
  }

  convertNumberToString(value) {
    if (value < 10) {
      return '0' + value;
    } else {
      return value;
    }
  }

  selectExpireYear() {
    if (parseInt(this.paymentForm.get('ExpireYear').value, 10) === new Date().getFullYear()) {

      if (parseInt(this.paymentForm.get('ExpireMonth').value, 10) < new Date().getMonth() + 1) {
        this.paymentForm.get('ExpireMonth').setValue('');
        this.paymentForm.get('ExpireMonth').setErrors({ 'invalid': true });
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

  addFormControl(ctrlName, value, validators) {
    if (!this.paymentForm.contains(ctrlName)) {
      this.paymentForm.addControl(ctrlName, new UntypedFormControl(value, validators));
    }
  }

  removeFormControl(ctrlName) {
    if (this.paymentForm.contains(ctrlName)) {
      this.paymentForm.removeControl(ctrlName);
    }
  }

  formSubmit() {
    if (this.paymentForm.valid) {
      if (this.Type === 'C') {
        this.submitCreditForm();
      } else if (this.Type === 'D') {
        this.submitBankForm();
      }
    }
  }

  async submitCreditForm() {
    let expDate = new Date();

    expDate.setMonth(this.paymentForm.get('ExpireMonth').value);
    expDate.setFullYear(this.paymentForm.get('ExpireYear').value);
    const reqParam = {
      PayCode: this.PayCode,
      PostalCode: '',
      State: '',
      City: '',
      AddressLine2: '',
      AddressLine1: '',
      CompanyName: '',
      Name: '',
      CheckConfiguration: true,
      Default: this.makeDefault,
      Country: '',
      Tokenise: this.Tokenise,
      ProtectNumber: false,
      Exported: false,
      Token: null,
      CustomerOwned: this.customerOwned,
      StartDateTime: this.futureDate ? this.paymentForm.get('futureDate').value : new Date(),
      ExpiryDate: expDate.toISOString(),
      CVV: '',
      AccountName: this.paymentForm.get('CardHolderName').value,
      AccountNumber: (this.paymentForm.get('CreditCardNumber').value).replace(/-/g, ''),
      PaymentProviderId: this.PaymentProviderId,
      PhoneNumber: ''
    };
    // const reqParam = {
    //   'PayCode': this.PayCode,
    //   'AccountNumber': '',
    //   'AccountName': '',
    //   'ExpiryDate': '',
    //   'CVV': '',
    //   'StartDateTime': this.futureDate ? this.paymentForm.get('futureDate').value : new Date(),
    //   'CustomerOwned': this.paymentForm.get('customerOwned').value,
    //   'Token': null,
    //   'Exported': false,
    //   'ProtectNumber': false,
    //   'Default': this.makeDefault,
    //   'AllowExisting': false,
    //   'CheckConfiguration': true,
    //   'FirstName': '',
    //   'CompanyName': '',
    //   'AddressLine1': '',
    //   'AddressLine2': '',
    //   'City': '',
    //   'State': '',
    //   'Country': '',
    //   'PhoneNumber': '',
    //   Tokenise: this.Tokenise,
    //   PaymentProviderId: this.PaymentProviderId,
    //   ContactCode: this.ContactCode,
    // }

    await this.loading.present();
    this.paymentService.CustomerCreditCardPaymentMethodAdd(this.ContactCode, reqParam).subscribe(async (result: any) => {
      await this.loading.dismiss();
      this.PaymentMethodNewComponent.emit('added&&&' + JSON.stringify(this.paymentForm.value));
      this.closeModal('success');
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  async getBankPaymentProvider() {
  }
  async submitBankForm() {
    await this.loading.present();

    this.paymentService.getPaymentProvider(this.ContactCode, 'DD', 'WebPayment').subscribe(async (result: any) => {
      await this.loading.dismiss();
      if (result) {
        const reqBody = {
          AccountNumber: this.paymentForm.get('DirectAccount').value,
          AccountName: this.paymentForm.get('DirectName').value,
          BSB: this.paymentForm.get('DirectBSB').value,
          Default: this.makeDefault,
          CheckConfiguration: true,
          PaymentProviderId: result.ProviderId,
          Tokenise: result.Tokenise
        }

        await this.loading.present();
        this.paymentService.CustomerBankPaymentMethodAdd(reqBody, this.ContactCode).subscribe(async (result: any) => {
          await this.loading.dismiss();
          this.PaymentMethodNewComponent.emit('added&&&' + JSON.stringify(this.paymentForm.value));
          this.closeModal('success');
        }, async (error: any) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        })
      }
    }, async (error: any) => {
      await this.loading.dismiss();

      this.tranService.errorMessage(error);
    });
  }

  submitTrigger() {
    document.getElementById('paymentFormSubmitButton').click();
  }

  cancelAdd() {
    this.PaymentMethodNewComponent.emit('close');
    this.closeModal(null);
  }

  async closeModal(data) {
    if (this.ComponentType === 'modal') {
      if (data === 'success') {
        this.globService.cardStateSubject.next('added_new_card');
      }
      await this.modalCtrl.dismiss(data);
    }
  }

  updateFuterDate() {
    if (this.futureDate) {
      this.paymentForm.addControl('futureDate', new UntypedFormControl('', Validators.required));
    } else {
      this.paymentForm.removeControl('futureDate');
    }
  }

  setFocusType(idName) {
    if (document.getElementById(idName) === null || typeof (document.getElementById(idName)) === 'undefined') {
      setTimeout(() => {
        this.setFocusType(idName);
      }, 500);
    } else {
      document.getElementById(idName).click();
    }
  }

}
