import { Component, OnInit, Input } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranService, LoadingService, ToastService } from 'src/services';

import { PlanComponent } from 'src/app/model';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-iot-billing-home',
  templateUrl: './iot-billing-home.page.html',
  styleUrls: ['./iot-billing-home.page.scss'],
})
export class IOTBillingHomePage implements OnInit {

  @Input() ContactCode: string = '';

  
  switchMode: string = 'main';

  planId: string = '';

  PlanItem: PlanComponent = {
    CallerID: true,
    CallingNumber: false,
    IddPlan: false,
    ParentalCtrl: '',
    PhoneNumber: '',
    SelButton: ''
  };

  constructor(
    public navCtrl: NavController,
    private tranService: TranService,
    private loading: LoadingService,
    private toast: ToastService,
    
    public globService: GlobalService,
  ) { }

  ngOnInit() {
  }

  processHome(event) {
    
    if (event.includes('plans')) {
      this.switchMode = 'plan-now';
      this.planId = event.replace('plans', '');
    } else if (event.includes('&')) {
      let array = event.split('&');
      switch (array[0]) {
        case 'ExistNumber':
          this.switchMode = 'ExistNumber';
          this.PlanItem = JSON.parse(array[1]);
          break;
        case 'NewNumber':
          this.switchMode = 'NewNumber';
          this.PlanItem = JSON.parse(array[1]);
          break;
        case 'getNumberExit':
          this.switchMode = 'plan-now';
          this.PlanItem = JSON.parse(array[2]);
          break;
        case 'getNewNumber':
          this.switchMode = 'plan-now';
          this.PlanItem = JSON.parse(array[2]);
          break;
        default:
          break;
      }
    }
  }

}
