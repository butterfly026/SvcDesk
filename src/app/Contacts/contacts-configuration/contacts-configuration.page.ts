import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LoadingService, TranService } from 'src/services';

import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-contacts-configuration',
  templateUrl: './contacts-configuration.page.html',
  styleUrls: ['./contacts-configuration.page.scss'],
})
export class ContactsConfigurationPage implements OnInit {

  pageTitle: string = '';
  

  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    
    public globService: GlobalService
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('contacts_configuration').subscribe(value => {
      this.pageTitle = value;
    });
    
  }

  ngOnInit() {
  }

  scrollContent(Event) {
    this.globService.resetTimeCounter();
  }

  processContactsConfiguration(event) {
    if (event === 'close') {
      this.navCtrl.pop();
    }
  }

}
