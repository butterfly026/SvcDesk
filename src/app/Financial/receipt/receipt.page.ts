import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ReceiptPaymentService } from './services/receipt.service';
import { TranService, LoadingService, ToastService } from 'src/services';

import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { debounceTime } from 'rxjs/operators';
import { ReceiptItem } from 'src/app/model/ReceiptItem/ReceiptItem';

import { GlobalService } from 'src/services/global-service.service';
import { PaymentMethodModalComponent } from 'src/app/Payment/payment-method-modal/payment-method-modal.component';
import { ReceiptPost } from './models';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.page.html',
  styleUrls: ['./receipt.page.scss'],
})
export class ReceiptPage implements OnInit {
  @Input() ContactCode: string = '';
  @Output('ReceiptNewComponent') ReceiptNewComponent: EventEmitter<string> = new EventEmitter<string>();

  paymentList: Array<ReceiptItem> = [];
  allocationList = [];
  selectedIndex = 0;

  receiptFormGroup: UntypedFormGroup;

  minDate = new Date();
  maxDate = new Date(2100, 12, 31);

  creditList = [];
  cashForm: UntypedFormGroup;

  autoAllocation: boolean = true;
  receiptAmountStr: string = '';

  surchargeCurrency: any;
  collectState: boolean = false;
  CreateDocument: boolean = false;
  Email: boolean = false;

  private paymentId: number;
  private selectedCreditCard: any;
  private pollTimer: number = 0;

  constructor(
    private tranService: TranService,
    private loading: LoadingService,
    private receiptService: ReceiptPaymentService,
    private formBuilder: UntypedFormBuilder,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private toast: ToastService,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();

    this.receiptFormGroup = this.formBuilder.group({
      'number': [{ value: '', disabled: true }, [Validators.required]],
      'amount': [0, Validators.required],
      'date': [new Date(), [Validators.required, Validators.min(0)]],
      Reference: [''],
      surcharge: [{ value: 0, disabled: true }],
    });

    this.receiptAmountStr = this.globService.getCurrencyConfiguration(0);

    this.receiptFormGroup.get('amount').valueChanges.pipe(debounceTime(1000)).subscribe((result: any) => {
      if (result === 0) {
        this.receiptFormGroup.get('amount').setErrors({ required: true });
      } else if (result < 0) {
        this.receiptFormGroup.get('amount').setValue(Math.abs(result));
      }

      this.cashForm.get('cash').setValue(0);
      this.cashForm.get('cheque').setValue(0);

      this.receiptAmountStr = this.globService.getCurrencyConfiguration(result);
      this.checkTotalAmount();
      if (result) {
        this.getSurchargeDetail(result);
      }
    });

    this.cashForm = this.formBuilder.group({
      cash: [0,],
      cheque: [0,],
    });

    this.cashForm.get('cheque').valueChanges.subscribe((result: any) => {
      if (result === 0) {
      } else if (result < 0) {
        this.cashForm.get('cheque').setValue(Math.abs(result));
      } else {
        this.cashForm.addControl('chequeNumber', new UntypedFormControl('', [Validators.maxLength(20)]));
        this.cashForm.addControl('bsb', new UntypedFormControl('', [Validators.pattern('[0-9]{6,6}')]));
      }
      this.checkTotalAmount();
    });

    this.cashForm.get('cash').valueChanges.subscribe((result: any) => {
      if (result === 0) {
      } else if (result < 0) {
        this.cashForm.get('cash').setValue(Math.abs(result));
      }
      this.checkTotalAmount();
    });
  }

  private checkTotalAmount(): void {
    this.receiptFormGroup.get('amount').markAsTouched();
    let sum = this.cashForm.get('cash').value + this.cashForm.get('cheque').value;
    let total = this.receiptFormGroup.get('amount').value;
    if (total < sum) {
      this.receiptFormGroup.get('amount').setErrors({ invalid: true });

      if (this.cashForm.get('cash').value > total) {
        this.cashForm.get('cash').setErrors({ invalid: true });
      } else {
        this.cashForm.get('cash').setErrors(null);
        setTimeout(() => {
          this.cashForm.get('cheque').setValue(total - this.cashControls.cash.value);
        }, 500);
      }

      if (this.cashForm.get('cheque').value !== 0) {
        this.cashForm.get('cheque').setErrors({ invalid: true });
      } else {
        this.cashForm.get('cheque').setErrors(null);
        setTimeout(() => {
          this.cashForm.get('cash').setValue(total - this.cashControls.cheque.value);
        }, 500);
      }

    } else {
      if (total === 0) {
      } else {
        this.receiptFormGroup.get('amount').setErrors(null);
        this.cashForm.get('cash').setErrors(null);
        this.cashForm.get('cheque').setErrors(null);
      }
    }
  }

