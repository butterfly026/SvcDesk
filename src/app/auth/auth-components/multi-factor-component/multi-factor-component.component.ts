import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { MultiFactorService } from './services/multi-factor.service';

@Component({
  selector: 'app-multi-factor-component',
  templateUrl: './multi-factor-component.component.html',
  styleUrls: ['./multi-factor-component.component.scss'],
})
export class MultiFactorComponent implements OnInit, OnDestroy {
  @Input() ContactCode: string = '';
  @Input() TFConfig: { TwoFactorAuthEmail: string, TwoFactorAuthSMS: string } = { TwoFactorAuthEmail: '', TwoFactorAuthSMS: '', }

  pinCtrl: UntypedFormControl = new UntypedFormControl('', Validators.required);
  pinOptList = [];
  pinState = 'first';
  currentTime = new Date();
  showError: boolean = false;
  pinForm: UntypedFormGroup;

  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    public globService: GlobalService,
    private mfaService: MultiFactorService,
    private modalCtrl: ModalController,
    private _formBuilder: UntypedFormBuilder,
  ) {
    this.pinForm = this._formBuilder.group({
      pinCtrl: this.pinCtrl,
    });
  }

  ngOnInit(): void {
    this.getPinConfiguration();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  backPinRequest(): void {
    this.pinState = 'first';
  }

  cancelPin(): void {
    this.modalCtrl.dismiss();
  }

  async sendPinRequest(): Promise<void> {
    await this.loading.present();
    let reqBody = { Application: 'ESS' };

    for (let list of this.pinOptList) {
      if (list.value) {
        reqBody[list.id] = list.text;
      }
    }
    this.mfaService.sendPinRequest(this.ContactCode, reqBody)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async () => {
          await this.loading.dismiss();
          this.pinCtrl.reset();
          this.pinState = 'second';
          this.currentTime.setMinutes(this.currentTime.getMinutes() + 4);
        },
        error: async (error: any) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      });
  }

  async confirmPinValue(): Promise<void> {
    if (this.pinForm.valid) {
      this.showError = false;
      await this.loading.present();
      const reqBody = { Application: 'ESS', ContactId: this.ContactCode };
      this.mfaService.confirmPinValue(this.ContactCode, reqBody, this.pinCtrl.value)
        .pipe(takeUntil(this.unsubscribeAll$))
        .subscribe({
          next: async () => {
            await this.loading.dismiss();
            this.modalCtrl.dismiss('success');
            this.pinCtrl.reset();
          },
          error: async (error: any) => {
            this.showError = true;
            this.pinCtrl.reset();
            await this.loading.dismiss();
            this.tranService.errorMessage(error);
          }
        });
    }
  }
  
  private async getPinConfiguration(): Promise<void> {
    await this.loading.present();
    this.mfaService.getPinConfiguration(this.ContactCode)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result: any) => {
          await this.loading.dismiss();
          for (var key in result) {
            if (
              (key === 'Email' && this.TFConfig.TwoFactorAuthEmail) || 
              (key === 'Mobile' && this.TFConfig.TwoFactorAuthSMS)
            ) {
              this.pinOptList.push({ id: key, text: result[key], value: null });
            }
          }

          if(this.pinOptList.length==0){
            this.tranService.errorMessage('two_factor_account_details_not_registered');
          }
        },
        error: async (error: any) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      })
  }
}
