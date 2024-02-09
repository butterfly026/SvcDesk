import { Component, OnInit, Inject } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ToastService } from 'src/services/toast.service';
import { LoadingService } from 'src/services/loading.service';
import { TranService } from 'src/services/trans.service';

import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  a = 0.259;
  pageTitle: any;

  constructor(
    private navCtrl: NavController,
    private toast: ToastService,
    private loading: LoadingService,
    private tranService: TranService,

    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('home').subscribe(value => {
      this.pageTitle = value;
    });
  }

  ngOnInit() {
  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  goToChangePassword() {
    this.navCtrl.navigateForward(['auth/change-password']);
  }

  goToBusiness() {
    this.navCtrl.navigateForward(['auth/business-unit-select']);
  }

  goToRole() {
    this.navCtrl.navigateForward(['auth/role-select']);
  }

  goToCollectionRunList() {
    this.navCtrl.navigateForward(['Administration/Collections/CollectionRunList']);
  }

}
