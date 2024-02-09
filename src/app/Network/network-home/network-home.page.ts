import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LoadingService, TranService } from 'src/services';

import { ActivatedRoute } from '@angular/router';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-network-home',
  templateUrl: './network-home.page.html',
  styleUrls: ['./network-home.page.scss'],
})
export class NetworkHomePage implements OnInit {

  ContactCode: string = '';
  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    
    private actRoute: ActivatedRoute,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    this.ContactCode = this.actRoute.snapshot.params['Id'];
  }

  ngOnInit() {
  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  processNetwork(event) {
    
    if (event === 'close') {
      this.navCtrl.pop();
    }
  }

}