  private async getPaymentList() {

    await this.loading.present();

    this.paymentList = [];
    this.receiptService.getPaymentMethodLists(this.ContactCode).subscribe(async (result: any) => {
      await this.loading.dismiss();

      const convResult = this.globService.ConvertKeysToLowerCase(result);
      if (result === null) {
        this.tranService.errorMessage('no_receipts');
      } else {
        this.creditList = convResult.map(s => ({
          ...s,
          categorycode: 'C',
          select: false,
          cardEnd: this.getCardEndNumber(s.accountnumber)
        }))
        if (!this.paymentId) {
          const selCreditIdx = this.creditList.findIndex(item => item.default === true);
          if (selCreditIdx == -1)
            this.selectPayment(0, true);
          else
            this.selectPayment(selCreditIdx, true);
        } else {
          const selCreditIdx = this.creditList.findIndex(item => item.id === this.paymentId);
          if (selCreditIdx == -1) return;
          this.selectPayment(selCreditIdx, true);
        }

      }

    }, async (error: any) => {
      await this.loading.dismiss();

      this.tranService.errorMessage(error);
    });

  }

  private getCardEndNumber(number) {
    const removedStr = number.replace(/ /g, '');
    return removedStr.substr(removedStr.length - 4);
  }

  selectPayment(index: number, selOrDesel?: boolean): void {
    if (!selOrDesel && this.selectedCreditCard?.id === this.creditList[index]?.id) {
      this.creditList = this.creditList.map(it => { it.select = false; return it; });
      this.selectedCreditCard = null;
      this.surchargeCurrency = null;
      this.paymentId = null;
    } else {
      this.selectedCreditCard = this.creditList[index];
      this.creditList = this.creditList.map(it => { it.select = false; return it; });
      this.selectedCreditCard.select = true;
      this.paymentId = this.selectedCreditCard.id;
      this.getSurchargeDetail(this.f.amount.value);
    }
  }

  private async getSurchargeDetail(amount) {
    if (this.paymentId) {
      await this.loading.present();
      this.receiptService.gSurchargeDetail(this.paymentId, amount, 'WebService').subscribe(async (result: any) => {
        await this.loading.dismiss();
        const convResult = this.globService.ConvertKeysToLowerCase(result);

        if (convResult?.surchargeamount > 0) {
          this.f.surcharge.setValue(convResult?.surchargeamount);
          this.surchargeCurrency = convResult?.surchargeamount;
        }

      }, async (error: any) => {
        await this.loading.dismiss();
        this.tranService.errorMessage(error);
      })
    }
  }

  async ngOnInit() {
    await this.getInvoiceNumber();
    this.getPaymentList();
  }

