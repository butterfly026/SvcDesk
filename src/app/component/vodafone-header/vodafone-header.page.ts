import { Component, OnInit, OnDestroy, Input, ViewChild, Inject } from '@angular/core';

import { MenuController, NavController } from '@ionic/angular';

import { LoadingService, TranService } from 'src/services';
import { MenuGridService } from 'src/app/Menu/menu-grid/services/menu-grid.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { Token_config, TokenInterface } from 'src/app/model';

@Component({
  selector: 'app-vodafone-header',
  templateUrl: './vodafone-header.page.html',
  styleUrls: ['./vodafone-header.page.scss'],
})
export class VodafoneHeaderPage implements OnInit, OnDestroy {


  @Input() pageName: string = '';
  @Input() menuItem: string = '';
  @Input() debitRunId: string = '';
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;

  companyName = 'Vodafone';
  // private pageName = "Debit Run";

  userName = '';

  helpMenu = false;
  toggleMenu = false;
  signOutStr: string = '';

  constructor(
    private menu: MenuController,

    private loading: LoadingService,
    private navCtrl: NavController,
    private translateService: TranService,
    private menuGridService: MenuGridService,
    @Inject(Token_config) public tokens: TokenInterface,
  ) {
    this.userName = this.tokens.UserCode;
    // this.translateService.translaterService();
    this.translateService.convertText('sign_out').subscribe(value => {
      this.signOutStr = value;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {

  }

  getWidthHeight() {
    const element = document.getElementById('smallLogoHeader');
    if (element !== null) {
      if (element.offsetWidth > 55) {
        return '55px';
      } else {
        return element.offsetWidth + 'px';
      }
    }
  }

  showHelpMenu() {
    this.helpMenu = true;
  }

  onToggleMenu() {
    if (this.toggleMenu === true) {
      this.toggleMenu = false;
    } else {
      this.toggleMenu = true;
    }
    
  }

  openMenu() {
    if (this.menuItem !== '' && typeof (this.menuItem) !== 'undefined') {
      this.menu.enable(true, this.menuItem);
    }
    this.menu.isEnabled('debitRunMenu').then(result => {
      this.menu.open('debitRunMenu');
    });
  }

  gotoFAQ() {
    // window.open('http://www.help.selcomm.com/FAQ', '_blank');
  }

  gotoDoc() {
    // window.open('http://help.selcomm.com/debit_run.html', '_blank');
  }

  async signOut() {
    this.tokens.UserCode = '';
    this.tokens.AccessToken = '';
    await this.loading.present();
    this.menuGridService.TerminateSession().subscribe(async (result: any) => {
      
      await this.loading.dismiss();
      this.navCtrl.navigateRoot(['auth/signin']);
    }, async (error: any) => {
      await this.loading.dismiss();
      this.translateService.errorMessage(error.error);
    });
  }

}
