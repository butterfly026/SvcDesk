import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router, } from '@angular/router';
import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';
import { MenuController, ModalController } from '@ionic/angular';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { APP_CONFIG, IAppConfig, TokenInterface, Token_config, } from 'src/app/model';
import { ToastService } from 'src/services';
import { TranService } from 'src/services/trans.service';
import { SignInService } from '../services/signin.service';
import { LoadingService } from 'src/services/loading.service';
import { GlobalService } from 'src/services/global-service.service';
import { ChangePasswordComponentPage } from 'src/app/auth/change-password/change-password-component/change-password-component.page';
import { ForgotPasswordComponent } from 'src/app/auth/auth-components/forgot-password/forgot-password.component';
import { MultiFactorComponent as MultiFactorComponent } from 'src/app/auth/auth-components/multi-factor-component/multi-factor-component.component';
import { SigninHistoryComponent } from 'src/app/auth/auth-components/signin-history/signin-history.component';
import { RegisterDetailsComponent } from 'src/app/auth/auth-components/register-details/register-details.component';
import { ChangePasswordWarningComponent } from 'src/app/auth/change-password-warning/change-password-warning.component';
import { CredentialSuccessDetails, PasswordInformation, RefreshTokenRequest, SiteConfiguration } from '../models';

jqx.credits = "75CE8878-FCD1-4EC7-9249-BA0F153A5DE8";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninPage implements OnInit, OnDestroy {

  logoImage: string;
  signedIn: boolean = false;
  signForm: UntypedFormGroup;
  showLoading: boolean = false;
  showVersion: boolean = false;

  private PasswordInformation: PasswordInformation;
  private SiteId: string = 'Demo3'
  private AnonymousToken: string;
  private SiteConfiguration: SiteConfiguration;
  private MFAEnabled: boolean = false;
  private MFASuccessful: boolean = false;
  private AutoLoginData = { UserId: '', password: '', APIKey: '', path: '', ServiceId: '', SiteId: '' };
  private jwtData: RefreshTokenRequest = { 'UserId': '', 'Password': '', 'SiteId': '', 'signType': null };
  private unsubScribeAll$: Subject<any> = new Subject<any>();

  constructor(
    public globService: GlobalService,
    private router: Router,
    private tranService: TranService,
    private loading: LoadingService,
    private formBuilder: UntypedFormBuilder,
    private signinService: SignInService,
    private toast: ToastService,
    private menuCtrl: MenuController,
    private modalCtrl: ModalController,
    @Inject(APP_CONFIG) private config: IAppConfig,
    @Inject(Token_config) private tokens: TokenInterface,
  ) {
    this.tranService.translaterService();
    this.signForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    try {
      this.showLoading = true;

      if (!!decodeURIComponent(this.router.url).split('?')[1]) {
        this.getArgumentsForAutoSignIn();
      }

      if (this.SiteId === '') {
        this.getSiteId();
      }

      if (!!this.AutoLoginData.UserId && !!this.AutoLoginData.password && !!this.AutoLoginData.path) {
        this.AutoSignIn();
      }

      this.getSiteConfiguration();
      this.menuCtrl.enable(false, 'left-menu');
      this.showLoading = false;
    }
    catch (error) {
      this.showErrorMsg(error);
    };

  }

  ngOnInit(): void {
    this.removeLocalStorageData(['timeOutCounter', 'menuHistory']);
  }

  ngOnDestroy(): void {
    this.signFormReset();
  }

  ionViewWillEnter(): void {
    this.removeLocalStorageData(['timeOutCounter', 'previousTime', 'menuHistory']);
  }

  ionViewWillLeave(): void {
    this.signFormReset();
  }

  switchVersionNumber(): void {
    this.showVersion = !this.showVersion;
  }

  signInSubmit(): void {
    this.SiteId !== ''
      ? this.SignIn()
      : this.tranService.errorMessage('no_specify_site');
  }

  async gotoForgot(): Promise<void> {
    await this.loading.present();
    this.signinService.passwordResetConfiguration(this.AnonymousToken)
      .pipe(takeUntil(this.unsubScribeAll$))
      .subscribe({
        next: async (result: any) => {
          const { emaillink, smsreset } = this.globService.ConvertKeysToLowerCase(result);

          let formMode = '';
          if (emaillink && !smsreset) {
            formMode = 'email';
          } else if (!emaillink && smsreset) {
            formMode = 'sms';
          } else if (emaillink && smsreset) {
            formMode = 'both';
          }

          if (formMode === '') {
            this.tranService.convertText('no_message_defined')
              .pipe(takeUntil(this.unsubScribeAll$))
              .subscribe(async msg => {
                await this.loading.dismiss();
                this.tranService.errorToastOnly(msg);
              })
          } else {
            const modal = await this.modalCtrl.create({
              component: ForgotPasswordComponent,
              componentProps: {
                FormMode: formMode,
                token: this.AnonymousToken,
                SiteId: this.SiteId
              },
              cssClass: 'forgot-modal overflow-y-auto'
            });

            await this.loading.dismiss();
            await modal.present();
          }
        },
        error: async (error: any) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error.error.status.toString());
        }
      });
  }

  private SignIn(): void {
    this.showLoading = true;

    this.jwtData = {
      'UserId': this.signForm.controls['username'].value.trim(),
      'Password': this.signForm.controls['password'].value,
      'SiteId': this.SiteId,
      'signType': null
    };

    if (this.isValidEmail(this.signForm.controls['username'].value)) {
      this.jwtData.signType = 'email';
    } else {
      this.jwtData.signType = parseInt(this.jwtData.UserId) > 0 ? 'username' : 'username';
    }

    this.tokens.UserCode = this.jwtData.UserId;
    this.signinService.getRefreshToken(this.jwtData)
      .pipe(
        takeUntil(this.unsubScribeAll$),
        switchMap((result: CredentialSuccessDetails) => {
          this.tokens.RefreshToken = result.credentials;
          this.tokens.Type = result.type;

          return this.signinService.getAccessToken();
        }),
        switchMap((result: CredentialSuccessDetails) => {
          this.tokens.AccessToken = result.type + ' ' + result.credentials;
          this.checkToken();

          const helper = new JwtHelperService();
          const decodedToken = helper.decodeToken(this.tokens.AccessToken);

          this.tokens.ContactCode = Array.isArray(decodedToken['contact.code'])
            ? decodedToken['contact.code'][0].trim()
            : decodedToken['contact.code'].trim();

          return this.signinService.getPasswordInformation(this.tokens.ContactCode);
        })
      )
      .subscribe({
        next: result => {
          const convResult = this.globService.ConvertKeysToLowerCase((result));
          this.globService.setSecurityDetails(convResult);
          this.PasswordInformation = result;
          this.showLoading=false;
          this.signedIn=true;
          this.MFA();
          this.logSignin("success");
          this.goToNextPage("MustChangePassword");
        },
        error: error => {
          this.logSignin('failure');
          switch (error.status.toString()) {
            case '404':
              this.tranService.errorMessage('invalid_user_id');
              break;
            case 'status':
              this.tranService.errorMessage('sign_in_failed');
            default:
              this.tranService.errorMessage(error);
              break;
          }

          this.showLoading = false;
        }
      });
  }

  private AutoSignIn(): void {
    this.jwtData = {
      UserId: this.AutoLoginData.UserId,
      Password: this.AutoLoginData.password,
      SiteId: this.SiteId,
      signType: this.isValidEmail(this.AutoLoginData.UserId) ? 'email' : 'code'
    };

    this.signinService.getRefreshToken(this.jwtData)
      .pipe(
        takeUntil(this.unsubScribeAll$),
        switchMap((result: CredentialSuccessDetails) => {
          this.tokens.RefreshToken = result.credentials;
          this.tokens.Type = result.type;
          this.tokens.UserCode = this.jwtData.UserId;
          return this.signinService.getAccessToken();
        })
      )
      .subscribe({
        next: (result: CredentialSuccessDetails) => {
          this.tokens.AccessToken = result.credentials;
          this.checkToken();
          this.signedIn=true;
        },
        error: error => this.tranService.errorMessage(error)
      });
  }

  private getArgumentsForAutoSignIn(): void {
    let passArray = decodeURIComponent(this.router.url).split('?')[1].split('&');
    for (let list of passArray) {
      if (list.toLowerCase().includes('userid')) {
        this.AutoLoginData.UserId = list.split('=')[1];
      }
      if (list.toLowerCase().includes('password')) {
        this.AutoLoginData.password = list.split('=')[1];
      }
      if (list.toLowerCase().includes('startpage')) {
        this.AutoLoginData.path = list.split('=')[1];
      }
      if (list.toLowerCase().includes('serviceid')) {
        this.AutoLoginData.ServiceId = list.split('=')[1];
      }
      if (list.toLowerCase().includes('siteid')) {
        this.AutoLoginData.SiteId = list.split('=')[1];
        this.SiteId = list.split('=')[1].toLowerCase();
        localStorage.setIte('SiteId', this.SiteId);
      }
      if (list.toLowerCase().includes('end_point')) {
        this.config.NewAPIEndPoint = list.split('=')[1];
      }
    }
  }

  private getSiteId(): void {
    if (!!localStorage.getItem('SiteId')) {
      this.SiteId = localStorage.getItem('SiteId');
    } else {
      throw 'siteid_missing';
    }
  }

  private signFormReset(): void {
    this.signedIn = false;
    this.signForm.reset();
    this.signForm.markAsUntouched();
    this.signForm.get('username').setErrors(null);
    this.signForm.get('password').setErrors(null);
    this.signForm.setErrors({ 'invalid': true });
  }

  private goToNextPage(Page: string): void {
    switch (Page) {
      case "ServiceDesk":
        this.router.navigate(['ServiceDesk']);
        break;
      case "MustChangePassword":
        this.openMustChangePasswordModal();
        break;
      case "SignInHistory":
        this.openSignInHistoryPage();
        break;
      case "WarningPassword":
        this.openWarningPasswordPage();
        break;
      case "RegisterDetail":
        this.openRegisterDetailModal();
        break;
      default:
        break;
    }
  }

  private async openSignInHistoryPage(): Promise<void> {
    if (!localStorage.getItem('UserPreferenceHideSignInHistory_' + this.tokens.ContactCode)) {
      const modal = await this.modalCtrl.create({
        component: SigninHistoryComponent,
        componentProps: {
          ContactCode: this.tokens.ContactCode,
          UserId: this.tokens.UserCode,
        },
        backdropDismiss: false,
      });
      modal.onDidDismiss().then(() => this.goToNextPage("RegisterDetail"));
      await modal.present();
    } else {
      this.goToNextPage("RegisterDetail");
    }
  }

  private async openWarningPasswordPage(): Promise<void> {

    if (!localStorage.getItem('UserPreferenceHidePasswordWarning_' + this.tokens.ContactCode)) {

      const ExpiryWarningDate = new Date(this.PasswordInformation.ExpiryWarningDate ?? '');
      const Now = new Date();

      if (ExpiryWarningDate <= Now) {
        this.globService.DialogControlFlag = "";

        const modal = await this.modalCtrl.create({
          component: ChangePasswordWarningComponent,
          componentProps: {
            expiryWarningDate: this.PasswordInformation.ExpiryWarningDate,
            expiryDate: this.PasswordInformation.ExpiryDate,
            ContactCode: this.tokens.ContactCode,
          }
        });
        modal.onDidDismiss().then(() => this.goToNextPage("SignInHistory"));
        await modal.present();
      } else {
        this.goToNextPage("SignInHistory");
      }
    } else {
      this.goToNextPage("SignInHistory");
    }
  }

  private async MFA(): Promise<void> {
    if (this.SiteConfiguration.TwoFactorAuthEmail || this.SiteConfiguration.TwoFactorAuthSMS) {
      try {
        this.openMFAModal();
      }
      catch (error) {
        this.tranService.errorMessage(error);
        throw error;
      }
    }
  }

  private async openMFAModal(): Promise<void> {

    this.MFAEnabled = true;

    const mfaModal = await this.modalCtrl.create({
      component: MultiFactorComponent,
      componentProps: {
        ContactCode: this.tokens.ContactCode,
        TFConfig: {
          TwoFactorAuthEmail: this.SiteConfiguration.TwoFactorAuthEmail,
          TwoFactorAuthSMS: this.SiteConfiguration.TwoFactorAuthSMS,
        }
      },
      backdropDismiss: false,
      cssClass: 'mfa-modal'
    });

    mfaModal.onDidDismiss().then(result => {
      if (result?.data !== 'success') {
        throw 'mfa_unsuccessful';
      } else {
        this.MFASuccessful = true;
      }
    });

    await mfaModal.present();
  }

  private async openMustChangePasswordModal(): Promise<void> {

    const ExpiryDate = new Date(this.PasswordInformation.ExpiryDate ?? '');
    const Now = new Date();

    if ((this.PasswordInformation.MustChange) || (ExpiryDate <= Now)) {

      this.globService.DialogControlFlag = "";

      const toastStr = await this.tranService.convertText('password_must_change').toPromise();
      this.toast.present(toastStr);

      const modal = await this.modalCtrl.create({
        component: ChangePasswordComponentPage,
        componentProps: {
          ContactCode: this.tokens.ContactCode,
          Mode: 'mustChange'
        },
      });
      modal.onDidDismiss().then(() => {
        if (this.globService.DialogControlFlag !== "ChangePasswordClosed") {
          this.globService.ClearDialogControlFlag();
          this.globService.clearAllToken();
        } else {
          modal.dismiss();
          this.goToNextPage("SignInHistory");
        }
      });
      await modal.present();
    } else {
      this.goToNextPage("WarningPassword");
    }
  }

  private async openRegisterDetailModal(): Promise<void> {
    if (
      localStorage.getItem('UserPreferenceHideRegistration_' + this.tokens.ContactCode) !== 'true' &&
      (!this.PasswordInformation.Email || !this.PasswordInformation.Mobile)
    ) {

      const modal = await this.modalCtrl.create({
        component: RegisterDetailsComponent,
        componentProps: {
          ContactCode: this.tokens.ContactCode,
          RegisteredSecurityDetails: {
            email: this.PasswordInformation.Email,
            mobile: this.PasswordInformation.Mobile
          }
        },
        backdropDismiss: false,
      });
      modal.onDidDismiss().then(() => this.goToNextPage("ServiceDesk"));
      await modal.present();
    }
    else {
      this.goToNextPage("ServiceDesk");
    }
  }

  private getSiteConfiguration(): void {
    this.showLoading = true;
    this.signinService.getJWT(this.SiteId)
      .pipe(
        takeUntil(this.unsubScribeAll$),
        switchMap(result => {
          this.AnonymousToken = result;
          return this.signinService.getSiteConfigurationDefault(result);
        })
      )
      .subscribe({
        next: (result: SiteConfiguration) => {
          this.SiteConfiguration = result;
          this.logoImage = result.LogoURL;
          localStorage.setItem('smallLogo', result.SmallLogoURL);
          this.showErrorMsg();
        },
        error: (error: any) => this.showErrorMsg(error)
      });
  }

  private checkLogoImageState(): void {
    if (!document.getElementById('logoImage')) {
      setTimeout(() => {
        this.checkLogoImageState();
      }, 500);
    } else {
      setTimeout(() => {
        document.getElementById('loginContainer').classList.remove('opacity-0');
        document.getElementById('loginLoading').classList.add('d-none');
      }, 1000);
    }
  }

  private logSignin(status: any): void {

    if (this.MFAEnabled) {
      this.MFASuccessful = false;
    }

    const reqData = {
      LoginId: this.signForm.controls['username'].value.trim(),
      Password: this.signForm.controls['password'].value,
      ip: "",
      Location: "",
      MFA: this.MFASuccessful,
      OTP: true,
      Tor: true,
      Proxy: true,
      Anonymous: false,
      KnownAttacker: false,
      KnownAbuser: false,
      Threat: false,
      Bogon: true
    };

    switch (status) {
      case "success":
        this.logSignInSuccess(reqData);
        break;
      case "failure":
        this.logSignInFailure(reqData);
        break;
      default:
        break;
    }
  }

  private async logSignInSuccess(reqData: any): Promise<void> {
    this.signinService.logSignInSuccess(reqData, this.tokens.ContactCode)
      .pipe(takeUntil(this.unsubScribeAll$))
      .subscribe({
        next: () => console.log('successfully logged sign in approved'),
        error: () => console.log('failed to log signin success')
      });
  }

  private async logSignInFailure(reqData: any): Promise<void> {
    this.signinService.logSignInFailure(reqData, this.AnonymousToken)
      .pipe(takeUntil(this.unsubScribeAll$))
      .subscribe({
        next: () => console.log('successfully logged sign in denied'),
        error: () => console.log('failed to log signin failure')
      });
  }

  private isValidEmail(email): boolean {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  }

  private checkToken(): void {
    this.globService.increaseCounter();
    this.globService.checkExpireToken();
    this.globService.getAccessToken();
  }

  private showErrorMsg(error?: any): void {
    this.showLoading = false;
    this.checkLogoImageState();

    if(error) {
      this.tranService.errorMessage(error);
    }
  }

  private removeLocalStorageData(val: string[]): void {
    for(let item of val) {
      localStorage.removeItem(item);
    }
  }
}
