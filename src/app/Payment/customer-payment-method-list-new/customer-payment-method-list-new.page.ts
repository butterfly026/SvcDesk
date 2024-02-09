import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CustomerPaymentMethodListNewService } from './services/customer-payment-method-list-new.service';
import { NavController } from '@ionic/angular';
import { ToastService, LoadingService, TranService } from 'src/services';

import { CustomerPaymentMethodListItem, ErrorItems } from 'src/app/model';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-customer-payment-method-list-new',
  templateUrl: './customer-payment-method-list-new.page.html',
  styleUrls: ['./customer-payment-method-list-new.page.scss'],
})
export class CustomerPaymentMethodListNewPage implements OnInit {

  pageTitle: string = '';
  methodList: any[];
  

  constructor(
    private navCtrl: NavController,
    private toast: ToastService,
    private loading: LoadingService,
    private tranService: TranService,
    private cPMLNewService: CustomerPaymentMethodListNewService,
    
    private cdr: ChangeDetectorRef,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('payment_method').subscribe(value => {
      this.pageTitle = value;
    });
    
  }

  async ngOnInit() {
    await this.loading.present();
    this.methodList = new Array();
    this.cPMLNewService.getMethodList().subscribe(async (result: CustomerPaymentMethodListItem[]) => {
      
      await this.loading.dismiss();
      if (result === null) {
        this.tranService.errorMessage('no_customer_payment_methods');
      } else {
        for (const list of result) {
          const temp = { 'data': list, 'toggleValue': false };
          this.methodList.push(temp);
        }
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  onChange(index) {
  }

  async deleteItem(index) {
    await this.loading.present();
    this.cPMLNewService.deleteMethod(this.methodList[index].data).subscribe(async (result: any) => {
      
      await this.loading.dismiss();
      this.methodList.splice(index, 1);
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  goToAdd() {

  }

  goBack() {
    this.navCtrl.pop();
  }

}
