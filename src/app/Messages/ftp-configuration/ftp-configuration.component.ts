import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { FTPConfigurationService } from './services/ftp-configuration.service';

@Component({
  selector: 'app-ftp-configuration',
  templateUrl: './ftp-configuration.component.html',
  styleUrls: ['./ftp-configuration.component.scss'],
})
export class FtpConfigurationComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Output('FtpConfigurationComponent') FtpConfigurationComponent: EventEmitter<string> = new EventEmitter<string>();

  

  configurationForm: UntypedFormGroup;

  configurationData: any;

  selList: any[] = [
    { id: true, name: 'yes' },
    { id: false, name: 'no' },
  ]

  constructor(
    private configurationService: FTPConfigurationService,
    private loading: LoadingService,
    private tranService: TranService,
    
    private fromBuilder: UntypedFormBuilder,
    public globService: GlobalService,
  ) {
    
    this.configurationForm = this.fromBuilder.group({
      host: ['', Validators.required],
      port: ['', Validators.required],
      password: ['',],
      userid: ['',],
    });
  }

  ngOnInit() {
    this.getFTPConfiguration();
  }

  // async getFTPConfiguration() {
  //   await this.loading.present();

  //   const reqBody = {
  //     'OperationId': '/Reports/FTP/Configuration#get'
  //   }

  //   this.globService.operationAPIService(reqBody).subscribe(async (result: any) => {
  //     await this.loading.dismiss();
  //     const convResult = this.globService.ConvertKeysToLowerCase(JSON.parse(result));
      
  //     this.configurationData = convResult;
  //     this.configurationForm.reset();

  //     this.configurationForm.get('host').setValue(this.configurationData.host);
  //     this.configurationForm.get('port').setValue(this.configurationData.port);
  //     this.configurationForm.get('password').setValue(this.configurationData.password);
  //     this.configurationForm.get('userid').setValue(this.configurationData.userid);
  //   }, async (error: any) => {
  //     await this.loading.dismiss();
  //     this.tranService.errorMessage(error);
  //   });
  // }

  async getFTPConfiguration() {
    await this.loading.present();
    this.configurationService.gFTPConfiguration('/Reports/FTP/Configuration').subscribe(async (result: any) => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      
      this.configurationData = convResult;
      this.configurationForm.reset();

      this.configurationForm.get('host').setValue(this.configurationData.host);
      this.configurationForm.get('port').setValue(this.configurationData.port);
      this.configurationForm.get('password').setValue(this.configurationData.password);
      this.configurationForm.get('userid').setValue(this.configurationData.userid);
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
  //       UserId: this.configurationForm.get('userid').value,
  //     };

  //     const reqBody = {
  //       OperationId: '/Reports/FTP/Configuration#put',
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
        UserId: this.configurationForm.get('userid').value,
      };


      this.configurationService.uFTPConfiguration(this.globService.convertRequestBody(reqParam), '/Reports/FTP/Configuration').subscribe(async (result: any) => {
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
    this.FtpConfigurationComponent.emit('close');
  }

  get f() {
    return this.configurationForm.controls;
  }

}
