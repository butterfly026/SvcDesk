import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { ChangePasswordConfigurationService } from './services/change-password-configuration.service';
import { AlertService } from 'src/services/alert-service.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Output('ChangePasswordComponent') ChangePasswordComponent: EventEmitter<string> = new EventEmitter<string>();



  configurationForm: UntypedFormGroup;

  configurationData: any;

  minStrengthList: any[] = [
    { id: 'Medium', name: 'medium' },
    { id: 'Strong', name: 'strong' },
  ];

  constructor(
    private configurationService: ChangePasswordConfigurationService,
    private loading: LoadingService,
    private tranService: TranService,
    private alertService: AlertService,

    private fromBuilder: UntypedFormBuilder,
    public globService: GlobalService,
  ) {

    this.configurationForm = this.fromBuilder.group({
      MinimumPasswordStrength: ['', Validators.required],
      PasswordMessage: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getPermission();
  }

  async getPermission() {
    await this.loading.present();
    this.globService.getAuthorization('/Users/Configurations/Password/Change').subscribe(async (_result) => {
      await this.loading.dismiss();
      this.getPasswordConfiguration();
    }, async (err) => {
      await this.loading.dismiss();
      const errResult = this.globService.ConvertKeysToLowerCase(err);
      if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
        this.tranService.errorMessage('You do not have permission for this feature. Please contact your Administrator');
        this.alertService.closeAllAlerts();
        setTimeout(() => {
          this.cancelForm();
        }, 1000);
      } else {        
      }
    });
  }

  async getPasswordConfiguration() {
    await this.loading.present();

    this.configurationService.passwordConfiguration('/Users/ChangePassword/Configuration').subscribe(async (result: any) => {
      await this.loading.dismiss();
      this.configurationData = result;
      for (var key in this.configurationForm.controls) {
        this.configurationForm.get(key).setValue(this.configurationData[key]);
      }
    }, async error => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  getUpdateAvailable() {
    let disable = true;
    if (this.configurationData) {
      for (var key in this.configurationForm.controls) {
        if (this.configurationForm.get(key).value !== this.configurationData[key]) {
          disable = false;
        }
      }
    }
    return disable;
  }



  // async updateConfiguration() {
  //   if (this.configurationForm.valid) {
  //     await this.loading.present();
  //     let reqbody = {};

  //     for (var key in this.configurationForm.controls) {
  //       reqbody[key] = this.configurationForm.get(key).value;
  //     }

  //     const reqData = {
  //       OperationId: '/Users/ChangePassword/Configuration#put',
  //       Parameters: [],
  //       RequestBody: reqbody
  //     }
  //     this.globService.operationAPIService(reqData).subscribe(async (result: any) => {
  //       await this.loading.dismiss();

  //     }, async (error: any) => {
  //       await this.loading.dismiss();
  //       this.tranService.errorMessage(error);
  //     });
  //   }
  // }

  async updateConfiguration() {
    if (this.configurationForm.valid) {
      await this.loading.present();
      let reqbody = {};

      for (var key in this.configurationForm.controls) {
        reqbody[key] = this.configurationForm.get(key).value;
      }

      this.configurationService.uPasswordConfiguration(reqbody, '/Users/ChangePassword/Configuration').subscribe(async (result: any) => {
        await this.loading.dismiss();
        this.tranService.convertText('config_updated').subscribe(value => {
          this.tranService.errorMessage(value);
        });
        setTimeout(() => {
          this.cancelForm();
        }, 1500);
      }, async (error: any) => {
        await this.loading.dismiss();
        this.tranService.errorMessage(error);
      });
    }
  }

  triggerSubmit() {
    document.getElementById('submitButton').click();
  }

  cancelForm() {
    this.ChangePasswordComponent.emit('close');
  }
}
