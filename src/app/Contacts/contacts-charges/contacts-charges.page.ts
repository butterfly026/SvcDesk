import { Component, OnInit, Inject } from '@angular/core';
import { GlobalService } from 'src/services/global-service.service';
import { TranService, LoadingService } from 'src/services';
import { NavController } from '@ionic/angular';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config,  } from 'src/app/model';

@Component({
  selector: 'app-contacts-charges',
  templateUrl: './contacts-charges.page.html',
  styleUrls: ['./contacts-charges.page.scss'],
})
export class ContactsChargesPage implements OnInit {

  pageTitle: string = '';
  ContactCode: string = '';
  constructor(
    public globService: GlobalService,
    private tranService: TranService,
    private navCtrl: NavController,
    @Inject(APP_CONFIG) public config: IAppConfig,
    private loading: LoadingService,
    @Inject(Token_config) public tokens: TokenInterface,
  ) { }

  async ngOnInit() {
    this.ContactCode = this.tokens.UserCode;
    this.tranService.convertText('Charges').subscribe(result => {
      this.pageTitle = result;
    });
  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  processCharges(event) {
    if (event === 'close') {
      this.navCtrl.pop();
    }
  }

}
