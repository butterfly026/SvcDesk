import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { LoadingService, TranService } from 'src/services';
import { AlertService } from 'src/services/alert-service.service';
import { GlobalService } from 'src/services/global-service.service';
import { PasswordConfigurationService } from './services/password-configuration.service';
import { ResetConfig } from './password-reset.component.types';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
})
export class PasswordResetComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Output('PasswordResetComponent') PasswordResetComponent: EventEmitter<any> = new EventEmitter<any>();
  configurationForm: UntypedFormGroup;

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private alertService: AlertService,
    private configService: PasswordConfigurationService,
    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService,
  ) {
    this.configurationForm = this.formBuilder.group({
      EmailLink: [false],
      SMSReset: [false],
    })
  }

  ngOnInit() {
    this.getPermission();
  }

  private async getPermission(): Promise<void> {
    await this.loading.present();
    this.globService.getAuthorization('/Users/Passwords/Reset/Configuration', true)
      .subscribe({
        next: async (_result) => {
          await this.loading.dismiss();
          let permissions = _result.map(s => s.Resource.replace('/Users/Passwords/Reset/Configuration', "").replace('/', ""));
          if (permissions.includes('')) {
            this.getResetConfiguration();
          } else {
            await this.loading.dismiss();
            this.tranService.errorMessage('resource_forbidden');
            this.alertService.closeAllAlerts();
            setTimeout(() => {
              this.goBack();
            }, 1000);
          }
        },
        error: async (err) => {
          await this.loading.dismiss();
          const errResult = this.globService.ConvertKeysToLowerCase(err);
          this.tranService.errorMessage('resource_forbidden');

          if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
            this.alertService.closeAllAlerts();
            setTimeout(() => {
              this.goBack();
            }, 1000);
          }
        }
      });
  }
  async getResetConfiguration() {
    await this.loading.present();
    this.configService.getPasswordResetConfig().subscribe(async (result: ResetConfig) => {
      await this.loading.dismiss();
      // const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.configurationForm.get('EmailLink').setValue(result.EmailLink);
      this.configurationForm.get('SMSReset').setValue(result.SMSReset);
    }, async error => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(error);
      this.tranService.errorMessage(convResult);
    });
  }

  async saveData() {
    await this.loading.present();
    let configData: ResetConfig = {
      EmailLink: this.configurationForm.get('EmailLink').value,
      SMSReset: this.configurationForm.get('SMSReset').value
    }
    this.configService.updatePasswordResetConfig(configData).subscribe(async (result: ResetConfig) => {
      await this.loading.dismiss();
      this.tranService.convertText('config_updated').subscribe(value => {
        this.tranService.errorMessage(value);
      });
      setTimeout(() => {
        this.goBack();
      }, 1500);
      
      // const convResult = this.globService.ConvertKeysToLowerCase(result);
    }, async error => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(error);
      this.tranService.errorMessage(convResult);
    });

  }

  goBack() {
    this.PasswordResetComponent.emit('close');
  }


}
