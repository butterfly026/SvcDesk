import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { ServiceProviderUserConfigurationService } from './services/sevice-provider-user.service';

@Component({
  selector: 'app-service-provider-user-configuration',
  templateUrl: './service-provider-user.component.html',
  styleUrls: ['./service-provider-user.component.scss'],
})
export class ServiceProviderUserComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Output('ServiceProviderUserComponent') ServiceProviderUserComponent: EventEmitter<string> = new EventEmitter<string>();

  
  formGroup: UntypedFormGroup;

  loginList = [
    { id: 'UserId', name: 'UserId' },
    { id: 'Email', name: 'Email' },
    { id: 'Mobile', name: 'Mobile' },
  ];

  passwordList = [
    { id: 'Display', name: 'Display' },
    { id: 'Manual', name: 'Manual' },
    { id: 'Email', name: 'Email' },
    { id: 'SMS', name: 'SMS' },
  ];

  fieldModList = [
    { id: 'Optional', name: 'Optional' },
    { id: 'Mandatory', name: 'Mandatory' },
    { id: 'No', name: 'No' },
  ];

  boolList = [
    { id: true, name: 'Yes' },
    { id: false, name: 'No' },
  ];

  pswStrengthList = [
    { id: 'Weak', name: 'Weak' },
    { id: 'Medium', name: 'Medium' },
    { id: 'Strong', name: 'Strong' },
  ];

  userConfiguration = {};

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private configService: ServiceProviderUserConfigurationService,
    
    public globService: GlobalService,
    private formBuilder: UntypedFormBuilder,
  ) {
    this.formGroup = this.formBuilder.group({
      LoginDefault: ['', Validators.required],
      TemporaryPassword: ['', Validators.required],
      TemporaryPasswordAllowManual: ['', Validators.required],
      MinimumPasswordStrength: ['', Validators.required],

      PasswordMessage: ['', Validators.required],
    });

    
  }

  ngOnInit() {
    this.getUserConfiguration();
  }

  // async getUserConfiguration() {
  //   await this.loading.present();
  //   const reqBody = {
  //     OperationId: '/Users/ServiceProviderUsers/Configuration#get',
  //   }
  //   this.globService.operationAPIService(reqBody).subscribe(async (result: any) => {
  //     // this.configService.getUserConfiguration().subscribe(async (result: any) => {
  //     await this.loading.dismiss();
  //     // const convResult = this.globService.ConvertKeysToLowerCase(result);
  //     const convResult = this.globService.ConvertKeysToLowerCase(JSON.parse(result));
  //     this.userConfiguration = convResult;
      
  //     this.formGroup.reset();
  //     for (var key in this.formGroup.controls) {
  //       this.formGroup.get(key).setValue(convResult[key.toLowerCase()]);
  //     }
  //   }, async (error: any) => {
  //     await this.loading.dismiss();
  //     this.tranService.errorMessage(error);
  //   });
  // }

  async getUserConfiguration() {
    await this.loading.present();
    this.configService.userConfiguration('/Users/ServiceProviderUsers/Configuration').subscribe(async (result: any) => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.userConfiguration = convResult;
      
      this.formGroup.reset();
      for (var key in this.formGroup.controls) {
        this.formGroup.get(key).setValue(convResult[key]);
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  // async sumbitForm() {
  //   if (this.formGroup.valid) {
  //     let reqBody = {};
  //     for (var key in this.formGroup.controls) {
  //       reqBody[key] = this.formGroup.get(key).value;
  //     }
  //     const reqParam = {
  //       OperationId: '/Users/ServiceProviderUsers/Configuration#put',
  //       RequestBody: reqBody
  //     }
  //     await this.loading.present();
  //     // this.configService.putUserConfiguration(reqBody).subscribe(async (result: any) => {
  //     this.globService.operationAPIService(reqParam).subscribe(async (result: any) => {
  //       await this.loading.dismiss();
  //       // const convResult = this.globService.ConvertKeysToLowerCase(result);
  //       for (var key in this.formGroup.controls) {
  //         this.userConfiguration[key.toLowerCase()] = this.formGroup.get(key).value;
  //       }
        
  //     }, async (error: any) => {
  //       await this.loading.dismiss();
  //       this.tranService.errorMessage(error);
  //     });
  //   }
  // }

  async sumbitForm() {
    if (this.formGroup.valid) {
      let reqBody = {};
      for (var key in this.formGroup.controls) {
        reqBody[key] = this.formGroup.get(key).value;
      }

      await this.loading.present();
      this.configService.pUserConfiguration(reqBody, '/Users/ServiceProviderUsers/Configuration').subscribe(async (result: any) => {
        await this.loading.dismiss();
        for (var key in this.formGroup.controls) {
          this.userConfiguration[key] = this.formGroup.get(key).value;
        }
        
      }, async (error: any) => {
        await this.loading.dismiss();
        this.tranService.errorMessage(error);
      });
    }
  }

  submitTrigger() {
    document.getElementById('submitButton').click();
  }

  checkUpdateState() {
    let available = false;
    for (var key in this.formGroup.controls) {
      if (this.formGroup.get(key).value !== this.userConfiguration[key.toLowerCase()]) {
        available = true;
      }
    }

    return available;
  }

  backMain() {
    this.ServiceProviderUserComponent.emit('close');
  }

}
