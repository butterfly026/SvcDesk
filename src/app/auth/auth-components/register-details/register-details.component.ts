import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { AlertController, ModalController } from '@ionic/angular';
import { takeUntil, switchMap } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { RegisterDetailService } from './services/register-detail.service';

@Component({
  selector: 'app-register-details',
  templateUrl: './register-details.component.html',
  styleUrls: ['./register-details.component.scss'],
})
export class RegisterDetailsComponent implements OnInit, OnDestroy {

  @Input() ContactCode: string = '';
  @Input() RegisteredSecurityDetails: { email: string, mobile: string } = { email: '', mobile: '', }

  groupForm: UntypedFormGroup;
  spinner: any = {};
  isDontShowAgain: boolean = false;
  registerEmailDisabled: boolean = false;
  registerMobileDisabled: boolean = false;
  removeEmailDisabled: boolean = false;
  removeMobileDisabled: boolean = false;

  private emailRemoved: boolean = false;
  private mobileRemoved: boolean = false;
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private regService: RegisterDetailService,
    private modalCtrl: ModalController,
    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService,
    private alertCtrl: AlertController,
  ) {}

  ngOnInit(): void {
    this.isDontShowAgain= localStorage.getItem('UserPreferenceHideRegistration_'+this.ContactCode) === 'true';
    this.spinner.email = false;
    this.groupForm = this.formBuilder.group({
      regEmail: ['', [Validators.email]],
      regMobile: ['']
    });

    this.groupForm.get('regMobile').valueChanges
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe((result: any) => {
        if (result) {
          this.groupForm.get('regMobile').setErrors({ invalid: true });
        } else if(
          this.groupForm.dirty && 
          !this.mobileRemoved && 
          !!this.RegisteredSecurityDetails.mobile
        ){
          this.showRemoveMobileAlert();
        } else {}
      });

    this.groupForm.get('regEmail').valueChanges
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe((result: any) => {
        if (result) {
          this.groupForm.get('regEmail').setErrors({ invalid: true });
        } else if(
          this.groupForm.dirty && 
          !this.emailRemoved && 
          !!this.RegisteredSecurityDetails.email
        ){
          this.showRemoveEmailAlert();
        } else {}
      });

    this.setRegisteredEmail();
    this.setRegisteredMobile();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  get f(): { [key: string]: AbstractControl<any, any> } {
    return this.groupForm.controls;
  }
  
  closeModal(): void {
    this.modalCtrl.dismiss();
  }

  focusOutField(fieldName): void {
    if (fieldName === 'email' && !this.checkValueChanged('email')) { 
      this.checkEmailValidate();
    } 
    if (fieldName === 'mobile' && !this.checkValueChanged('mobile')) {
      this.checkMobileValidate();
    } 
  }

  onChange(ob: MatCheckboxChange): void {
    this.isDontShowAgain =ob.checked;
    localStorage.setItem("UserPreferenceHideRegistration_"+ this.ContactCode, this.isDontShowAgain.toString());
  }

  async registerEmail(type: string): Promise<void> {
    if (type === 'remove') {
      this.showRemoveEmailAlert();
    } else if (this.groupForm.get('regEmail').value) {
      await this.loading.present();
      this.regService.registerEmail(this.ContactCode, { Email: this.groupForm.get('regEmail').value })
        .pipe(takeUntil(this.unsubscribeAll$))
        .subscribe({
          next: async () => {
            this.RegisteredSecurityDetails.email = this.groupForm.get('regEmail').value;
            this.registerEmailDisabled = true;
            this.removeEmailDisabled = false;
            await this.loading.dismiss();
            this.tranService.errorToastOnly('authentication_email_registered');
          },
          error: async (error: any) => {
            this.registerEmailDisabled = false;
            this.removeEmailDisabled = true;
            await this.loading.dismiss();
            this.tranService.errorMessage(error);
          }
        });
    } else {
      this.tranService.errorToastOnly('email_required');
      this.groupForm.get('regEmail').setErrors({ invalid: true });
    }
    this.updateSecurityDetails();
  }

  async registerMobile(type: string): Promise<void> {
    if (type === 'remove') {
      this.showRemoveMobileAlert();
    } else if (this.checkValueChanged('mobile')) {
      if (this.groupForm.get('regMobile').value) {
        await this.loading.present();
        this.regService.registerMobile(this.ContactCode, { MobileNumber: this.groupForm.get('regMobile').value })
          .pipe(takeUntil(this.unsubscribeAll$))
          .subscribe({
            next: async () => {
              this.RegisteredSecurityDetails.mobile = this.groupForm.get('regMobile').value;
              this.updateSecurityDetails();
              this.registerMobileDisabled = true;
              this.removeMobileDisabled = false;
              await this.loading.dismiss();
              this.tranService.errorToastOnly('authentication_mobile_registered');
            },
            error: async (error: any) => {
              await this.loading.dismiss();
              this.registerMobileDisabled = false;
              this.removeMobileDisabled = true;
              this.tranService.errorMessage(error);
            }
          });
      }
    } else {
      this.tranService.errorToastOnly('mobile_required');
      this.groupForm.get('regMobile').setErrors({ invalid: true });
    }
  }

  private async removeEmail(): Promise<void> {
    await this.loading.present();
    this.regService.registerEmail(this.ContactCode, { Email: null })
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async () => {
          this.registerEmailDisabled = true;
          this.removeEmailDisabled = true;
          this.clearEmail();
          this.RegisteredSecurityDetails.email = '';
          this.updateSecurityDetails();
          await this.loading.dismiss();
          this.tranService.errorToastOnly('authentication_email_removed');
        },
        error: async (error: any) => {
          this.registerEmailDisabled = true;
          this.removeEmailDisabled = false;
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      });
  }

  private async removeMobile(): Promise<void> {
    await this.loading.present();
    this.regService.registerMobile(this.ContactCode, { MobileNumber: '' })
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async () => {
          this.registerMobileDisabled = true;
          this.removeMobileDisabled = true;
          this.RegisteredSecurityDetails.mobile = '';
          this.updateSecurityDetails();
          this.clearMobile();
          await this.loading.dismiss();
          this.tranService.errorToastOnly('authentication_mobile_removed');
        },
        error: async (error: any) => {
          this.registerMobileDisabled = true;
          this.removeMobileDisabled = false;
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      });
  }
  
  private retainOldValue(type: 'email' | 'mobile'): void {
    const control = type === 'email' ? this.groupForm.get('regEmail') : this.groupForm.get('regMobile');
    control.reset(this.RegisteredSecurityDetails[type]);
  }

  private updateSecurityDetails(): void {
    this.globService.setSecurityDetails({
      email: this.RegisteredSecurityDetails.email, 
      mobile: this.RegisteredSecurityDetails.mobile
    });
  }

  private setRegisteredEmail(): void {
    this.removeEmailDisabled = !this.RegisteredSecurityDetails.email;
    if (!this.removeEmailDisabled) {
      this.groupForm.get('regEmail').setValue(this.RegisteredSecurityDetails.email);
    } 

    this.registerEmailDisabled = true;
    this.groupForm.get('regEmail').setErrors(null);
  }

  private setRegisteredMobile(): void {
    this.removeMobileDisabled = !this.RegisteredSecurityDetails.mobile;
    if (!this.removeMobileDisabled) {
      this.groupForm.get('regMobile').setValue(this.RegisteredSecurityDetails.mobile);
    }

    this.registerMobileDisabled = true;
    this.groupForm.get('regMobile').setErrors(null);
  }

  private clearEmail(): void {
    this.emailRemoved = true;
    this.groupForm.get('regEmail').reset();
  }

  private clearMobile(): void {
    this.mobileRemoved = true;
    this.groupForm.get('regMobile').reset();
  }
  
  private checkValueChanged(type): boolean {
    let isChanged = false;
    if (type === 'email') {
      isChanged = !(
        this.groupForm.get('regEmail').valid && 
        this.RegisteredSecurityDetails.email != this.groupForm.get('regEmail').value
      );
      if (isChanged) {
        this.groupForm.get('regEmail').setErrors(null);
      }
    }

    if (type === 'mobile') {
      isChanged = !( 
        this.groupForm.get('regMobile').value && 
        this.RegisteredSecurityDetails.mobile !== this.groupForm.get('regMobile').value
      );
      if (isChanged) {
        this.groupForm.get('regMobile').setErrors(null);
      }
    }
    
    return isChanged;
  }

  private async showRemoveEmailAlert(): Promise<void> {
    const alert = await this.alertCtrl.create({
      message: this.tranService.instant('warn_register_detail'),
      buttons: [
        {
          text: this.tranService.instant('yes'),
          role: 'yes',
          handler: () => this.removeEmail()
        },
        {
          text: this.tranService.instant('close'),
          role: 'cancel',
          handler: () => this.retainOldValue('email')
        }
      ]
    });
    alert.present();
  }

  private async showRemoveMobileAlert(): Promise<void> {
    const alert = await this.alertCtrl.create({
      message: this.tranService.instant('warn_register_detail'),
      buttons: [
        {
          text: this.tranService.instant('yes'),
          role: 'yes',
          handler: () => this.removeMobile()
        },
        {
          text: this.tranService.instant('close'),
          role: 'cancel',
          handler: () => this.retainOldValue('mobile')
        }
      ]
    });
    alert.present();
  }
  
  private async checkEmailValidate(): Promise<void> {
    if (!!this.groupForm.get('regEmail').value) {
      await this.loading.present();

      this.regService.checkEmailFormatValidate(this.groupForm.get('regEmail').value ?? null)
        .pipe(
          takeUntil(this.unsubscribeAll$),
          switchMap(async result => {
            const formatValidateResult = this.globService.ConvertKeysToLowerCase(result);

            if (!formatValidateResult.valid) {
              this.tranService.errorToastOnly(formatValidateResult.results[0].message);   // set error from api here
              this.groupForm.get('regEmail').setErrors({ 'invalid': true });              
              return of(null);
            } else {
              return this.regService.checkEmailValidate(this.groupForm.get('regEmail').value ?? null)
            }
          })
        ).subscribe({
          next: async (result: any) => {
            await this.loading.dismiss();

            if (!!result) {
              this.registerEmailDisabled = !!this.globService.ConvertKeysToLowerCase(result)?.used;
              this.tranService.errorToastOnly(this.registerEmailDisabled ? 'invalid_authentication_email' : 'valid_email');
              this.groupForm.get('regEmail').setErrors(this.registerEmailDisabled ? { 'invalid': true } : null);
            }
          }, 
          error: async () => {
            await this.loading.dismiss();
            this.tranService.errorMessage(console.error());
          }
        });
    } else {
      this.spinner.email = false;
    }
  }

  private async checkMobileValidate(): Promise<void> {
    if (!!this.groupForm.get('regMobile').value) {
      await this.loading.present();
      this.regService.checkMobileFormatValidate(this.groupForm.get('regMobile').value ?? null)
        .pipe(
          takeUntil(this.unsubscribeAll$),
          switchMap(result => {
            const formatValidateResult = this.globService.ConvertKeysToLowerCase(result);

            if (!formatValidateResult.valid) {
              this.tranService.errorToastOnly(formatValidateResult.results[0].message);  // set error from api here
              this.groupForm.get('regMobile').setErrors({ 'invalid': true });
              return of(null);
            } else {
              return this.regService.checkMobileValidate(this.groupForm.get('regMobile').value ?? null);
            }
          })
        ).subscribe({
          next: async (result: any) => {
            await this.loading.dismiss();

            if (!!result) {
              this.registerMobileDisabled = !!this.globService.ConvertKeysToLowerCase(result)?.used;
              this.tranService.errorToastOnly( this.registerMobileDisabled ? 'invalid_authentication_mobile' : 'valid_mobile' );
              this.groupForm.get('regMobile').setErrors( this.registerMobileDisabled ? { 'invalid': true } : null);
            }
          },
          error: async () => {
            await this.loading.dismiss();
            this.tranService.errorMessage(console.error());
          }
        })
    }
    else {
      this.spinner.email = false;
    }
  }

}
