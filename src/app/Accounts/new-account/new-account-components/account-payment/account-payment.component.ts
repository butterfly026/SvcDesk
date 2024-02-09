import { Component, OnInit,AfterViewInit , ViewChild, ElementRef, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { Router, } from '@angular/router';
import { AccountPaymentMethodService } from './services/account-payment-method.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormControl } from '@angular/forms';
import {CustomerPaymentMethodAdd, ValidCardNumberItem, StatusHistory, DefaultUsageHistory, ContactPaymentMethods} from 'src/app/model';
import { NavController } from '@ionic/angular';
import { ToastService, LoadingService, TranService } from 'src/services';


import * as moment from 'moment';
import { jqxMenuComponent } from 'jqwidgets-ng/jqxmenu';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-account-payment',
  templateUrl: './account-payment.component.html',
  styleUrls: ['./account-payment.component.scss'],
})
export class AccountPaymentComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Output('ContactPaymentMethodComponent') ContactPaymentMethodComponent: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('inputCardName') inputCardName: ElementRef;
  @ViewChild('jqxContactPaymentCreditMenu') jqxContactPaymentCreditMenu: jqxMenuComponent; 

  //istillLoaded  = false;    
  pageTitle: string = '';
  methodList: any[];
  toggleValue: any;
  stepForm1: UntypedFormGroup;

  makeDefault: boolean = false;
  useContactAddress: boolean = false;
  checkCardState: boolean = false;
  PayCode: string = '';
  cardNumberValue: string = '';

  addStep: string = '';
  maskCardNumber = [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  public expireMonth: any[];
  public expireYear: any[];

  BankForm: UntypedFormGroup;
  bankState: string = '';

  bankList: any[] = [];
  contextMenuCreditList = [];
  contextMenuBankList = [];

  statusHistoryStr: string = '';
  defaultUsageHistoryStr: string = '';

  CreditHistoryState: string = '';
  SelectedStatusHistory: Array<StatusHistory> = [];
  SelectedUsageDefaultHistory: Array<DefaultUsageHistory> = [];
  BankHistoryState: string = '';

    constructor(
    private router: Router,
    private navCtrl: NavController,
    private toast: ToastService,
    private loading: LoadingService,
    private tranService: TranService,
    private cPMLNewService: AccountPaymentMethodService,

    private cdr: ChangeDetectorRef,
    private formbuilder: UntypedFormBuilder,
    public globService: GlobalService,
  ) {

    this.expireMonth = new Array();
    this.expireYear = new Array();

    for (let i = 1; i < 13; i++) {
      this.expireMonth.push(i);
    }

    for (let i = new Date().getFullYear(); i < 2025; i++) {
      this.expireYear.push(i);
    }

    this.tranService.translaterService();
    this.tranService.convertText('payment_method').subscribe(value => {
      this.pageTitle = value;
    });


    this.stepForm1 = this.formbuilder.group({
      // PaymentType: ['', Validators.required],
      cardNumber: ['', [
        Validators.required,
        Validators.pattern('[0-9][0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]')
      ]],
      cardName: ['', Validators.required],
      // cvv: ['', [
      //   Validators.required,
      //   Validators.pattern('[0-9]{1,4}')]
      // ],
      month: ['', Validators.required],
      year: ['', Validators.required]
    });
    this.BankForm = this.formbuilder.group({
      DirectName: ['', Validators.required],
      DirectAccount: ['', Validators.required],
      DirectBSB: ['', Validators.required],
    });

    this.tranService.convertText('status_history').subscribe(result => {
      this.statusHistoryStr = result;
    });
    this.tranService.convertText('default_usage_history').subscribe(result => {
      this.defaultUsageHistoryStr = result;
    })
  }
  ngOnInit() {}

  goToNew() {
    this.addStep = '1';
  }

  goToNewTill() {
    this.addStep = '3';
  }

  getCardEndNumber(number) {
    const removedStr = number.replace(/ /g, '');
    return removedStr.substr(removedStr.length - 4);
  }

  editCard(index) {
  }

  async deleteCard(index, type) {
    let reqParam;
    if (type === 'card') {
      reqParam = {
        Id: this.methodList[index].data.id,
        From: new Date().toISOString(),
        Status: this.methodList[index].data.statuscode,
        ReOpen: null,
        FollowUp: new Date().toISOString(),
        // From: '2020-05-30T03:16:47.967Z',
        // Status: this.methodList[index].data.statuscode,
        // ReOpen: '2020-06-30T03:16:47.967Z',
        // FollowUp: '2020-05-30T03:16:47.967Z',
        Note: 'test'
        // Note: this.methodList[index].data.note
      };
    } else if (type === 'bank') {
      reqParam = {
        Id: this.bankList[index].data.id,
        From: new Date().toISOString(),
        Status: this.bankList[index].data.statuscode,
        ReOpen: null,
        FollowUp: new Date().toISOString(),
        // From: '2020-05-30T03:16:47.967Z',
        // Status: this.methodList[index].data.statuscode,
        // ReOpen: '2020-06-30T03:16:47.967Z',
        // FollowUp: '2020-05-30T03:16:47.967Z',
        Note: 'test'
        // Note: this.methodList[index].data.note
      };
    }
    if (type === 'card') {
      this.methodList.splice(index, 1);
    } else if (type === 'bank') {
      this.bankList.splice(index, 1);
    }
  }

  async getBothList() {
    
  }

  async onChangeToggle(index) {

    await this.loading.present();
    const reqParam = {
      'Id': this.methodList[index].data.id,
      'From': new Date().toISOString(),
      'Status': this.methodList[index].data.statuscode,
    }
    this.cPMLNewService.MakeDefault(reqParam).subscribe(async (result: any) => {
      await this.loading.dismiss();
      for (let i = 0; i < this.methodList.length; i++) {
        if (i === index) {

        } else {
          this.methodList[i].toggleValue = false;
        }
      }
      for (let list of this.bankList) {
        list.toggleValue = false;
      }
      
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  async onChangeToggleBank(index) {
    await this.loading.present();
    const reqParam = {
      'Id': this.methodList[index].data.id,
      'From': new Date().toISOString(),
      'Status': this.methodList[index].data.statuscode,
    }
    this.cPMLNewService.MakeDefault(reqParam).subscribe(async (result: any) => {
      await this.loading.dismiss();
      for (let i = 0; i < this.bankList.length; i++) {
        if (i === index) {

        } else {
          this.bankList[i].toggleValue = false;
        }
      }
      for (let list of this.methodList) {
        list.toggleValue = false;
      }
      
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }
  get f() {
    return this.stepForm1.controls;
  }

  selectExpireYear() {
    if (parseInt(this.stepForm1.controls['year'].value, 10) === new Date().getFullYear()) {
      if (parseInt(this.stepForm1.controls['month'].value, 10) < new Date().getMonth() + 1) {
        this.stepForm1.controls['month'].setValue('');
        this.stepForm1.controls['month'].setErrors({ 'invalid': true });
      }
      this.expireMonth = new Array();
      for (let i = new Date().getMonth() + 1; i < 13; i++) {
        this.expireMonth.push(i);
      }
    } else {
      this.expireMonth = new Array();
      for (let i = 1; i < 13; i++) {
        this.expireMonth.push(i);
      }
    }
  }

  completeStep1() {
    if (this.stepForm1.valid && this.PayCode !== '') {
      this.completeStep2();
    }
  }

  async completeStep2() {
    const reqParam = {
      'PayCode': this.PayCode,
      'AccountNumber': '',
      'AccountName': '',
      'ExpiryDate': '',
      'CVV': '',
      'StartDateTime': '',
      'CustomerOwned': true,
      'Token': null,
      'Exported': false,
      'ProtectNumber': false,
      'Tokenise': false,
      'Default': this.makeDefault,
      'AllowExisting': false,
      'CheckConfiguration': true,
      'FirstName': '',
      'CompanyName': '',
      'AddressLine1': '',
      'AddressLine2': '',
      'City': '',
      'State': '',
      'Country': '',
      'PhoneNumber': '',
      ContactCode: this.ContactCode,
    }
    reqParam.AccountNumber = (this.stepForm1.controls['cardNumber'].value).replace(/-/g, '');
    reqParam.AccountName = this.stepForm1.controls['cardName'].value;
    // reqParam.CVV = this.stepForm1.controls['cvv'].value;
    // reqParam.ExpiryDate = this.stepForm1.controls['month'].value + '/'
    //   + this.stepForm1.controls['year'].value;

    let expDate = new Date();

    expDate.setMonth(this.stepForm1.get('month').value);
    expDate.setFullYear(this.stepForm1.get('year').value);

    reqParam.ExpiryDate = expDate.toISOString();
    // reqParam.StartDateTime = new Date().toISOString().split('T')[0] + ' 00:00:00';
    reqParam.StartDateTime = new Date().toISOString();
    reqParam.CustomerOwned = true;
    let list = this.globService.ConvertKeysToLowerCase(reqParam);
    
    const temp = {
      data: list,
      expireDate: this.globService.newDateFormat(list.expirydate),
      toggleValue: list.default,
      cardEnd: this.getCardEndNumber(list.accountnumber)
    };
    this.methodList.push(temp);
    
    this.addStep = '';
    this.makeDefault = false;
    this.formatForms();
  }

  formatForms() {
    this.stepForm1.reset();
  }


  cancelAddPayment() {
    this.addStep = '';
    this.formatForms();
  }

  backAddCard() {
    this.addStep = '1';
  }

  convertDate(value) {
    if (value === null || typeof (value) === 'undefined') {
      return '';
    } else {
      return moment(value).format('MM/YY');
    }
  }

  async focusOutCreditCard() {
    this.checkCardState = false;
    if (this.stepForm1.controls['cardNumber'].value !== '' && this.stepForm1.controls['cardNumber'].valid) {
      await this.loading.present();
      let cardNum = this.stepForm1.controls['cardNumber'].value;
      cardNum = cardNum.replace(/-/g, '');
      this.cPMLNewService.ValidateCreditCardNumber(cardNum).subscribe(async (result: any) => {
        await this.loading.dismiss();
        
        if (result !== null && typeof (result) !== 'undefined') {
          if (!result.Message || result.Message === 'W' || result.Message === 'E' || result.Message === 'Error' || result.Message.toLowerCase().includes('invalid')) {
            this.checkCardState = true;
            this.stepForm1.controls['cardNumber'].setErrors({ 'incorrect': true });
          } else {
            this.PayCode = result.PayCode;
            // this.stepForm1.controls['PaymentType'].setValue(result.PayCode);
          }
        } else {
          this.checkCardState = true;
          this.stepForm1.controls['cardNumber'].setErrors({ 'incorrect': true });
        }
      }, async (error: any) => {
        await this.loading.dismiss();
        
        this.tranService.errorMessage(error);
      });
    }
  }

  async cardNumberKeydown(en: any, inputCardName) {
    if (this.stepForm1.controls['cardNumber'].value !== '' && this.stepForm1.controls['cardNumber'].valid
      && this.stepForm1.controls['cardNumber'].value.length === 19) {
      await this.loading.present();
      let cardNum = this.stepForm1.controls['cardNumber'].value;
      cardNum = cardNum.replace(/-/g, '');
      this.cPMLNewService.ValidateCreditCardNumber(cardNum).subscribe(async (result: ValidCardNumberItem) => {
        await this.loading.dismiss();
        
        if (result !== null && typeof (result) !== 'undefined') {
          if (result.ValidationStatus &&  result.ValidationStatus === 'Error') {
            this.checkCardState = true;
            this.stepForm1.controls['cardNumber'].setErrors({ 'incorrect': true });
          } else {
            this.PayCode = result.PayCode;
            setTimeout(() => {
              this.inputCardName.nativeElement.focus();
            }, 1000);
          }
        } else {
          this.checkCardState = true;
          this.stepForm1.controls['cardNumber'].setErrors({ 'incorrect': true });
        }
      }, async (error: any) => {
        await this.loading.dismiss();
        
        this.tranService.errorMessage(error);
      });
    }
  }

  cvvKeydown(en: any) {
    if ((parseInt(en.key, 10) > -1 && parseInt(en.key, 10) < 10)
      || en.key === 'Backspace' || en.key === 'Enter') {
      if (this.stepForm1.controls['cvv'].value.length > 3) {
        let cardNumberValue = this.stepForm1.controls['cvv'].value;
        cardNumberValue = cardNumberValue.slice(0, -1);
        this.stepForm1.controls['cvv'].setValue(cardNumberValue);
      }
    } else {
      let cardNumberValue = this.stepForm1.controls['cvv'].value;
      cardNumberValue = cardNumberValue.slice(0, -1);
      this.stepForm1.controls['cvv'].setValue(cardNumberValue);
    }
  }

  submitTriggerBank() {
    if (this.BankForm.valid) {
      const reqBody = {
        AccountNumber: this.BankForm.get('DirectAccount').value,
        AccountName: this.BankForm.get('DirectName').value,
        BSB: this.BankForm.get('DirectBSB').value,
        CheckConfiguration: true,
        Default: this.makeDefault
      }
      let list = this.globService.ConvertKeysToLowerCase(reqBody);
      let item = {
        data: list,
        toggleValue: list.default
      }
      this.bankList.push(item);
    }
  }

  async submitBank() {
    
  }

  goToNewBank() {
    this.bankState = 'AddBank';
  }

  cancelAddBank() {
    this.bankState = '';
    this.BankForm.reset();
  }

  contextMenuCredit(): boolean {
    return false;
  }

  mousedownCredit(event: any, indexJ) {
    this.contextMenuCreditList = [];
    const rightClick = this.isRightClick(event) || jqx.mobile.isTouchDevice();
    if (rightClick) {
      let statusHistory = this.methodList[indexJ].data.statushistory;
      let deUsHistory = this.methodList[indexJ].data.defaultusagehistory;
      if (statusHistory.length > 0) {
        let customStHistory = {
          label: this.statusHistoryStr,
          categoryCode: 'status',
          type: 'Credit',
          statusHistory: statusHistory
        }

        this.contextMenuCreditList.push(customStHistory);
      }

      if (deUsHistory.length > 0) {

        let customStHistory = {
          label: this.defaultUsageHistoryStr,
          categoryCode: 'default',
          type: 'Credit',
          deUsHistory: deUsHistory
        }

        this.contextMenuCreditList.push(customStHistory);
      }
      if (this.contextMenuCreditList.length > 0) {
        this.openContextMenu(event);
      }
      return false;
    }
  }

  isRightClick(event: any): boolean {
    let rightclick;
    if (!event) event = window.event;
    if (event.which) rightclick = (event.which === 3);
    else if (event.button) rightclick = (event.button === 2);
    return rightclick;
  }

  openContextMenu(event) {
    if (typeof (this.jqxContactPaymentCreditMenu) === 'undefined' || this.jqxContactPaymentCreditMenu === null) {
      setTimeout(() => {
        this.openContextMenu(event);
      }, 500);
    } else {
      this.jqxContactPaymentCreditMenu.open(parseInt(event.clientX, 10), parseInt(event.clientY, 10));
    }
  }

  getElementIndex(samArray, comString) {
    for (let list of samArray) {
      if (list.label === comString) {
        if (list.type === 'Credit') {
          if (list.categoryCode === 'status') {
            this.SelectedStatusHistory = list.statusHistory;
            this.CreditHistoryState = 'statusHistory';
          } else if (list.categoryCode === 'default') {
            this.SelectedUsageDefaultHistory = list.deUsHistory;
            this.CreditHistoryState = 'deUsHistory';
          }
        } else if (list.type === 'Bank') {
          if (list.categoryCode === 'status') {
            this.SelectedStatusHistory = list.statusHistory;
            this.BankHistoryState = 'statusHistory';
          } else if (list.categoryCode === 'default') {
            this.SelectedUsageDefaultHistory = list.deUsHistory;
            this.BankHistoryState = 'deUsHistory';
          }
        }
      }
    }
  }

  contextMenuBank(): boolean {
    return false;
  }

  mousedownBank(event: any, indexJ) {
    this.contextMenuCreditList = [];
    const rightClick = this.isRightClick(event) || jqx.mobile.isTouchDevice();
    if (rightClick) {
      let statusHistory: Array<StatusHistory> = this.bankList[indexJ].data.statushistory;
      let deUsHistory: Array<DefaultUsageHistory> = this.bankList[indexJ].data.defaultusagehistory;
      if (statusHistory.length > 0) {
        let customStHistory = {
          label: this.statusHistoryStr,
          categoryCode: 'status',
          type: 'Bank',
          statusHistory: statusHistory
        }

        this.contextMenuCreditList.push(customStHistory);
      }

      if (deUsHistory.length > 0) {

        let customStHistory = {
          label: this.defaultUsageHistoryStr,
          categoryCode: 'default',
          type: 'Bank',
          deUsHistory: deUsHistory
        }

        this.contextMenuCreditList.push(customStHistory);
      }
      if (this.contextMenuCreditList.length > 0) {
        this.openContextMenu(event);
      }
      return false;
    }
  }

  Itemclick(en) {
    this.getElementIndex(this.contextMenuCreditList, en.target.innerText);
    this.jqxContactPaymentCreditMenu.close();
  }

  processCredit(event) {
    if (event === 'close') {
      this.CreditHistoryState = '';
    }
  }

  processBank(event) {
    if (event === 'close') {
      this.BankHistoryState = '';
    }
  }


  //till
  onTillClosed(eventData: { closed: boolean }) {
    console.log(eventData);
    if(eventData.closed){
    this.addStep = '';    
    }
  }
}
