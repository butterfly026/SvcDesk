import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { AuthenticationDetailService } from './services/authentication-detail.service';

@Component({
  selector: 'app-authentication-detail',
  templateUrl: './authentication-detail.component.html',
  styleUrls: ['./authentication-detail.component.scss'],
})
export class AuthenticationDetailComponent implements OnInit, OnChanges, OnDestroy {

  @Input() ContactCode: string = '';
  @Input() groupState: string = '';
  @Input() UserId: string = '';
  @Input() currentGroup: any;
  @Input() userConfiguration: any;
  @Input() formSubmitState: any;


  @Output('AuthenticationDetailComponent') public AuthenticationDetailComponent: EventEmitter<any> = new EventEmitter<any>();

  groupList: any[] = [];
  groupForm: UntypedFormGroup;

  suggestPassword: string = '';
  getFormDataState: boolean = false;

  passwordStrengStr: string = 'password_weak';

  reasonStr: any = {};
  spinner: any = {};
  showClear: boolean = false;

  pswLoginState: boolean = false;
  enableMFAState: boolean = false;
  subDestroy: Subject<any> = new Subject();

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private authService: AuthenticationDetailService,

    public globService: GlobalService,
    private formBuilder: UntypedFormBuilder,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
  ) {

    this.groupForm = this.formBuilder.group({
      LoginId: ['', Validators.required],
      Email: ['', [Validators.email]],
      MobilePhone: [''],
      TemporaryPassword: ['', Validators.required],
    });

  }

  async ngOnInit() {  
    this.globService.serviceProviderUserSubject.pipe(takeUntil(this.subDestroy)).subscribe((result: any) => {
      if (result === 'formSubmit') {
        this.createSubmitTrigger();
      } else {
        this.groupForm.reset();
      }
      setTimeout(() => {
        this.subDestroy.next(true);
      }, 0);
    });

    if (this.groupState === 'edit') {
      this.groupForm.removeControl('TemporaryPassword');
    } else {
      this.passwordFieldReset();
      this.groupForm.get('TemporaryPassword').valueChanges.pipe(debounceTime(1000)).subscribe((password: any) => {
        if (password) {
          if (password.length % 3 === 0) {
            this.passwordStrengthCheck();
          }
        }
      });
    }

    this.groupForm.get('MobilePhone').valueChanges.subscribe((result: any) => {
      if (result) {
        this.groupForm.get('MobilePhone').setErrors({ invalid: true });
      }
    });

    this.groupForm.get('Email').valueChanges.subscribe((email: any) => {
      if (email) {
        this.groupForm.get('Email').setErrors({ invalid: true });
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.currentGroup) {
      this.getCurrentState();
      this.setLoginIdDefaultforUpdate();
    }
  }

  ngOnDestroy(): void {
    this.subDestroy.complete();
  }

  async getNextUserId() {
    if (this.userConfiguration?.logindefault?.toLowerCase().includes('userid')) {
      this.groupForm.get('LoginId').setValue(this.UserId);
      if (this.UserId) {
        setTimeout(() => {
          this.groupForm.get('LoginId').setErrors(null);
        }, 200);
      }
    }
  }

  createSubmitTrigger() {
    document.getElementById('authenticationDetailSubmit').click();
  }

  submitForm() {
    if (this.groupForm.valid) {

    }
  }

  getCurrentState() {
    for (var key in this.groupForm.controls) {
      this.groupForm.get(key).clearValidators();
    }

    this.groupForm.get('LoginId').setValue(this.currentGroup?.authenticationloginid);
    this.groupForm.get('Email').setValue(this.currentGroup?.authenticationemail);
    this.groupForm.get('MobilePhone').setValue(this.currentGroup?.authenticationmobile);

    this.enableMFAState = this.currentGroup?.changepasswordonfirstlogin;
    this.pswLoginState = this.currentGroup?.mfaenabled;

    this.setValidFormCtrl('LoginId');
    this.setValidFormCtrl('MobilePhone');
    this.setValidFormCtrl('Email');
    this.parseData();
  }

  get f() {
    return this.groupForm.controls;
  }

  closeComponent() {
    this.AuthenticationDetailComponent.emit('close');
  }

  focusOnField(fieldName) {

  }

  focusOutField(fieldName) {
    switch (fieldName) {
      case 'email':
        if (this.groupForm.get('Email').value && !this.groupForm.get('Email').hasError('email')) {
          if (this.userConfiguration.logindefault.toLowerCase().includes('email')) {
            const loginValue = this.groupForm.get('LoginId').value;
            if (typeof (loginValue) === 'undefined' || loginValue === 'null' || loginValue === '') {
              this.groupForm.get('LoginId').setValue(this.groupForm.get('Email').value);
            }
          }
        }
        if (!this.checkAvailableCall('email')) {
          this.checkEmailValidate();
        }
        break;
      case 'mobile':
        if (this.groupForm.get('MobilePhone').value) {
          if (this.userConfiguration.logindefault.toLowerCase().includes('mobile')) {
            const loginValue = this.groupForm.get('LoginId').value;
            if (typeof (loginValue) === 'undefined' || loginValue === 'null' || loginValue === '') {
              this.groupForm.get('LoginId').setValue(this.groupForm.get('MobilePhone').value);
            }
          }
        }
        if (!this.checkAvailableCall('mobile')) {
          this.checkMobileValidate();
        }
        break;
      case 'loginId':
        if (!this.checkAvailableCall('loginId')) {
          this.checkLoginId();
        }
        break;
      case 'password':
        this.passwordStrengthCheck();
        break;

      default:
        break;
    }
  }

  async checkLoginId() {
    this.spinner.loginid = true;
    this.authService.checkLoginId(this.globService.getFormValue(this.groupForm.get('LoginId').value)).subscribe(async (result: any) => {
      this.spinner.loginid = false;
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      if (convResult.used) {
        this.tranService.errorToastOnly('invalid_login_id');
        this.groupForm.get('LoginId').setErrors({ invalid: true });
      } else {
        this.tranService.errorToastOnly('valid_login');
        this.groupForm.get('LoginId').setErrors(null);
      }
      this.parseData();
    }, async (error: any) => {
      this.spinner.loginid = false;

      await this.loading.dismiss();
      this.tranService.errorMessage(console.error());
    });

  }

  setLoginIdDefaultforUpdate() {
    switch (this.userConfiguration?.logindefault?.toLowerCase()) {
      case 'email':
        this.groupForm.get('LoginId').setValue(this.currentGroup?.authenticationemail);
        break;
      case 'mobile':
        this.groupForm.get('LoginId').setValue(this.currentGroup?.authenticationmobile);
        break;
      case 'userid':
        this.groupForm.get('LoginId').setValue(this.currentGroup?.authenticationloginid);
        break;

      default:
        break;
    }
  }
  async checkEmailValidate() {
    this.spinner.email = true;
    this.authService.checkEmailFormatValidate(this.globService.getFormValue(this.groupForm.get('Email').value)).subscribe(async (result: any) => {
      const formatValidateResult = this.globService.ConvertKeysToLowerCase(result);     
      if (!formatValidateResult.valid) {
        this.tranService.errorToastOnly('invalid_authentication_email_format');
        this.groupForm.get('Email').setErrors({ 'invalid': true });
        this.spinner.email = false;
      } else {  
        this.authService.checkEmailValidate(this.globService.getFormValue(this.groupForm.get('Email').value)).subscribe(async (result: any) => {
          this.spinner.email = false;
          const convResult = this.globService.ConvertKeysToLowerCase(result);
          if (convResult.used) {
            this.tranService.errorToastOnly('invalid_authentication_email');
            this.groupForm.get('Email').setErrors({ 'invalid': true });
          } else {
            this.tranService.errorToastOnly('valid_email');
            this.groupForm.get('Email').setErrors(null);          }
          this.parseData();
        }, async (error: any) => {
          this.spinner.email = false;    
          await this.loading.dismiss();
          this.tranService.errorMessage(console.error());
        });
      }
      this.parseData();
    }, async (error: any) => {
      this.spinner.email = false;
      await this.loading.dismiss();
      this.tranService.errorMessage(console.error());
    });   
  }

  async checkMobileValidate() {
    this.spinner.mobile = true;
    this.authService.checkMobileFormatValidate(this.globService.getFormValue(this.groupForm.get('MobilePhone').value)).subscribe(async (result: any) => {
     
      const convMobileValidateResult = this.globService.ConvertKeysToLowerCase(result);
      if (!convMobileValidateResult.valid) {
        this.tranService.errorToastOnly('invalid_authentication_mobile_format');
        this.groupForm.get('MobilePhone').setErrors({ 'invalid': true });
        this.spinner.mobile = false;
      } else {
        this.authService.checkMobileValidate(this.globService.getFormValue(this.groupForm.get('MobilePhone').value)).subscribe(async (result: any) => {
          this.spinner.mobile = false;
          const convResult = this.globService.ConvertKeysToLowerCase(result);    
          if (convResult.used) {
            this.tranService.errorToastOnly('invalid_authentication_mobile');
            this.groupForm.get('MobilePhone').setErrors({ 'invalid': true });
          } else {
            this.tranService.errorToastOnly('valid_mobile');
            this.groupForm.get('MobilePhone').setErrors(null);
          }
          this.parseData();
        }, async (error: any) => {
          this.spinner.mobile = false;
    
          await this.loading.dismiss();
          this.tranService.errorMessage(console.error());
        });
      }
      this.parseData();
    }, async (error: any) => {
      this.spinner.mobile = false;
      await this.loading.dismiss();
      this.tranService.errorMessage(console.error());
    });   
  }
  setValidFormCtrl(Ctrl) {
    this.groupForm.get(Ctrl).setErrors(null);
  }

  async locoutAccount() {
    if (this.groupForm.get('LoginId').valid) {
      const lockUserInformation = await this.tranService.convertText('lock_user_confirmation').toPromise();
      const alert = await this.alertCtrl.create({
        message: lockUserInformation,
        buttons: [
          {
            text: 'Yes',
            handler: async () => {
              await this.loading.present();
              const reqBody = '9999-01-01T00:00:00';
              this.authService.LockoutUser(this.currentGroup?.authenticationloginid, JSON.stringify(reqBody)).subscribe(async (result: any) => {
                await this.loading.dismiss();
                this.currentGroup.authenticationstatus = 'Suspended';
                this.AuthenticationDetailComponent.emit({ type: 'suspend', data: this.currentGroup });
              }, async (error: any) => {

                await this.loading.dismiss();
                this.tranService.errorMessage(error);
              });
            }
          },
          {
            text: 'No',
            role: 'cancel',
            handler: () => {

            }
          },
        ],
        backdropDismiss: false,
      });
      await alert.present();
    } else {
      this.tranService.errorToastMessage('suspend_need_put_login_id');
    }
  }

  async unBlockAccount() {
    if (this.groupForm.get('LoginId').valid) {
      await this.loading.present();
      this.authService.unBlockUser(this.globService.getFormValue(this.groupForm.get('LoginId').value)).subscribe(async (result: any) => {
        await this.loading.dismiss();
        this.currentGroup.authenticationstatus = 'Active';
        this.AuthenticationDetailComponent.emit({ type: 'unsuspend', data: this.currentGroup });
      }, async (error: any) => {
        await this.loading.dismiss();
      });
    } else {
      this.tranService.errorToastMessage('unsuspend_need_put_login_id');
    }
  }

  checkAvailableCall(type) {
    let returnType = false;
    switch (type) {
      case 'loginId':
        if (this.groupForm.get('LoginId').value && this.currentGroup?.authenticationloginid !== this.groupForm.get('LoginId').value) {
          returnType = false;
        } else {
          returnType = true;
          if (this.groupForm.get('LoginId').value) {
            this.groupForm.get('LoginId').setErrors(null);
          }
        }
        break;
      case 'email':
        if (!this.groupForm.get('Email').hasError('email') && this.groupForm.get('Email').value && this.currentGroup?.authenticationemail !== this.groupForm.get('Email').value) {
          returnType = false;
        } else {
          returnType = true;
          this.groupForm.get('Email').setErrors(null);
        }
        break;
      case 'mobile':
        if (!this.groupForm.get('MobilePhone').valid && this.groupForm.get('MobilePhone').value && this.currentGroup?.authenticationmobile !== this.groupForm.get('MobilePhone').value) {
          returnType = false;
        } else {
          returnType = true;
          this.groupForm.get('MobilePhone').setErrors(null);
        }
        break;

      default:
        break;
    }

    return returnType;
  }

  changePasswordLogin(event) {
    this.pswLoginState = event.checked;
    this.parseData();
  }

  updateMFA(event) {  
    if(this.groupForm.valid && this.groupState === 'edit')
    {
    this.enableMFAState = event.checked;
    if( this.enableMFAState){
      this.enableMFA();
    }
    else{
     this.disableMFA();
    }
    this.parseData();   
    } 
    else{
      event.stopPropagation();
    }
  }

  async enableMFA() {
    if (this.ContactCode!='') {
    this.spinner.mfa=true;
      this.authService.putEnableMFA(this.ContactCode).subscribe(async (result: any) => {
        this.spinner.mfa=false;
        this.tranService.errorToastOnly('mfa_enabled');
      }, async (error: any) => {
        this.spinner.mfa=false;
        this.tranService.errorToastOnly('failed_to_enable_mfa'); 
        this.enableMFAState=false;
      });
    } else {
      this.tranService.errorToastMessage('contact_code_required');
    }
  } 
  async disableMFA() {
    if (this.ContactCode!='') {
    this.spinner.mfa=true;
      this.authService.putDisableMFA(this.ContactCode).subscribe(async (result: any) => {
        this.spinner.mfa=false;
        this.tranService.errorToastOnly('mfa_disabled');
      }, async (error: any) => {
        this.spinner.mfa=false;
        this.tranService.errorToastOnly('failed_to_disable_mfa'); 
        this.enableMFAState=true;
      });
    } else {
      this.tranService.errorToastMessage('contact_code_required');
    }
  }

  async resetPasswordModal() {
    const modal = await this.modalCtrl.create({
      component: ResetPasswordComponent,
      componentProps: {
        userConfiguration: this.userConfiguration,
        userInformation: {
          UserId: this.currentGroup?.id,
          LoginId: this.groupForm.get('LoginId').value,
          MobilePhone: this.groupForm.get('MobilePhone').value,
          Email: this.groupForm.get('Email').value,
        }
      },
      cssClass: 'lock-out-user',
      backdropDismiss: false,
      keyboardClose: true,
    });

    modal.onDidDismiss().then((result: any) => {

    });

    await modal.present();
  }

  passwordStrengthCheck() {
    if (this.groupForm.get('TemporaryPassword').valid) {
      this.spinner.password = true;
      this.authService.passwordStrengthCheck(this.globService.getFormValue(this.groupForm.get('TemporaryPassword').value)).subscribe((result: any) => {
        const convResult = this.globService.ConvertKeysToLowerCase(result);
        this.spinner.password = false;
        this.groupForm.get('TemporaryPassword').markAsTouched();
        if (convResult.result.toLowerCase() === 'failed') {
          this.groupForm.get('TemporaryPassword').setErrors({ invalid: true, pattern: true });
          this.reasonStr.password = convResult.reason;
          this.passwordStrengStr = 'password_failed';
        } else {
          switch (this.userConfiguration?.minimumpasswordstrength) {
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

        this.parseData();

        if (this.groupForm.get('TemporaryPassword').valid && this.groupState === 'edit') {
          this.passwordChangeAlert();
        }

      }, (error: any) => {

        this.tranService.errorMessage(error);
      });
    } else {
      this.parseData();
    }
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
    this.parseData();
  }

  parseData() {
    if (this.groupForm.valid) {
      if (this.groupState === 'edit') {
        this.AuthenticationDetailComponent.emit({
          LoginId: this.groupForm.get('LoginId').value,
          Email: this.groupForm.get('Email').value,
          MobilePhone: this.groupForm.get('MobilePhone').value,
          ChangePasswordOnFirstLogin: this.pswLoginState,
          MFAEnabled: this.enableMFAState,
        });
      } else {
        if (this.groupForm.get('TemporaryPassword').value) {
          this.AuthenticationDetailComponent.emit({
            LoginId: this.groupForm.get('LoginId').value,
            Email: this.groupForm.get('Email').value,
            MobilePhone: this.groupForm.get('MobilePhone').value,
            TemporaryPassword: this.groupForm.get('TemporaryPassword').value,
            ChangePasswordOnFirstLogin: this.pswLoginState,
            MFAEnabled: this.enableMFAState,
          });
        }
      }
    } else {
      this.AuthenticationDetailComponent.emit(false);
    }
  }

  async generatePassword() {
    await this.loading.present();
    this.authService.generatePassword().subscribe(async (result: any) => {
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
}
