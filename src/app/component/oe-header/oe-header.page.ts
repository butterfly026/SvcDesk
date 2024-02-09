import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { NavController } from '@ionic/angular';

import { TranService } from 'src/services';

@Component({
  selector: 'app-oe-header',
  templateUrl: './oe-header.page.html',
  styleUrls: ['./oe-header.page.scss'],
})
export class OeHeaderPage implements OnInit {


  @Input('ContactCode') ContactCode: string = '';
  @Input('CompanyName') CompanyName: string = '';
  @Input('AccountMode') AccountMode: string = '';
  @Output('OEHeaderComponentValue') public OEHeaderComponentValue: EventEmitter<string> = new EventEmitter<string>()

  changePassStr: string = '';
  accountAlertStr: string = '';
  logoutStr: string = '';


  constructor(
    private navCtrl: NavController,
    
    private tranService: TranService,
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('change_password').subscribe(result => {
      this.changePassStr = result;
    });

    this.tranService.convertText('account_alert').subscribe(result => {
      this.accountAlertStr = result;
    });

    this.tranService.convertText('log_out').subscribe(result => {
      this.logoutStr = result;
    });
  }

  ngOnInit() {
  }
  changePassword() {
    this.navCtrl.navigateForward(['auth/change-password']);
  }

  logout() {
    this.clearSession();
    this.navCtrl.navigateRoot('auth/signin');
  }

  pressMenu(text) {
    switch (text) {
      case 'changePassword':
        this.clearSession();
        this.navCtrl.navigateRoot('auth/change-password');
        break;
      default:
        break;
    }
  }

  clearSession() {
    this.tranService.clearAllToken();
  }

}
