import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranService, LoadingService, ToastService } from 'src/services';

import { ActivatedRoute } from '@angular/router';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-iot-billing-dashboard',
  templateUrl: './iot-billing-dashboard.page.html',
  styleUrls: ['./iot-billing-dashboard.page.scss'],
})
export class IOTBillingDashboardPage implements OnInit {

  pageTitle: string = '';
  

  ContactCode: string = '';

  constructor(
    public navCtrl: NavController,
    private tranService: TranService,
    private loading: LoadingService,
    
    private activatedRoute: ActivatedRoute,
    public globService: GlobalService,
  ) {
    this.ContactCode = this.activatedRoute.params['ContactCode'];
    this.tranService.translaterService();
    
    this.tranService.convertText('iot_billing').subscribe(result => {
      this.pageTitle = result;
    });
  }

  ngOnInit() {
  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

}
