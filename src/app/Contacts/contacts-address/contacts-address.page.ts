import { Component, OnInit, Inject } from '@angular/core';
import { TranService } from 'src/services';

import { NavController } from '@ionic/angular';
import { GlobalService } from 'src/services/global-service.service';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config,  } from 'src/app/model';

@Component({
  selector: 'app-contacts-address',
  templateUrl: './contacts-address.page.html',
  styleUrls: ['./contacts-address.page.scss'],
})
export class ContactsAddressPage implements OnInit {

  
  pageTitle: string = '';

  ContactCode: string = '';
  constructor(
    private navCtrl: NavController,
    private tranService: TranService,
    
    public globService: GlobalService,
    @Inject(APP_CONFIG) public config: IAppConfig,
    @Inject(Token_config) public tokens: TokenInterface,
  ) {
    this.tranService.translaterService();
    
    this.tranService.convertText('address_management').subscribe(result => {
      this.pageTitle = result;
    });

    this.ContactCode = this.tokens.UserCode;
  }

  ngOnInit() {

  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  processAddressManagement(event) {
    if (event === 'close') {
      this.navCtrl.pop();
    }
  }

}
