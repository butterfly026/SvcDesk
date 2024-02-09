import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';

import { StripeComponentService } from './services/stripe-component-service';
import * as $ from 'jquery';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-stripe-component',
  templateUrl: './stripe-component.component.html',
  styleUrls: ['./stripe-component.component.scss'],
})
export class StripeComponentComponent implements OnInit {
  @ViewChild('inputCardName') inputCardName: ElementRef;

  
  stripeForm: UntypedFormGroup;

  maskCardNumber = [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/];
  maskCardExpire = [/\d/, /\d/, ' ', '/', ' ', /\d/, /\d/];
  maskCardCVC = [/\d/, /\d/, /\d/];
  cardType: string = '';

  stripeStep: string = '0';
  priceList: any[];
  stripeEl: any;
  cardEl: any;

  customerId: string = '';
  priceId: string = '';
  currentService: any;
  paymentMethodId: string = '';

  cardNumber: string = '';

  constructor(
    public stripeService: StripeComponentService,
    private navCtrl: NavController,
    
    private formBuilder: UntypedFormBuilder,
    private loading: LoadingService,
    private tranService: TranService,
    public globService: GlobalService,
  ) {
    
    this.stripeForm = this.formBuilder.group({
      customerEmail: ['', [
        Validators.required,
        Validators.email
      ]],
      cardNumber: ['', [
        Validators.required,
        Validators.pattern('[0-9][0-9][0-9][0-9] [0-9][0-9][0-9][0-9] [0-9][0-9][0-9][0-9] [0-9][0-9][0-9][0-9]')
      ]],
      cardExpire: ['', [
        Validators.required,
        Validators.pattern('[0-1][0-9] / [0-9][0-9]')
      ]],
      cvc: ['', [
        Validators.required,
      ]],
    });
  }

  ngOnInit() {
    this.getPriceLists();
  }

  async getPriceLists() {
    await this.loading.present();
    this.priceList = [];
    this.stripeService.getPricesList().subscribe(async (result: any) => {
      
      await this.loading.dismiss();
      for (let list of result.prices.data) {
        if (list.product === 'prod_IsN7uECuHLw3HR' && list.active) {
          list.unit_amount = this.globService.getCurrencyConfiguration(list.unit_amount / 100);
          this.priceList.push(list);
        }
      }
      this.priceList.sort((a, b) => (a.unit_amount > b.unit_amount) ? 1 : ((b.unit_amount > a.unit_amount) ? -1 : 0));
    }, async (error: any) => {
      await this.loading.dismiss();
      
    });
  }

  get f() {
    return this.stripeForm.controls;
  }

  cardExpireChange() {
    const cardExpire = this.stripeForm.get('cardExpire').value;
    if (cardExpire.length === 1) {
      if (parseInt(cardExpire) > 1) {
        this.stripeForm.get('cardExpire').setValue('0' + cardExpire);
      }
    } else if (cardExpire.length === 5) {
      const exMonth = cardExpire.split(' / ')[0];
      if (parseInt(exMonth) > 12) {
        this.stripeForm.get('cardExpire').setValue('0' + exMonth.charAt(0) + ' / ' + (exMonth % 10));
      }
    }

    if (this.stripeForm.get('cardExpire').valid) {
      const exMonth = parseInt(cardExpire.split(' / ')[0]);
      const exYear = parseInt(cardExpire.split(' / ')[1]);
      const currentDate = new Date();

      if ((exYear) === parseInt(currentDate.getFullYear().toString().slice(2, 4))) {
        if (exMonth < currentDate.getMonth() + 1) {
          this.stripeForm.get('cardExpire').setErrors({ 'invalid': true });
        }
      } else if (exYear < parseInt(currentDate.getFullYear().toString().slice(2, 4))) {
        this.stripeForm.get('cardExpire').setErrors({ 'invalid': true });
      }
    }
  }

