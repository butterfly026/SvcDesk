import { Component, OnInit, Input, ViewChild, OnDestroy, Inject, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';

import { MenuController, ModalController, NavController } from '@ionic/angular';
import { TokenInterface, Token_config, } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { MenuGridService } from 'src/app/Menu/menu-grid/services/menu-grid.service';
import { GlobalService } from 'src/services/global-service.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { ChangePasswordComponentPage } from 'src/app/auth/change-password/change-password-component/change-password-component.page';
import { RegisterDetailsComponent } from 'src/app/auth/auth-components/register-details/register-details.component';
import { SelectLanguageComponent } from 'src/app/select-language/select-language.component';
import { SigninHistoryComponent } from 'src/app/auth/auth-components/signin-history/signin-history.component';
import { ChangePasswordWarningComponent } from 'src/app/auth/change-password-warning/change-password-warning.component';
import { SignInService } from '../../auth/signin/services/signin.service';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {

    @Input() pageName: string = '';
    @Input() menuItem: string = '';
    @Input() debitRunId: string = '';
    @Output('HeaderComponent') HeaderComponent: EventEmitter<string> = new EventEmitter<string>();
    @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;

    companyName = 'Sales Portal';
    // private pageName = "Debit Run";

    userName = '';

    helpMenu = false;
    toggleMenu = false;
    signOutStr: string = '';
    smallLogoUrl = '';
    menuStr: string = '';

    customerHeader: any;

    constructor(
        private menu: MenuController,

        private loading: LoadingService,
        private navCtrl: NavController,
        private translateService: TranService,
        private signInService: SignInService,
        public globService: GlobalService,
        @Inject(Token_config) public tokens: TokenInterface,
        private cdr: ChangeDetectorRef,
        private modalCtrl: ModalController,
    ) {
        this.userName = this.tokens.Name;
        this.translateService.translaterService();
        this.translateTexts();

        this.globService.globSubject.subscribe((result: any) => {
            if (result === 'language_change') {
                this.translateTexts();
            }
        })

        let storedLogo = localStorage.getItem('smallLogo');
        if (storedLogo !== null && typeof (storedLogo) !== 'undefined' && storedLogo !== '') {
            this.smallLogoUrl = storedLogo;
        } else {
            this.smallLogoUrl = 'assets/Demo3/LogoSmall.png';
        }

        this.globService.headerSubject.subscribe((result: any) => {
            this.customerHeader = result;
        });
    }

    showNotification() {
        this.customerHeader.CustomerMain.showNot = true;
    }

    sawNot(notList) {
        this.customerHeader.CustomerMain.notDetail[notList].status = true;
        this.customerHeader.CustomerMain.notCount = 0;
        for (const list of this.customerHeader.CustomerMain.notDetail) {
            if (list.status === false) {
                this.customerHeader.CustomerMain.notCount++;
            }
        }
        this.cdr.detectChanges();
    }

    closeNotification() {
        this.customerHeader.CustomerMain.showNot = false;
    }

    translateTexts() {
        this.translateService.convertText('sign_out').subscribe(value => {
            this.signOutStr = value;
        });
        this.translateService.convertText('menu').subscribe(value => {
            this.menuStr = value;
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
        // if (this.menuItem !== '' && typeof (this.menuItem) !== 'undefined') {
        //     this.menu.enable(true, this.menuItem);
        // }
        // this.menu.isEnabled('debitRunMenu').then(result => {
        //     this.menu.open('debitRunMenu');
        // });
        // this.navCtrl.navigateForward(['Menu/menu-grid']);
        this.HeaderComponent.emit('portal');
    }

    gotoFAQ() {
        // window.open('http://www.help.selcomm.com/FAQ', '_blank');
    }

    gotoDoc() {
        // window.open('http://help.selcomm.com/debit_run.html', '_blank');
    }

    signOut() {
        this.globService.forceLogout();
        console.log(this.tokens);
    }

    pressMenu(str) {
        switch (str) {
            case 'changePassword':
                this.openChangePasswordModal();
                break;
            case 'language':
                this.openLanguageModal();
                break;
            case 'theme':
                this.openThemeModal();
                break;
            case 'registerSecurity':
                this.openRegisterSecurityModal();
                break;
            case 'signInHistory':
                this.openSignInHistoryModal();
                break;
            case 'passExWarning':
                this.openWarnningPasswordPage();
                break;
            default:
                break;
        }
    }

    async openChangePasswordModal() {
        const modal = await this.modalCtrl.create({
            component: ChangePasswordComponentPage,
            componentProps: {
                ContactCode: this.tokens.ContactCode,
            },
        });
        modal.onDidDismiss().then((result: any) => {

        });
        await modal.present();
    }

    async openRegisterSecurityModal() {
       var securityDetails:any=null;
       this.globService.securityDetails.subscribe(secDetails => securityDetails = secDetails);
        const modal = await this.modalCtrl.create({
            component: RegisterDetailsComponent,
            componentProps: {
                ContactCode: this.tokens.ContactCode,
                RegisteredSecurityDetails:{
                    email:securityDetails.email,
                    mobile:securityDetails.mobile
                 }
            },
        });
        modal.onDidDismiss().then((result: any) => {

        });
        await modal.present();
        }

    async openSignInHistoryModal() {
          const modal = await this.modalCtrl.create({
            component: SigninHistoryComponent,
            componentProps: {
              ContactCode: this.tokens.ContactCode,
              UserId: this.tokens.UserCode,
            },
            backdropDismiss: false,
          });
          modal.onDidDismiss().then((data: any) => {
          });
          await modal.present();
    }
    async openLanguageModal() {
        const modal = await this.modalCtrl.create({
            component: SelectLanguageComponent,
            componentProps: {
                ComponentType: 'language'
            }
        });
        modal.onDidDismiss().then((result: any) => {

        });
        await modal.present();
    }

    async openThemeModal() {
        const modal = await this.modalCtrl.create({
            component: SelectLanguageComponent,
            componentProps: {
                ComponentType: 'theme'
            }
        });
        modal.onDidDismiss().then((result: any) => {

        });
        await modal.present();
    }

    async openWarnningPasswordPage() {
        var passInfo:null;
        await this.loading.present();
        this.signInService.getPasswordInformation(this.tokens.ContactCode).subscribe(async (result: any) => {
            const convResult = this.globService.ConvertKeysToLowerCase((result));
            this.globService.setSecurityDetails(convResult);
            passInfo=convResult;
            await this.loading.dismiss();
          }, async (error: any) => {
            await this.loading.dismiss();
          });
          this.openPassInfoMoal(passInfo);
      }

     async openPassInfoMoal(passInfo:any){
        const modal = await this.modalCtrl.create({
            component: ChangePasswordWarningComponent,
            componentProps: {
                expiryWarningDate: passInfo?.expiryWarningDate,
                expiryDate: passInfo?.expireDate,
                ContactCode: this.tokens.ContactCode,
            }
      });
      modal.onDidDismiss().then((result: any) => {

      });
        await modal.present();
      }
}
