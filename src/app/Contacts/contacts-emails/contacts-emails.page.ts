import { Component, OnInit, Inject } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LoadingService, TranService } from 'src/services';

import { APP_CONFIG, IAppConfig, TokenInterface, Token_config,  } from 'src/app/model';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-contacts-emails',
  templateUrl: './contacts-emails.page.html',
  styleUrls: ['./contacts-emails.page.scss'],
})
export class ContactsEmailsPage implements OnInit {

  pageTitle: string = '';
  
  ContactCode: string = '';

  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    
    @Inject(APP_CONFIG) public config: IAppConfig,
    public globService: GlobalService,
    @Inject(Token_config) public tokens: TokenInterface,
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('customer_emails').subscribe(value => {
      this.pageTitle = value;
    });
    
    this.ContactCode = this.tokens.UserCode;
  }

  ngOnInit() {

  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  processContactPhone(event) {
    if (event === 'close') {
      this.navCtrl.pop();
    }
  }

}
