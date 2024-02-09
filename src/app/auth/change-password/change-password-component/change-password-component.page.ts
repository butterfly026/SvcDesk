import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators, UntypedFormBuilder, AbstractControl } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { LoadingService, TranService } from 'src/services';
import { MustMatch } from 'src/app/model/mustMatch/must-match';
import { ChangePasswordService } from './services/change-password.service';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-change-password-component',
  templateUrl: './change-password-component.page.html',
  styleUrls: ['./change-password-component.page.scss'],
})
export class ChangePasswordComponentPage implements OnInit, OnDestroy {

  @Input() ContactCode: string = '';
  @Input() Mode: string = ''
  @Output('changePassword') changePassword: EventEmitter<string> = new EventEmitter<string>();

  formData: UntypedFormGroup;
  twoFAState = false;
  twoFACtrl = new UntypedFormControl('', [Validators.required]);
  show: boolean = false;
  psdStr: string = '';
  passwordStrengStr: string = 'password_weak';
  passReasonStr: string = '';
  spinner: { password: boolean };
  
  private passwordMode: string = '';
  private pageConfiguration: any = {};
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private formBuilder: UntypedFormBuilder,
    private passService: ChangePasswordService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();

    this.formData = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', Validators.required]
    },
      {
        validator: MustMatch('newPassword', 'confirmPassword')
      }
    );

    const contactDetail = this.globService.PasswordInformation;
    if (contactDetail) {
      if (contactDetail.passwordcomplexitymessage) {
        this.psdStr = contactDetail.passwordcomplexitymessage;
      }

      if (contactDetail.passwordMode) {
        this.passwordMode = this.globService.PasswordInformation.passwordMode;
      }
    }

  }

  ngOnInit(): void {
    if (this.Mode != '') {
      this.passwordMode = this.Mode;
    }

    this.formData.get('newPassword').valueChanges
      .pipe(debounceTime(1000), takeUntil(this.unsubscribeAll$))
      .subscribe((password: any) => {
        if (password) {
          if (password.length % 3 === 0) {
            this.passwordStrengthCheck();
          }
        }
      });

    this.getPageConfiguration();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  get f(): { [key: string]: AbstractControl<any, any> } {
    return this.formData.controls;
  }

  goBack(): void {
    switch (this.passwordMode) {
      case 'optional':
        this.changePassword.emit('main');
        break;
      case 'mustChange':
        this.globService.DialogControlFlag = "ChangePasswordClosed";
        break;
      default:
        this.changePassword.emit('close');
        break;
    }

    this.modalCtrl.dismiss();
  }

  triggerSubmit(): void {
    document.getElementById('submitButton').click();
  }

  togglePasswordShow(): void {
    this.show=!this.show;
  }

  focusOutField(fieldName): void {
    if (fieldName === 'password') {
      if (this.formData.get('newPassword').invalid) {
        this.tranService.errorToastMessage(this.pageConfiguration.passwordmessage);
      }

      if (this.formData.get('newPassword').value && this.formData.get('newPassword').value.length % 3 !== 0) {
        this.passwordStrengthCheck();
      }
    }
  }

  async passwordSubmit(): Promise<void> {
    if (this.formData.valid) {
      await this.loading.present();
      const reqData = {
        ContactCode: this.ContactCode,
        OldPassword: this.formData.controls['oldPassword'].value,
        NewPassword: this.formData.controls['newPassword'].value
      }

      this.passService.changePassword(reqData)
        .pipe(takeUntil(this.unsubscribeAll$))
        .subscribe({
          next: async () => {
            await this.loading.dismiss();
            await this.sendPasswordChanged();
            this.presentAlert('update_password_success');
          },
          error: async (error: any) => {
            await this.loading.dismiss();
            if (error.error && error.error.errors && error.error.errors.PasswordMismatch) {
              this.tranService.errorMessage(error.error.errors.PasswordMismatch[0]);
            }
            this.tranService.errorMessage(error);
          }
        });
    }
  }

  async generatePassword(): Promise<void> {
    await this.loading.present();
    this.passService.passwordsSuggestion()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result: any) => {
          await this.loading.dismiss();
          const convResult = this.globService.ConvertKeysToLowerCase(result);
          this.openPasswordSuggestionAlert(convResult.password);
        },
        error: async (error: any) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      });
  }

  private async getPageConfiguration(): Promise<void> {
    await this.loading.present();
    this.passService.changePasswordConfiguration()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result: any) => {
          await this.loading.dismiss();
          this.pageConfiguration = this.globService.ConvertKeysToLowerCase(result);
          this.psdStr = this.pageConfiguration?.passwordmessage;
        },
        error: async (error: any) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      });
  }

  private async sendPasswordChanged(): Promise<void> {
    const reqBody = { Password: this.globService.getFormValue(this.formData.get('newPassword').value) };
    this.passService.sendPasswordChanged(this.ContactCode, reqBody)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        error: async error => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      });
  }

  private async presentAlert(value): Promise<void> {
    const alert = await this.alertCtrl.create({
      message: this.tranService.instant(value),
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            if (this.passwordMode === 'mustChange' || this.passwordMode === 'optional') {
              this.changePassword.emit('changePassword&&' + this.formData.controls['newPassword'].value);
            } else {
              this.changePassword.emit('close');
              this.modalCtrl.dismiss();
            }
          }
        }
      ],
      backdropDismiss: false,
    });
    await alert.present();
  }

  private async openPasswordSuggestionAlert(password): Promise<void> {
    const alert = await this.alertCtrl.create({
      message: password,
      subHeader: this.tranService.instant('password_suggest'),
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Yes',
          handler: () => {
            this.formData.get('newPassword').setValue(password);
            this.formData.get('confirmPassword').setValue(password);
            this.passwordStrengStr = 'password_strong';
          }
        }
      ],
      backdropDismiss: false,
    });
    await alert.present();
  }

  private passwordStrengthCheck(): void {
    this.spinner.password = true;
    this.passService.passwordStrengthCheck(this.formData.get('newPassword').value ?? null)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: (result: any) => {
          this.spinner.password = false;
          this.formData.get('newPassword').markAsTouched();
          this.formData.get('newPassword').markAsDirty();
          this.setPasswordStrengthStr(this.globService.ConvertKeysToLowerCase(result));
        },
        error: (error: any) => {
          this.spinner.password = false;
  
          this.tranService.errorMessage(error);
        }
      });
  }

  private setPasswordStrengthStr(value): void {
    if (value.result.toLowerCase() === 'failed') {
      this.formData.get('newPassword').setErrors({ invalid: true });
      this.passReasonStr = value.reason;
      this.passwordStrengStr = 'password_failed';
      
    } else {
      if (
        this.pageConfiguration.minimumpasswordstrength === 'Medium' || 
        this.pageConfiguration.minimumpasswordstrength === 'Strong'
      ) {
        switch (value.passwordstrength.toLowerCase()) {
          case 'medium':
            this.passwordStrengStr = 'password_medium';
            if (this.pageConfiguration.minimumpasswordstrength === 'Strong') {
              this.formData.get('newPassword').setErrors({ invalid: true });
            }
            break;
          case 'strong':
            this.passwordStrengStr = 'password_strong';
            break;
          default:
            this.formData.get('newPassword').setErrors({ invalid: true });
            this.passwordStrengStr = 'password_weak';
            break;
        }
      }
    }
  }

}
