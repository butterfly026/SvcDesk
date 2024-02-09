import { Component, Inject, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TokenInterface, Token_config } from 'src/app/model';
import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-contacts-questions',
  templateUrl: './contacts-questions.page.html',
  styleUrls: ['./contacts-questions.page.scss'],
})
export class ContactsQuestionsPage implements OnInit {

  ContactCode: string = '';
  constructor(
    public globService: GlobalService,
    private navCtrl: NavController,
    private tranService: TranService,
    @Inject(Token_config) public tokens: TokenInterface,
  ) {
    this.tranService.translaterService();
    this.ContactCode = this.tokens.UserCode;
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
