import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LoadingService, TranService } from 'src/services';

import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-contacts-identification',
  templateUrl: './contacts-identification.page.html',
  styleUrls: ['./contacts-identification.page.scss'],
})
export class ContactsIdentificationPage implements OnInit {

  pageTitle: string = '';
  

  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('contacts_identificaton').subscribe(value => {
      this.pageTitle = value;
    });
    
  }

  ngOnInit() {
  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  processContactsIdentification(en) {
    if (en === 'close') {
      this.navCtrl.pop();
    }
  }

}
