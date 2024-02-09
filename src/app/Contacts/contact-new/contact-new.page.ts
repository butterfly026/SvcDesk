import { Component, OnInit, Inject } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config,  } from 'src/app/model';

@Component({
  selector: 'app-contact-new',
  templateUrl: './contact-new.page.html',
  styleUrls: ['./contact-new.page.scss'],
})
export class ContactNewPage implements OnInit {

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
    this.tranService.convertText('contact_new').subscribe(value => {
      this.pageTitle = value;
    });
    this.ContactCode = this.tokens.UserCode;
  }

  ngOnInit() {
  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  processContact(event) {
    if (event == 'close') {
      this.navCtrl.pop();
    }
  }

}
