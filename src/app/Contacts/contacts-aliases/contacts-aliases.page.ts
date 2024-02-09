import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LoadingService, TranService } from 'src/services';

import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-contacts-aliases',
  templateUrl: './contacts-aliases.page.html',
  styleUrls: ['./contacts-aliases.page.scss'],
})
export class ContactsAliasesPage implements OnInit {

  pageTitle: string = '';
  

  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    
    public globService: GlobalService
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('contacts_aliases').subscribe(value => {
      this.pageTitle = value;
    });
    
  }

  ngOnInit() {
  }

  scrollContent(Event) {
    this.globService.resetTimeCounter();
  }

  processContactsIdentification(en) {
    if (en === 'close') {
      this.navCtrl.pop();
    }
  }

}
