import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranService, LoadingService, ToastService } from 'src/services';

import { IOTBillingPlanNowService } from './services/iot-plan-now.service';
import { PlansItem, PlanComponent } from 'src/app/model';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-i-otbilling-plan-now',
  templateUrl: './iot-billing-plan-now.page.html',
  styleUrls: ['./iot-billing-plan-now.page.scss'],
})
export class IOTBillingPlanNowPage implements OnInit {

  @Input() ContactCode: string = '';
  @Input() PlanId: string = '';
  @Input() PlanItem: PlanComponent = {
    CallerID: true,
    CallingNumber: false,
    IddPlan: false,
    ParentalCtrl: '',
    PhoneNumber: '',
    SelButton: ''
  };

  @Output('iOTBillingPlanNowComponent') iOTBillingPlanNowComponent: EventEmitter<string> = new EventEmitter<string>();

  planDetail: any;
  regFee: string = '10.7';
  payRegUse: string = '5.35';
  iDDRegUse: string = '0';

  parentalList = [
    "None", "Teenegar", "Child"
  ];

  

  constructor(
    public navCtrl: NavController,
    private tranService: TranService,
    private loading: LoadingService,
    private toast: ToastService,
    
    private iotService: IOTBillingPlanNowService,
    public globService: GlobalService,
  ) {
    
  }

  ngOnInit() {
    this.getPlansDetail();
    if (this.PlanItem.ParentalCtrl !== '') {

    }
  }

  async getPlansDetail() {
    await this.loading.present();
    this.iotService.getPlansDetail(this.ContactCode, this.PlanId).subscribe(async (result: PlansItem[]) => {
      await this.loading.dismiss();
      if (result === null) {
        this.tranService.errorMessage('no_plans_detail');
      } else {
        for (let list of result) {
          if (this.PlanId === list.Id.toString()) {
            this.planDetail = list;
            this.planDetail.Price = this.globService.getCurrencyConfiguration(this.planDetail.Price);
            this.planDetail.CallerId.Value = this.globService.getCurrencyConfiguration(this.planDetail.CallerId.Value);
            this.planDetail.CallerId.Value = this.globService.getCurrencyConfiguration(this.planDetail.CallerId.Value);
            this.regFee = this.globService.getCurrencyConfiguration(this.regFee);
            this.payRegUse = this.globService.getCurrencyConfiguration(this.payRegUse);
            this.iDDRegUse = this.globService.getCurrencyConfiguration(this.iDDRegUse);
          }
        }
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  getExistingNumber() {
    this.iOTBillingPlanNowComponent.emit('ExistNumber&' + JSON.stringify(this.PlanItem));
  }

  getNewNumber() {
    this.iOTBillingPlanNowComponent.emit('NewNumber&' + JSON.stringify(this.PlanItem));
  }

  goToSubmit() {

  }

}
