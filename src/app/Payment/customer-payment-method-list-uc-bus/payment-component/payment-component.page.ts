import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { CountryItem, CustomerPaymentMethodListItem, CustomerPaymentMethodAdd } from 'src/app/model';
import { NavController } from '@ionic/angular';
import { ToastService, LoadingService, TranService } from 'src/services';
import { PaymentComponentService } from './services/payment-component.service';

import * as moment from 'moment';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-payment-component',
  templateUrl: './payment-component.page.html',
  styleUrls: ['./payment-component.page.scss'],
})
export class PaymentComponentPage implements OnInit {

  @Input() ContactCode: string = '';
  @Output('PaymentMethodComponent') PaymentMethodComponent: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('inputCardName') inputCardName: ElementRef;

  pageTitle: string = '';

  methodList: any[];

  toggleValue: any;

  stepForm1: UntypedFormGroup;
  stepForm2: UntypedFormGroup;

  makeDefault: boolean = false;
  useContactAddress: boolean = false;
  checkCardState: boolean = false;
  PayCode: string = '';
  cardNumberValue: string = '';

  addStep: string = '';
  maskCardNumber = [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  public expireMonth: any[];
  public expireYear: any[];

  countryList: Array<CountryItem> = [];

  constructor(
    private navCtrl: NavController,
    private toast: ToastService,
    private loading: LoadingService,
    private tranService: TranService,
    private cPMLNewService: PaymentComponentService,
    
    private cdr: ChangeDetectorRef,
    private formbuilder: UntypedFormBuilder,
    public globService: GlobalService,
  ) {


    this.stepForm2 = this.formbuilder.group({
      firstName: ['', Validators.required],
      companyName: ['', Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postCode: ['', Validators.required],
      country: ['', Validators.required],
      phoneNumber: ['', Validators.required],
    });

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


    this.getMethodList();

    // this.cPMLNewService.getCountryList().subscribe((result: CountryItem[]) => {
    //   this.countryList = result;
    // }, (error: any) => {
    //   
    //   this.tranService.errorMessage(error);
    // });
  }

  ngAfterViewChecked() {
  }

  overTable(index) {
    const element = document.getElementById('customeTableBody' + index);
    const elementDetail = element.getElementsByClassName('custom-table-body-td');
    for (let i = 0; i < elementDetail.length; i++) {
      elementDetail[i].classList
        .add('jqx-fill-state-hover', 'jqx-fill-state-hover-' + this.globService.themeColor);
    }
  }

  leaveTable(index) {
    const element = document.getElementById('customeTableBody' + index);
    const elementDetail = element.getElementsByClassName('custom-table-body-td');
    for (let i = 0; i < elementDetail.length; i++) {
      elementDetail[i].classList
        .remove('jqx-fill-state-hover', 'jqx-fill-state-hover-' + this.globService.themeColor);
    }
  }

  async getMethodList() {
    await this.loading.present();

    this.cPMLNewService.getMethodList().subscribe(async (result: CustomerPaymentMethodListItem[]) => {
      
      this.methodList = new Array();
      await this.loading.dismiss();
      if (result === null) {
        this.tranService.specialErrorMessage('noPayment', '');
      } else {
        for (const list of result) {
          const temp = { 'data': list, 'expireDate': this.globService.newDateFormat(list.ExpiryDate), 'toggleValue': list.Default, 'cardEnd': this.getCardEndNumber(list.AccountNumber) };
          this.methodList.push(temp);
        }
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  async getMethodListWithOutLoading() {
    await this.loading.present();

    this.cPMLNewService.getMethodList().subscribe(async (result: CustomerPaymentMethodListItem[]) => {
      
      this.methodList = new Array();
      await this.loading.dismiss();
      if (result === null) {
        this.tranService.specialErrorMessage('noPayment', '');
      } else {
        for (const list of result) {
          const temp = { 'data': list, 'expireDate': this.globService.newDateFormat(list.ExpiryDate), 'toggleValue': list.Default, 'cardEnd': this.getCardEndNumber(list.AccountNumber) };
          this.methodList.push(temp);
        }
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  ngOnInit() {
  }

  async onChangeToggle(index) {
    for (let i = 0; i < this.methodList.length; i++) {
      if (i === index) {

      } else {
        this.methodList[i].toggleValue = false;
      }
    }
    await this.loading.present();
    const reqParam = {
      'Id': this.methodList[index].data.id,
      'From': new Date().toISOString(),
      'Status': this.methodList[index].data.statuscode,
    }
    this.cPMLNewService.MakeDefault(reqParam).subscribe(async (result: any) => {
      await this.loading.dismiss();
      
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  goToNew() {
    this.addStep = '1';
    this.addFormControl();
  }

  addFormControl() {
    this.stepForm1 = this.formbuilder.group({
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
    // this.stepForm1.controls.cvv.setValue('0000');
  }

  removeFormControl() {
    this.stepForm1.removeControl('cardNumber');
    this.stepForm1.removeControl('cardName');
    // this.stepForm1.removeControl('cvv');
    this.stepForm1.removeControl('month');
    this.stepForm1.removeControl('year');
  }

  goBack() {
    if (this.methodList.length > 0) {
      this.PaymentMethodComponent.emit('close');
    } else {
      this.PaymentMethodComponent.emit('emptyMethod');
    }
  }

  getCardEndNumber(number) {
    const removedStr = number.replace(/ /g, '');
    return removedStr.substr(removedStr.length - 4);
  }

  editCard(index) {
  }

  async deleteCard(index) {
    const reqParam = {
      id: this.methodList[index].data.id
    };
    // this.methodList.splice(index, 1);
    await this.loading.present();
    this.cPMLNewService.CustomerPaymentMethodStatusChange(reqParam).subscribe(async (result: any) => {
      
      await this.loading.dismiss();
      this.methodList.splice(index, 1);
      // this.getMethodList();
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  get f() {
    return this.stepForm1.controls;
  }

  get ff() {
    return this.stepForm2.controls;
  }

  selectExpireYear() {
    // tslint:disable-next-line:radix
    if (parseInt(this.stepForm1.controls['year'].value) === new Date().getFullYear()) {
      // tslint:disable-next-line:radix
      if (parseInt(this.stepForm1.controls['month'].value) < new Date().getMonth() + 1) {
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
      // this.addStep = '2';
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
      'Token': '',
      'Exported': false,
      'ProtectNumber': false,
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
      'PhoneNumber': ''
    }
    reqParam.AccountNumber = (this.stepForm1.controls['cardNumber'].value).replace(/-/g, '');
    reqParam.AccountName = this.stepForm1.controls['cardName'].value;
    // reqParam.CVV = this.stepForm1.controls['cvv'].value;
    reqParam.ExpiryDate = this.stepForm1.controls['month'].value + '/'
      + this.stepForm1.controls['year'].value;
    reqParam.StartDateTime = new Date().toISOString().split('T')[0] + ' 00:00:00';
    reqParam.CustomerOwned = true;
    reqParam.FirstName = this.stepForm2.controls['firstName'].value;
    reqParam.CompanyName = this.stepForm2.controls['companyName'].value;
    reqParam.AddressLine1 = this.stepForm2.controls['addressLine1'].value;
    reqParam.AddressLine2 = this.stepForm2.controls['addressLine2'].value;
    reqParam.City = this.stepForm2.controls['city'].value;
    reqParam.State = this.stepForm2.controls['state'].value;
    reqParam.Country = this.stepForm2.controls['country'].value;
    reqParam.PhoneNumber = this.stepForm2.controls['phoneNumber'].value;



    await this.loading.present();
    this.cPMLNewService.CustomerCreditCardPaymentMethodAdd(reqParam).subscribe(async (result: CustomerPaymentMethodAdd[]) => {
      
      await this.loading.dismiss();
      this.addStep = '';
      this.makeDefault = false;
      // this.formatForms();
      this.removeFormControl();
      this.addFormControl();
      setTimeout(() => {
        this.getMethodListWithOutLoading();
      }, 10000);
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  formatForms() {
    this.stepForm1.controls.cardNumber.setValue('');
    this.stepForm1.controls.cardName.setValue('');
    // this.stepForm1.controls.cvv.setValue('');
    this.stepForm1.controls.month.setValue('');
    this.stepForm1.controls.year.setValue('');
    // this.stepForm1.setErrors({ invalid: true });
  }

  continueStep1() {
    document.getElementById('submitButtonStep1').click();
  }

  continueStep2() {
    document.getElementById('submitButtonStep2').click();
  }

  cancelAddPayment() {
    this.addStep = '';
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
          if (result.MessageType === 'W' || result.MessageType === 'E') {
            this.checkCardState = true;
            this.stepForm1.controls['cardNumber'].setErrors({ 'incorrect': true });
          } else {
            this.PayCode = result.PayCode;
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
      this.cPMLNewService.ValidateCreditCardNumber(cardNum).subscribe(async (result: any) => {
        await this.loading.dismiss();
        
        if (result !== null && typeof (result) !== 'undefined') {
          if (result.MessageType === 'W' || result.MessageType === 'E') {
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

}
