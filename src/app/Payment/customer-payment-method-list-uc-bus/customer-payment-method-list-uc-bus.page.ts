import { Component, OnInit, AfterViewChecked, Inject } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranService } from 'src/services';

import { APP_CONFIG, IAppConfig, TokenInterface, Token_config,  } from 'src/app/model';
import { GlobalService } from 'src/services/global-service.service';


@Component({
  selector: 'app-customer-payment-method-list-uc-bus',
  templateUrl: './customer-payment-method-list-uc-bus.page.html',
  styleUrls: ['./customer-payment-method-list-uc-bus.page.scss'],
})
export class CustomerPaymentMethodListUcBusPage implements OnInit, AfterViewChecked {
  pageTitle: string = '';
  
  ContactCode: string = '';

  constructor(
    private navCtrl: NavController,
    private tranService: TranService,
    
    @Inject(APP_CONFIG) public config: IAppConfig,
    public globService: GlobalService,
    @Inject(Token_config) public tokens: TokenInterface,
  ) {

    this.tranService.translaterService();
    this.tranService.convertText('payment_method').subscribe(value => {
      this.pageTitle = value;
    });
    
    this.ContactCode = this.tokens.UserCode;
  }

  ngAfterViewChecked() {
  }

  ngOnInit() {
  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  processPayment(event) {
    if (event === 'close' || event === 'emptyMethod') {
      this.navCtrl.pop();
    }
  }

}