  private async getInvoiceNumber() {
    await this.loading.present();
    this.receiptService.getInvoiceNumber('R').subscribe(async (result: any) => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result);

      this.receiptFormGroup.get('number').setValue(convResult.number);

    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  get f() {
    return this.receiptFormGroup.controls;
  }

  get cashControls() {
    return this.cashForm.controls;
  }

  selectTabs(tab) {
    this.selectedIndex = tab.index;
    if (this.selectedIndex === 0) {
      this.getPaymentList();
    }
  }

  goBack() {
    this.ReceiptNewComponent.emit('financials')
  }

  private closeReceipt() {
    this.ReceiptNewComponent.emit('close')
  }

  submitTrigger() {
    document.getElementById('submitFinancialReceiptButton').click();
  }

  private async submitNewReceiptForm() {
    if (this.receiptFormGroup.valid && this.cashForm.valid) {
      const reqData: ReceiptPost = {
        Number: this.f.number.value,
        Date: this.f.date.value,
        Amount: this.f.amount.value,
        OtherReference: this.f.Reference.value,
        SourceCode: 'MN',
        StatusCode: 'CR',
        Collect: this.paymentId ? true : false,
        AutoAllocate: this.autoAllocation,
        Allocations: [],
        CreateDocument: this.CreateDocument,
        Email: this.Email,
        ChequeNumber: this.cashForm.contains('chequeNumber') ? this.cashControls.chequeNumber.value : null,
      }

      for (let list of this.allocationList) {
        reqData.Allocations.push({ Id: list.id, Amount: list.amount_to_allocate, })
      }

      if (this.paymentId) {
        reqData.PaymentMethodId = this.paymentId;
      }
      if (this.f.surcharge.value && Math.abs(this.f.surcharge.value) > 0) {
        reqData['SurchargeAmount'] = this.f.surcharge.value;

      }

      await this.loading.present();
      this.receiptService.addReceipt(this.ContactCode, reqData).subscribe(async (result: any) => {
        await this.loading.dismiss();

        const convResult = this.globService.ConvertKeysToLowerCase(result);
        if (this.collectState) {
          const reqData = {
            id: convResult.id
          }
          this.callPollCheck(reqData);
          this.confirmAlloteAlert();
        } else {
          const toastStr = await this.tranService.convertText('save_receipt_success').toPromise();
          this.toast.present(toastStr);
          setTimeout(() => {
            this.closeReceipt();
          }, 1000);
        }

      }, async (error: any) => {
        await this.loading.dismiss();
        this.tranService.errorMessage(error);
      });
    }
  }

  async newReceipt() {
    if (this.receiptFormGroup.valid && this.cashForm.valid) {
      if (this.selectedCreditCard && this.selectedCreditCard?.onlineenabled === true) {
        const msgTxt = await this.tranService.convertText('collect_money_alert').toPromise();
        const yesStr = await this.tranService.convertText('yes').toPromise();
        const noStr = await this.tranService.convertText('no').toPromise();
        const alert = await this.alertCtrl.create({
          message: msgTxt,
          buttons: [
            {
              text: yesStr,
              handler: () => {
                this.collectState = true;
                this.submitNewReceiptForm();
              }
            },
            {
              text: noStr,
              role: 'Cancel',
              handler: () => {
                this.collectState = false;
                this.submitNewReceiptForm();
              }
            }
          ]
        });

        await alert.present();
      } else {
        this.collectState = false;
        this.submitNewReceiptForm();
      }
    }

  }

  async goToPayment(type) {
    const modal = await this.modalCtrl.create({
      component: PaymentMethodModalComponent,
      componentProps: {
        ContactCode: this.ContactCode,
        Type: type,
        ComponentType: 'modal',
      },
    });

    modal.onDidDismiss().then(async (result: any) => {

      if (result.data) {
        this.getPaymentList();
      }
    });

    await modal.present();
  }

  updateAllocations(event: ReceiptItem[]): void {
    this.allocationList = [...event];
  }

  toggleAutoAllocation(event) {
    this.autoAllocation = event;
  }

  get getAmountCollect() {
    const amount = this.f.amount.value + this.f.surcharge.value;
    return this.globService.getCurrencyConfiguration(parseFloat(amount.toFixed(2)));
  }

  private callPollCheck(reqData): void {
    this.receiptService.PollCalculate(reqData.id).subscribe(async (result: any) => {
      const convResult = this.globService.ConvertKeysToLowerCase(result);

      if (convResult.status === 'Approved') {
        if (parseInt(reqData.id) % 2 === 1) {
          const toastStr = await this.tranService.convertText('payment_cancelled').toPromise();
          let reason = convResult?.reason ? convResult?.reason : 'Fake payment';
          let lastError = convResult?.lasterror ? convResult?.lasterror : 'Fake payment';
          this.tranService.errorToastOnly(toastStr + '<br />' + await this.tranService.convertText('reason').toPromise() + ' : ' + reason + '<br />' + await this.tranService.convertText('last_error').toPromise() + ' : ' + lastError);
        } else {
          const toastStr = await this.tranService.convertText('payment_approved').toPromise();
          this.tranService.errorToastOnly(toastStr);
        }
      } else {
        if (this.pollTimer < 60000) {
          setTimeout(() => {
            this.pollTimer += 5000;
            this.callPollCheck(reqData);
          }, 5000);
        } else {
          const toastStr = await this.tranService.convertText('payment_cancelled').toPromise();
          let reason = convResult?.reason ? convResult?.reason : 'Fake payment';
          let lastError = convResult?.lasterror ? convResult?.lasterror : 'Fake payment';
          this.tranService.errorToastOnly(toastStr + '<br />' + await this.tranService.convertText('reason').toPromise() + ' : ' + reason + '<br />' + await this.tranService.convertText('last_error').toPromise() + ' : ' + lastError);
        }
      }
    }, async (error: any) => {
      this.tranService.errorMessage(error);
    });
  }

  private async confirmAlloteAlert() {
    const msgStr = await this.tranService.convertText('collection_process_toast').toPromise();
    const okStr = await this.tranService.convertText('ok').toPromise();
    const alert = await this.alertCtrl.create({
      message: msgStr,
      buttons: [
        {
          text: okStr,
        }
      ]
    });

    await alert.present();
  }

  changeCreateDocument(event): void {
    this.CreateDocument = event.args.checked;
  }

  changeEmail(event): void {
    this.Email = event.args.checked;
  }

  get creditCardsList(): any[] {
    return this.creditList.filter(item => item.paymentmethodcode != 'DD');
  }

  get directDevitsList(): any[] {
    return this.creditList.filter(item => item.paymentmethodcode === 'DD');
  }
}
