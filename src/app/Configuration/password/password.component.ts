import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { PasswordConfigurationService } from './services/password-configuration.service';
import { AlertService } from 'src/services/alert-service.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
})
export class PasswordComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Output('PasswordComponent') PasswordComponent: EventEmitter<string> = new EventEmitter<string>();



  configurationForm: UntypedFormGroup;

  configurationData: any;

  minStrengthList: any[] = [
    { id: 'Medium', name: 'medium' },
    { id: 'Strong', name: 'strong' },
  ];

  constructor(
    private configurationService: PasswordConfigurationService,
    private loading: LoadingService,
    private tranService: TranService,
    private alertService: AlertService,

    private fromBuilder: UntypedFormBuilder,
    public globService: GlobalService,
  ) {

    this.configurationForm = this.fromBuilder.group({
      MinimumLength: ['', [Validators.required, Validators.min(6), Validators.max(30)]],
      MaximumLength: ['', [Validators.required, Validators.min(6), Validators.max(30)]],
      MinimumNumberSpecialCharacters: ['', [Validators.required, Validators.min(0), Validators.max(30)]],
      MinimumNumberUpperCaseCharacters: ['', [Validators.required, Validators.min(0), Validators.max(30)]],
      MinimumNumberNumberIntegers: ['', [Validators.required, Validators.min(0), Validators.max(30)]],
      ExpiryPeriod: ['', [Validators.required, Validators.min(0), Validators.max(10000)]],
      TemporaryPasswordExpiryPeriod: ['', [Validators.required, Validators.min(0), Validators.max(3000)]],
      PasswordChangesBeforeReuse: ['', [Validators.required, Validators.min(0), Validators.max(1000)]],
      PasswordComplexityMessage: ['', Validators.required],
    });

    // this.configurationForm.get('MinimumLength').valueChanges.subscribe((result: any) => {
    //   if (result && parseFloat(result) > 5 && parseFloat(result) < 31) {
    //   } else {
    //     this.configurationForm.get('MinimumLength').setErrors({ invalid: true, pattern: true });
    //   }
    // });

    // this.configurationForm.get('MaximumLength').valueChanges.subscribe((result: any) => {
    //   if (result && parseFloat(result) > 5 && parseFloat(result) < 31) {
    //   } else {
    //     this.configurationForm.get('MaximumLength').setErrors({ invalid: true, pattern: true });
    //   }
    // });
  }

  ngOnInit() {
    this.getPasswordConfiguration();
  }

  get f() {
    return this.configurationForm.controls;
  }

  

  async getPermission() {
    await this.loading.present();
    this.globService.getAuthorization('/Users/Configurations/Password').subscribe(async (_result) => {
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

  // async getPasswordConfiguration() {
  //   await this.loading.present();

  //   const reqBody = {
  //     'OperationId': '/Users/Password/Configuration#get'
  //   }

  //   this.globService.operationAPIService(reqBody).subscribe(async (result: any) => {
  //     await this.loading.dismiss();
  //     const convResult = this.globService.ConvertKeysToLowerCase(JSON.parse(result));
  //     this.configurationData = convResult;
      

  //     for (var key in this.configurationForm.controls) {
  //       this.configurationForm.get(key).setValue(this.configurationData[key.toLowerCase()].toString());
  //     }
  //   }, async error => {
  //     await this.loading.dismiss();
  //     this.tranService.errorMessage(error);
  //   });
  // }

  async getPasswordConfiguration() {
    await this.loading.present();
    this.configurationService.passwordConfiguration('/Users/Passwords/Configuration').subscribe(async (result: any) => {
      await this.loading.dismiss();
      // const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.configurationData = result;
      for (var key in this.configurationForm.controls) {
        if(this.configurationData[key])
          this.configurationForm.get(key).setValue(this.configurationData[key].toString());
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
        if (this.configurationData[key] && this.configurationForm.get(key).value !== this.configurationData[key]?.toString()) {
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
  //       OperationId: '/Users/Password/Configuration#put',
  //       Parameters: [],
  //       RequestBody: reqbody
  //     }
  //     this.globService.operationAPIService(reqData).subscribe(async (result: any) => {
  //       await this.loading.dismiss();
  //       for (var key in this.configurationForm.controls) {
  //         this.configurationData[key.toLowerCase()] = this.configurationForm.get(key).value;
  //       }

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
        reqbody[key] = key.toLowerCase().includes('message')  ? this.configurationForm.get(key).value : parseInt(this.configurationForm.get(key).value) ;
      }

      this.configurationService.uPasswordConfiguration(reqbody, '/Users/Passwords/Configuration').subscribe(async (result: any) => {
        await this.loading.dismiss();
        for (var key in this.configurationForm.controls) {
          this.configurationData[key] = this.configurationForm.get(key).value;
        }
        
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
    this.PasswordComponent.emit('close');
  }

}
