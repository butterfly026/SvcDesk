import { Component, Input, OnDestroy } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { ForgotPasswordService } from './services/forgot-password.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnDestroy {

  @Input() FormMode: string = '';
  @Input() token: string = '';
  @Input() SiteId: string = '';

  formGroup: UntypedFormGroup;
  serviceTabIndex: number = 0;
  emailSend: boolean = false;

  private mobileNumber: string = '';
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private forgotService: ForgotPasswordService,
    private modalCtrl: ModalController,
    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService,
  ) {
    this.formGroup = this.formBuilder.group({
      AccountNumber: ['', Validators.required]
    });
    this.tranService.translaterService();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  get f(): { [key: string]: AbstractControl<any, any> } {
    return this.formGroup.controls;
  }

  onCodeChanged(event): void {
    this.mobileNumber = event;
  }

  selectTabs(event): void {
    this.serviceTabIndex = event.index;
  }

  getValid(): boolean {
    return this.formGroup.valid && this.mobileNumber.length === 4;
  }

  submitTrigger(): void {
    this.submitForm();
  }

  closeModal(): void {
    this.modalCtrl.dismiss();
  }
  
  async sendEmailForgotPassword(): Promise<void> {   
    await this.loading.present();
    const reqData = { accountNumber: this.formGroup.get('AccountNumber').value, token: this.token, siteId:this.SiteId };
    this.forgotService.passwordResetEmail(reqData)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result: any) => {
          const convResult = this.globService.ConvertKeysToLowerCase(result);
          await this.loading.dismiss();
          this.emailSend = true;      
          this.tranService.errorToastMessage(convResult.detail);
          this.modalCtrl.dismiss();
        },
        error: async (error: any) => {    
          await this.loading.dismiss();      
          this.tranService.customErrorMessage(error?.error?.detail, "reset_failed", error.error.status);
        }
      });  
  }

  private async submitForm(): Promise<void> {
    if (this.getValid) {
      await this.loading.present();
      const reqData = { ContactCode: this.formGroup.get('AccountNumber').value, MSISDNFragment: this.mobileNumber };
      this.forgotService.passwordResetSMS(reqData)
        .pipe(takeUntil(this.unsubscribeAll$))
        .subscribe({
          next: async () => {
            await this.loading.dismiss();
            this.modalCtrl.dismiss();
          },
          error: async (error: any) => { 
            await this.loading.dismiss();
            error?.error?.status !== null
              ? this.tranService.customErrorMessage(error.error.detail, "reset_failed", error?.error?.status)
              : this.tranService.customErrorMessage(error.name, "reset_failed", error.status); 
          }
        });
    }
  } 
}
