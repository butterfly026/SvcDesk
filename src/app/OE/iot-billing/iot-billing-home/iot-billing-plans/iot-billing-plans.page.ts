import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranService, LoadingService, ToastService } from 'src/services';

import { IOTBillingPlansService } from './services/iot-billing-plans.service';
import { PlansItem } from 'src/app/model';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-i-otbilling-plans',
  templateUrl: './iot-billing-plans.page.html',
  styleUrls: ['./iot-billing-plans.page.scss'],
})
export class IOTBillingPlansPage implements OnInit {

  @Input() ContactCode: string = '';
  @Output('iOTBillingPlansComponent') iOTBillingPlansComponent: EventEmitter<string> = new EventEmitter<string>();

  
  plansList: any = [];
  constructor(
    public navCtrl: NavController,
    private tranService: TranService,
    private loading: LoadingService,
    private toast: ToastService,
    
    private iotService: IOTBillingPlansService,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    
  }

  ngOnInit() {
    this.getPlansList();
  }

  async getPlansList() {
    this.plansList = [];
    await this.loading.present();
    this.iotService.getPlansList(this.ContactCode).subscribe(async (result: PlansItem[]) => {
      
      await this.loading.dismiss();
      if (result === null) {
        this.tranService.errorMessage('no_iotbilling_plans');
      } else {
        this.plansList = result;
        for (let list of this.plansList) {
          list.Price = this.globService.getCurrencyConfiguration(list.Price);
          list.CallerId.Value = this.globService.getCurrencyConfiguration(list.CallerId.Value);
        }
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  selectPlan(index) {
    this.iOTBillingPlansComponent.emit('plans' + this.plansList[index].Id.toString());
  }

}
