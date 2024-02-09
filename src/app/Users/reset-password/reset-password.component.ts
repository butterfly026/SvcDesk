import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { access } from 'fs';
import { debounceTime } from 'rxjs/operators';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { ResetPasswordService } from './services/reset-password-service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {

  groupForm: UntypedFormGroup;


  passwordStrengStr: string = 'password_weak';

  reasonStr: any = {};
  spinner: any = {};

  pswLoginState: boolean = false;

  userConfiguration: any = {};
  userInformation: any = {};

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private passService: ResetPasswordService,

    public globService: GlobalService,
    private formBuilder: UntypedFormBuilder,
    private alertCtrl: AlertController,
    private navParams: NavParams,
    private modalCtrl: ModalController,
  ) {

    this.tranService.translaterService();
    this.groupForm = this.formBuilder.group({
      TemporaryPassword: [''],
    });
  }

  ngOnInit() {

    this.userConfiguration = this.navParams.data.userConfiguration;
    this.userInformation = this.navParams.data.userInformation;

    this.groupForm.get('TemporaryPassword').valueChanges.pipe(debounceTime(1000)).subscribe((password: any) => {
      if (password) {
        if (password.length % 3 === 0) {
          this.passwordStrengthCheck();
        }
      }
    });
  }

  get f() {
    return this.groupForm.controls;
  }

  async generatePassword() {
    await this.loading.present();
    this.passService.generatePassword().subscribe(async (result: any) => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.openPasswordSuggestionAlert(convResult.password);
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  async openPasswordSuggestionAlert(password) {
    const passwordSuggestStr = await this.tranService.convertText('password_suggest').toPromise();
    const alert = await this.alertCtrl.create({
      message: password,
      subHeader: passwordSuggestStr,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.groupForm.get('TemporaryPassword').setValue(password);
            this.passwordStrengthCheck();
          }
        }
      ],
      backdropDismiss: false,
    });
    await alert.present();
  }


  passwordStrengthCheck() {
    this.spinner.password = true;
    this.passService.passwordStrengthCheck(this.globService.getFormValue(this.groupForm.get('TemporaryPassword').value)).subscribe((result: any) => {
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.spinner.password = false;
      if (convResult.result.toLowerCase() === 'failed') {
        this.groupForm.get('TemporaryPassword').setErrors({ invalid: true, pattern: true });
        this.reasonStr.password = convResult.reason;
        this.passwordStrengStr = 'password_failed';
      } else {
        switch (this.userConfiguration.minimumpasswordstrength) {
          case 'Medium':
            if (convResult.passwordstrength.toLowerCase() === 'medium') {
              this.passwordStrengStr = 'password_medium';
            } else if (convResult.passwordstrength.toLowerCase() === 'strong') {
              this.passwordStrengStr = 'password_strong';
            } else {
              this.groupForm.get('TemporaryPassword').setErrors({ invalid: true, pattern: true });
              this.passwordStrengStr = 'password_weak';
            }
            break;
          case 'Strong':
            if (convResult.passwordstrength.toLowerCase() === 'strong') {
              this.passwordStrengStr = 'password_strong';
            } else {
              if (convResult.passwordstrength.toLowerCase() === 'medium') {
                this.groupForm.get('TemporaryPassword').setErrors({ invalid: true, pattern: true });
                this.passwordStrengStr = 'password_medium';
              } else {
                this.groupForm.get('TemporaryPassword').setErrors({ invalid: true, pattern: true });
                this.passwordStrengStr = 'password_weak';
              }
            }
            break;

          default:
            break;
        }
      }

      if (this.groupForm.get('TemporaryPassword').valid) {
        this.passwordChangeAlert();
      }

    }, (error: any) => {

      this.tranService.errorMessage(error);
    });
  }

  async passwordChangeAlert() {
    const passwordSuggestStr = await this.tranService.convertText('password_change_warning').toPromise();
    const warningStr = await this.tranService.convertText('want_continue').toPromise();
    const alert = await this.alertCtrl.create({
      message: warningStr,
      subHeader: passwordSuggestStr,
      buttons: [
        {
          text: 'Yes',
          handler: () => {
          }
        },
        {
          text: 'No',
          role: 'cancel',
          handler: () => {

            this.passwordFieldReset();
          }
        },
      ],
      backdropDismiss: false,
    });
    await alert.present();
  }

  passwordFieldReset() {
    this.groupForm.get('TemporaryPassword').reset();
    this.passwordStrengStr = '';
  }

  submitTrigger() {
    document.getElementById('submitButton').click()
  }

  async submitForm() {
    if (this.groupForm.valid) {
      await this.loading.present();
      if (await this.prepareResetPassword()) {
        const success = await this.registerNewUser();
        if (success) {
          if (await this.completeResetPassword()) {
            await this.loading.dismiss();
            this.modalCtrl.dismiss('success');
          }
        }
      }
      await this.loading.dismiss();
    }
  }

  async prepareResetPassword() {
    try {
      const result = await this.passService.prepareResetPassword(this.userInformation.UserId).toPromise();
      return true;
    } catch (error) {

      this.tranService.errorMessage(error);
      return false;
    }
  }

  async completeResetPassword() {
    const reqBody = {
      ChangePasswordOnFirstLogin: this.pswLoginState
    };
    try {
      const result = await this.passService.completeResetPassword(this.userInformation.UserId, reqBody).toPromise();
      return true;
    } catch (error) {

      this.tranService.errorMessage(error);
      return false;
    }
  }

  async registerNewUser() {
    try {
      const reqBody = {
        SiteId: localStorage.getItem('SiteId'),
        UserId: this.userInformation.UserId,
        ContactCode: this.userInformation.UserId,
      }
      const refreshResult = await this.passService.getRefreshTokenContact(reqBody).toPromise();
      const refreshToken = refreshResult.type + ' ' + refreshResult.credentials;
      try {
        const accessResult = await this.passService.getAccessTokenContact(refreshToken).toPromise();
        const accessToken = accessResult.type + ' ' + accessResult.credentials;

        const registerBody = {
          contactPassword: this.userInformation.UserId,
          selcommUserName: this.userInformation.LoginId,
          selcommUserEmail: this.userInformation.Email,
          selcommUserPhoneNumber: this.userInformation.MobilePhone,
          selcommUserPassword: this.groupForm.get('TemporaryPassword').value,
        }
        const registerParam = {
          accessToken: accessToken,
          SiteId: localStorage.getItem('SiteId'),
          userId: this.userInformation.UserId,
        }
        try {
          const registerResult = await this.passService.addUserWithAccessToken(registerParam, this.globService.convertRequestBody(registerBody)).toPromise();
          return true;
        } catch (error) {

          if (error.error && error.error.errors && error.error.errors.duplicateemail
            && error.error.errors.duplicateemail.length > 0) {
            this.tranService.errorMessage(error.error.errors.duplicateemail[0]);
          } else {
            this.tranService.errorMessage(error);
            return false;
          }
        }
        return true;
      } catch (error) {

        this.tranService.errorMessage(error);
        return false;
      }

    } catch (error) {

      this.tranService.errorMessage(error);
      return false;
    }
  }

  async changePasswordSubmit(accessToken) {
    const reqData = {
      ContactCode: this.userInformation.UserId,
      OldPassword: '',
      NewPassword: this.groupForm.get('TemporaryPassword').value
    }

    try {
      const result = this.passService.changePassword(this.globService.convertRequestBody(reqData), accessToken).toPromise();
      await this.sendPasswordChanged();
    } catch (error) {
      if (error.error && error.error.errors && error.error.errors.PasswordMismatch) {
        this.tranService.errorMessage(error.error.errors.PasswordMismatch[0]);
      } else {
        this.tranService.errorMessage(error);
      }
      return false;
    }
  }

  async sendPasswordChanged() {
    const reqBody = {
      Password: this.globService.getFormValue(this.groupForm.get('TemporaryPassword').value)
    }
    try {
      const result = await this.passService.sendPasswordChanged(this.userInformation.UserId, reqBody).toPromise();

      return true;
    } catch (error) {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
      return false;
    }
  }

  changePasswordLogin(event) {
    this.pswLoginState = event.checked;
  }

  focusOnField(fieldName) {

  }

  focusOutField(fieldName) {
    switch (fieldName) {
      case 'password':
        if (!this.groupForm.get('TemporaryPassword').valid) {
          this.tranService.errorToastMessage(this.userConfiguration.passwordmessage);
        }
        if (this.groupForm.get('TemporaryPassword').value && this.groupForm.get('TemporaryPassword').value.length % 3 !== 0) {
          this.passwordStrengthCheck();
        }
        break;

      default:
        break;
    }
  }

  closeModal() {
    this.modalCtrl.dismiss('closed');
  }

}