  async cardNumberKeydown() {
    this.cardType = this.creditCardType(this.stripeForm.get('cardNumber').value.replace(/ /g, ''));
    if (this.stripeForm.get('cardNumber').value !== '' && this.stripeForm.get('cardNumber').valid
      && this.stripeForm.get('cardNumber').value.length === 19) {
      await this.loading.present();
      let cardNum = this.stripeForm.get('cardNumber').value;
      cardNum = cardNum.replace(/ /g, '');
      this.stripeService.ValidateCreditCardNumber(cardNum).subscribe(async (result: any) => {
        await this.loading.dismiss();
        
        if (result !== null && typeof (result) !== 'undefined') {
          if (result.MessageType === 'W' || result.MessageType === 'E' || result.MessageType === 'Error') {
            this.stripeForm.get('cardNumber').setErrors({ 'invalid': true });
          } else {
            this.cardNumber = cardNum;
          }
        } else {
          this.stripeForm.get('cardNumber').setErrors({ 'invalid': true });
        }
      }, async (error: any) => {
        await this.loading.dismiss();
        
        this.tranService.errorMessage(error);
      });
    }
  }

  async submitStripe() {
    if (this.stripeForm.valid) {
      await this.loading.present();
      this.stripeService.createCustomer(this.stripeForm.get('customerEmail').value).subscribe(async (result: any) => {
        
        this.customerId = result.customer.id;
        this.createPaymentMethod();
      }, async (error: any) => {
        await this.loading.dismiss();
        
        this.tranService.errorMessage(error);
      });

    }
  }

  createPaymentMethod() {
    const cardExpire = this.stripeForm.get('cardExpire').value;
    const exMonth = parseInt(cardExpire.split(' / ')[0]);
    const exYear = parseInt(cardExpire.split(' / ')[1]);
    const currentDate = new Date();

    const reqBody = {
      type: 'card',
      card: {
        number: this.cardNumber,
        exp_month: exMonth,
        exp_year: exYear + parseInt(currentDate.getFullYear().toString().slice(0, 2)) * 100,
        cvc: this.stripeForm.get('cvc').value,
      },
    };
    this.stripeService.createPaymentMethod(reqBody).subscribe(async (result: any) => {
      this.paymentMethodId = result.paymentMethod.id;
      this.createSubscription();
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  createSubscription() {

    const reqBody = {
      customerId: this.customerId,
      paymentMethodId: this.paymentMethodId,
      priceId: this.priceId,
    };

    this.stripeService.createSubscription(reqBody).subscribe(async (result: any) => {
      await this.loading.dismiss();
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });

  }

  goBack() {
    if (this.stripeStep === '1') {
      this.stripeStep = '0';
    } else if (this.stripeStep === '0') {
      this.navCtrl.pop();
    }
  }

  submitTrigger() {
    document.getElementById('stripe-submit').click();
  }

  creditCardType(cc: string) {
    let amex = new RegExp('^3[47][0-9]{0,}$');
    let visa = new RegExp('^4[0-9]{0,}$');
    let cup = new RegExp('^(62|81)[0-9]{0,}$');

    let mastercard = new RegExp('^(5[1-5]|22[2-9]|2[3-7])[0-9]{0,}$');

    let discover = new RegExp('^(6[45]|62[24568]|6011)[0-9]{0,}$');

    let diners = new RegExp('^3(?:0[0-5]|[68][0-9])[0-9]{0,}$');
    let jcb = new RegExp('^(?:2131|1800|35)[0-9]{0,}$');


    if (cc.match(visa)) {
      return 'visa';
    }
    if (cc.match(amex)) {
      return 'amex';
    }
    if (cc.match(mastercard)) {
      return 'mastercard';
    }
    if (cc.match(discover)) {
      return 'discover';
    }
    if (cc.match(diners)) {
      return 'diners';
    }
    if (cc.match(jcb)) {
      return 'jcb';
    }
    if (cc.match(cup)) {
      return 'china_union_pay';
    }

    return 'invalid';
  }

  selectService(index) {
    this.priceId = this.priceList[index].id;
    this.currentService = this.priceList[index];
    this.stripeStep = '1';
  }

}
