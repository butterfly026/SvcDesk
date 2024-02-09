import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { ContactsAuthService } from './services/contacts-authentication.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogDataItem, RelatedContact, RelatedContactDetail } from 'src/app/Contacts/related-contacts/related-contacts.types';
import { SpinnerService } from 'src/app/Shared/services';
import { RelatedContactsService } from 'src/app/Contacts/related-contacts/services/related-contacts.service';
import { MatAlertService } from 'src/app/Shared/services/mat-alert.service';
import { AuthenticationInfo } from './contact-authentication.types';

@Component({
  selector: 'app-contact-authentication',
  templateUrl: './contact-authentication.component.html',
  styleUrls: ['./contact-authentication.component.scss'],
})
export class ContactAuthenticationComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Input() MyComponentId: string = '';
  @Input() groupState: string = '';
  @Input() UserId: string = '';
  @Input() formSubmitState: any;
  @Input() AuthType: string = 'RelatedContact';
  @Input() AuthenticationId: string = '';
  @Output('ContactAuthenticationComponent') public ContactAuthenticationComponent: EventEmitter<any> = new EventEmitter<any>();

  groupList: any[] = [];
  groupForm: UntypedFormGroup;

  suggestPassword: string = '';
  getFormDataState: boolean = false;

  passwordStrengStr: string = 'password_weak';

  reasonStr: any = {};
  spinner: any = {};
  showClear: boolean = false;

  pswLoginState: boolean = false;
  enableTwoFactor: boolean = false;
  subDestroy: Subject<any> = new Subject();
  curAuthInfo: AuthenticationInfo = null;
  RelatedId: string = '';
  curRelatedContact: RelatedContactDetail = null;

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private authService: ContactsAuthService,
    private spinnerService: SpinnerService,
    private matAlert: MatAlertService,
    private cdr: ChangeDetectorRef,
    private relateContactSvc: RelatedContactsService,

    public globService: GlobalService,
    private formBuilder: UntypedFormBuilder,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private dialogRef: MatDialogRef<ContactAuthenticationComponent>,    
    @Inject(MAT_DIALOG_DATA) private dlgData: DialogDataItem
  ) {

    this.groupForm = this.formBuilder.group({
      LoginId: [''],
      Email: ['', [Validators.email]],
      MobilePhone: [''],
      TemporaryPassword: [''],
    });

  }

  async ngOnInit() {
    
    if(this.dlgData?.ContactCode){
      this.ContactCode = this.dlgData.ContactCode;
    }
    if(this.dlgData?.RelatedId){
      this.RelatedId = this.dlgData.RelatedId;
      this.getRelatedContactInfo();
    }
  }

  initComponent() {

    this.passwordFieldReset();
    this.groupForm.get('TemporaryPassword').valueChanges.pipe(debounceTime(1000)).subscribe((password: any) => {
      if (password) {
        if (password.length % 3 === 0) {
          this.passwordStrengthCheck();
        }
      }
    });

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

  }

  ngOnDestroy(): void {
    this.subDestroy.complete();
  }

  private async getRelatedContactInfo(): Promise<void> {
    await this.spinnerService.loading();
    this.relateContactSvc.getRelatedContactDetail(this.ContactCode, this.RelatedId)
      .subscribe({
        next: async (_result) => {
          await this.spinnerService.end();
          this.curRelatedContact = _result;
          this.getAuthInfo();
        },
        error: async (err) => {
          await this.spinnerService.end();
          const errResult = this.globService.ConvertKeysToLowerCase(err);
          this.tranService.errorMessage(err);

          if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
            setTimeout(() => {
              this.closeComponent();
            }, 1000);
          }
        }
      });
  }
  private async getAuthInfo(){
    await this.spinnerService.loading();
    this.authService.getAuthenticationUser(this.RelatedId)
      .subscribe({
        next: async (_result) => {
          await this.spinnerService.end();
          this.curAuthInfo = _result;
          this.groupForm.get('MobilePhone').setValue(this.curAuthInfo?.Mobile ? this.curAuthInfo.Mobile : this.curRelatedContact.MobilePhone);
          this.groupForm.get('LoginId').setValue(this.curAuthInfo?.LoginId ? this.curAuthInfo.LoginId : this.curRelatedContact.Id);
          this.groupForm.get('Email').setValue(this.curAuthInfo?.Email ? this.curAuthInfo.Email : this.curRelatedContact.Email);
          this.groupForm.get('TemporaryPassword').setValue(this.curAuthInfo?.Password);
          await this.focusOutField('email');
          setTimeout(()=>{
            this.focusOutField('mobile');
          }, 10);
          
        },
        error: async (err) => {
          await this.spinnerService.end();
          const errResult = this.globService.ConvertKeysToLowerCase(err);
          this.tranService.errorMessage(err);

          if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
            setTimeout(() => {
              this.closeComponent();
            }, 1000);
          }
        }
      });
  }



  async saveAuthentication(){
    await this.spinnerService.loading();
    let authInfo: AuthenticationInfo = {
      LoginId: this.groupForm.get('LoginId').value,
      Mobile: this.groupForm.get('MobilePhone').value,
      Email: this.groupForm.get('Email').value,
      ChangePasswordOnFirstLogin: this.pswLoginState,
      MultiFactorEnabled: this.enableTwoFactor,
      Password: this.groupForm.get('TemporaryPassword').value ? this.groupForm.get('TemporaryPassword').value : 'Selcomm222$',
      Roles: [{
        Name: 'Related Contact',
        Default: true,
      }],
    };
    this.authService.createAuthenticationUser(this.RelatedId, 'CustomerRelated', authInfo)
      .subscribe({
        next: async (_result) => {
          await this.spinnerService.end();
          this.dialogRef.close('ok');
        },
        error: async (err) => {
          await this.spinnerService.end();
          const errResult = this.globService.ConvertKeysToLowerCase(err);
          this.tranService.matErrorMessage(errResult, (title, button, content) => {
            this.matAlert.alert(content, title, button);
          });
        }
      });
  }
  async getNextUserId() {

    this.groupForm.get('LoginId').setValue(this.UserId);
    if (this.UserId) {
      setTimeout(() => {
        this.groupForm.get('LoginId').setErrors(null);
      }, 200);
    }

  }

  createSubmitTrigger() {
    document.getElementById('authenticationDetailSubmit').click();
  }

  submitForm() {
    if (this.groupForm.valid) {

    }
  }

  get f() {
    return this.groupForm.controls;
  }

  focusOutField(fieldName) {
    switch (fieldName) {
      case 'email':
        if (!this.getCheckAvailableCall('email')) {
          this.checkEmailValidate();
        }
        break;
      case 'mobile':
        if (!this.getCheckAvailableCall('mobile')) {
          this.checkMobileValidate();
        }
        break;
      case 'loginId':
        if (!this.getCheckAvailableCall('loginId')) {
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


  async checkEmailValidate() {
    this.spinner.email = true;
    this.authService.checkEmailFormatValidate(this.globService.getFormValue(this.groupForm.get('Email').value)).subscribe(async (result: any) => {
      const formatValidateResult = this.globService.ConvertKeysToLowerCase(result);
      if (!formatValidateResult.valid) {
        this.tranService.errorToastOnly('invalid_authentication_email_format');
        this.groupForm.get('Email').setErrors({ 'invalid_format': true });
        this.f.MobilePhone.markAsTouched();
        this.spinner.email = false;
      } else {
        this.authService.checkEmailValidate(this.globService.getFormValue(this.groupForm.get('Email').value)).subscribe(async (result: any) => {
          this.spinner.email = false;
          const convResult = this.globService.ConvertKeysToLowerCase(result);
          if (convResult.used) {
            this.tranService.errorToastOnly('invalid_authentication_email');
            this.groupForm.get('Email').setErrors({ 'invalid': true });
            this.f.MobilePhone.markAsTouched();
          } else {
            this.tranService.errorToastOnly('valid_email');
            this.groupForm.get('Email').setErrors(null);
          }
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
    let val = this.globService.getFormValue(this.groupForm.get('MobilePhone').value);
    this.authService.checkMobileFormatValidate(val).subscribe(async (result: any) => {

      const convMobileValidateResult = this.globService.ConvertKeysToLowerCase(result);
      if (!convMobileValidateResult.valid) {
        this.tranService.errorToastOnly('invalid_authentication_mobile_format');
        this.groupForm.get('MobilePhone').setErrors({ 'invalid_format': true });
        this.f.MobilePhone.markAsTouched();
        this.spinner.mobile = false;
      } else {
        this.authService.checkMobileValidate(val).subscribe(async (result: any) => {
          this.spinner.mobile = false;
          const convResult = this.globService.ConvertKeysToLowerCase(result);
          if (convResult.used) {
            this.tranService.errorToastOnly('invalid_authentication_mobile');
            this.groupForm.get('MobilePhone').setErrors({ 'invalid': true });            
            this.f.MobilePhone.markAsTouched();
          } else {
            this.tranService.errorToastOnly('valid_mobile');
            this.groupForm.get('MobilePhone').setErrors(null);
          }
          
        }, async (error: any) => {
          this.spinner.mobile = false;

          await this.loading.dismiss();
          this.tranService.errorMessage(console.error());
        });
      }
    }, async (error: any) => {
      this.spinner.mobile = false;
      await this.loading.dismiss();
      this.tranService.errorMessage(console.error());
    });
  }
  setValidFormCtrl(Ctrl) {
    this.groupForm.get(Ctrl).setErrors(null);
  }

  nextAvailableCall(type) {
    let returnType = false;
    switch (type) {
      case 'loginId':
        if (this.groupForm.get('LoginId').value) {          
          returnType = false;
        } else {
          returnType = true;
          if (this.groupForm.get('LoginId').value) {
            this.groupForm.get('LoginId').setErrors(null);
          }
        }
        break;
      case 'email':
        if (!this.groupForm.get('Email').hasError('email') && this.groupForm.get('Email').value) {
          returnType = false;
        } else {
          returnType = true;
          this.groupForm.get('Email').setErrors(null);
        }
        break;
      default:
        break;
    }

    return returnType;
  }

  public getValidState() {
    return (this.nextAvailableCall('email') && this.nextAvailableCall('loginId'))
      || !this.groupForm.get('TemporaryPassword').value || !this.groupForm.valid;
  }
  
  getCheckAvailableCall(type) {
    let returnType = false;
    switch (type) {
      case 'loginId':
        if (this.groupForm.get('LoginId').value) {
          returnType = false;
        } else {
          returnType = true;          
        }
        break;
      case 'email':
        if (this.groupForm.get('Email').value) {
          if (this.curAuthInfo?.Email === this.groupForm.get('Email').value)
            returnType = true;
          else
            returnType = false;
        } else {
          returnType = true;
        }
        break;
      case 'mobile':
        if (this.groupForm.get('MobilePhone').value) {
          if (this.curAuthInfo?.Mobile === this.groupForm.get('MobilePhone').value)
            returnType = true;
          else
            returnType = false;
        } else {
          returnType = true;
        }
        break;

      default:
        break;
    }

    return returnType;
  }

  checkAvailableCall(type) {
    let returnType = false;
    switch (type) {
      case 'loginId':
        if (this.groupForm.get('LoginId').value) {
          returnType = false;
        } else {
          returnType = true;
          if (this.groupForm.get('LoginId').value) {
            this.groupForm.get('LoginId').setErrors(null);
          }
        }
        break;
      case 'email':
        if (this.groupForm.get('Email').valid && this.groupForm.get('Email').value) {
          if (this.curAuthInfo?.Email === this.groupForm.get('Email').value)
            returnType = true;
          else
            returnType = false;
        } else {
          returnType = true;
          this.groupForm.get('Email').setErrors(null);
        }
        break;
      case 'mobile':
        if (this.groupForm.get('MobilePhone').valid && this.groupForm.get('MobilePhone').value) {
          if (this.curAuthInfo?.Mobile === this.groupForm.get('MobilePhone').value)
            returnType = true;
          else
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



  passwordStrengthCheck() {
    if(this.AuthType == 'RelatedContact' && !this.groupForm.get('TemporaryPassword').value)
      return;
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
          if (convResult.passwordstrength.toLowerCase() === 'medium') {
            this.passwordStrengStr = 'password_medium';
          } else if (convResult.passwordstrength.toLowerCase() === 'strong') {
            this.passwordStrengStr = 'password_strong';
          } else {
            this.groupForm.get('TemporaryPassword').setErrors({ invalid: true, pattern: true });
            this.passwordStrengStr = 'password_weak';
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

  public getSubmitData() {
    let reqData = {
      LoginId: this.groupForm.get('LoginId').value,
      Mobile: this.groupForm.get('MobilePhone').value,
      Email: this.groupForm.get('Email').value,
      ChangePasswordOnFirstLogin: this.pswLoginState,
      MultiFactorEnabled: this.enableTwoFactor,
      Password: this.groupForm.get('TemporaryPassword').value,
      Roles: [{
        Name: 'Customer',
        Default: true,
      }],
      ComponentId: this.MyComponentId,
    }
    return reqData;
  }
  closeComponent() {
    this.dialogRef.close();
  }

  get RelatedContactTitle(){
    return (this.RelatedId && this.curRelatedContact) ? `[${this.RelatedId} - ${this.curRelatedContact.FirstName} ${this.curRelatedContact.FamilyName}]` : ''
  }

  get saveButtonState(){
    return !this.groupForm.valid;
  }
  get getSaveBtnState(){    
    return !this.groupForm.valid || (this.spinner?.mobile ? true : false) || (this.spinner?.email ? true : false);
  }
}
