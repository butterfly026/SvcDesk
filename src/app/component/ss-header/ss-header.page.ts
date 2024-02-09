import { Component, OnInit, Input, Inject, Output, EventEmitter } from '@angular/core';
import { NavController } from '@ionic/angular';

import { TranService } from 'src/services';

@Component({
  selector: 'app-ss-header',
  templateUrl: './ss-header.page.html',
  styleUrls: ['./ss-header.page.scss'],
})
export class SsHeaderPage implements OnInit {

  @Input('ContactCode') ContactCode: string = '';
  @Input('CompanyName') CompanyName: string = '';
  @Input('AccountMode') AccountMode: string = '';
  @Output('SSHeaderComponentValue') public SSHeaderComponentValue: EventEmitter<string> = new EventEmitter<string>()

  // Watts Communications Pty Ltd - Dealer Demo Account - 04200195


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
    this.SSHeaderComponentValue.emit(text);
  }

  clearSession() {
    this.tranService.clearAllToken();
  }

}
