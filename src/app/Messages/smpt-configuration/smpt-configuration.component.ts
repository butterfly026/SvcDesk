import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormControl } from '@angular/forms';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { SMTPConfigurationService } from './services/smpt-configuration.service';

@Component({
  selector: 'app-smpt-configuration',
  templateUrl: './smpt-configuration.component.html',
  styleUrls: ['./smpt-configuration.component.scss'],
})
export class SmptConfigurationComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Output('SmptConfigurationComponent') SmptConfigurationComponent: EventEmitter<string> = new EventEmitter<string>();

  

  configurationForm: UntypedFormGroup;

  configurationData: any;

  selList: any[] = [
    { id: true, name: 'yes' },
    { id: false, name: 'no' },
  ]

  constructor(
    private configurationService: SMTPConfigurationService,
    private loading: LoadingService,
    private tranService: TranService,
    
    private fromBuilder: UntypedFormBuilder,
    public globService: GlobalService,
  ) {
    
    this.configurationForm = this.fromBuilder.group({
      host: ['', Validators.required],
      port: ['', Validators.required],
      password: ['',],
      username: ['',],
      useSslTls: ['',],
    });
  }

  ngOnInit() {
    this.getSMTPConfiguration();
  }

  // async getSMTPConfiguration() {
  //   await this.loading.present();

  //   const reqBody = {
  //     'OperationId': '/Messages/SMTP/Configuration#get'
  //   }

  //   this.globService.operationAPIService(reqBody).subscribe(async (result: any) => {
  //     await this.loading.dismiss();
  //     const convResult = this.globService.ConvertKeysToLowerCase(JSON.parse(result));
      
  //     this.configurationData = convResult;
  //     this.configurationForm.reset();

  //     this.configurationForm.get('host').setValue(this.configurationData.host);
  //     this.configurationForm.get('port').setValue(this.configurationData.port);
  //     this.configurationForm.get('password').setValue(this.configurationData.password);
  //     this.configurationForm.get('username').setValue(this.configurationData.username);
  //     this.configurationForm.get('useSslTls').setValue(this.configurationData.usessltls);
  //   }, async (error: any) => {
  //     await this.loading.dismiss();
  //     this.tranService.errorMessage(error);
  //   });
  // }

  async getSMTPConfiguration() {
    await this.loading.present();
    this.configurationService.gSMSConfiguration('/Messages/SMTP/Configuration').subscribe(async (result: any) => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      
      this.configurationData = convResult;
      this.configurationForm.reset();

      this.configurationForm.get('host').setValue(this.configurationData.host);
      this.configurationForm.get('port').setValue(this.configurationData.port);
      this.configurationForm.get('password').setValue(this.configurationData.password);
      this.configurationForm.get('username').setValue(this.configurationData.username);
      this.configurationForm.get('useSslTls').setValue(this.configurationData.usessltls);
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  getUpdateAvailable() {
    let disable = true;
    if (this.configurationData) {
      for (var key in this.configurationForm.controls) {
        if (this.configurationForm.get(key).value !== this.configurationData[key.toLowerCase()]) {
          disable = false;
        }
      }
    }

    return disable;
  }

  // async updateConfiguration() {
  //   if (this.configurationForm.valid) {
  //     await this.loading.present();
  //     let reqParam = {
  //       // Id: this.configurationData.id,
  //       Host: this.configurationForm.get('host').value,
  //       Port: this.configurationForm.get('port').value,
  //       Password: this.configurationForm.get('password').value,
  //       Username: this.configurationForm.get('username').value,
  //       UseSslTls: this.configurationForm.get('useSslTls').value,
  //     };

  //     const reqBody = {
  //       OperationId: '/Messages/SMTP/Configuration#put',
  //       Parameters: [],
  //       RequestBody: this.globService.convertRequestBody(reqParam)
  //     }
  //     this.globService.operationAPIService(reqBody).subscribe(async (result: any) => {
  //       await this.loading.dismiss();

  //       if (this.configurationData) {
  //         for (var key in this.configurationForm.controls) {
  //           this.configurationData[key.toLowerCase()] = this.configurationForm.get(key).value;
  //         }
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
      let reqParam = {
        // Id: this.configurationData.id,
        Host: this.configurationForm.get('host').value,
        Port: this.configurationForm.get('port').value,
        Password: this.configurationForm.get('password').value,
        Username: this.configurationForm.get('username').value,
        UseSslTls: this.configurationForm.get('useSslTls').value,
      };

      this.configurationService.uSMSConfiguration(this.globService.convertRequestBody(reqParam), '/Messages/SMTP/Configuration').subscribe(async (result: any) => {
        await this.loading.dismiss();

        if (this.configurationData) {
          for (var key in this.configurationForm.controls) {
            this.configurationData[key] = this.configurationForm.get(key).value;
          }
        }
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
    this.SmptConfigurationComponent.emit('close');
  }

  get f() {
    return this.configurationForm.controls;
  }

}
