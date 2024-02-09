import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { SMSConfigurationService } from './services/sms-configuration.service';

@Component({
  selector: 'app-sms-configuration',
  templateUrl: './sms-configuration.component.html',
  styleUrls: ['./sms-configuration.component.scss'],
})
export class SmsConfigurationComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Output('EmailConfigurationComponent') EmailConfigurationComponent: EventEmitter<string> = new EventEmitter<string>();

  

  configurationForm: UntypedFormGroup;

  configurationData: any;

  selList: any[] = [
    { id: true, name: 'yes' },
    { id: false, name: 'no' },
  ]

  constructor(
    private configurationService: SMSConfigurationService,
    private loading: LoadingService,
    private tranService: TranService,
    
    private fromBuilder: UntypedFormBuilder,
    public globService: GlobalService,
  ) {
    
    this.configurationForm = this.fromBuilder.group({
      maximumMessageLength: ['', [Validators.required, Validators.pattern('[1-9]+[0-9]{0,}')]],
      templates: ['', Validators.required],
      dueDate: ['', Validators.required],
      maximumScheduleDays: ['', [Validators.required, Validators.pattern('[1-9]+[0-9]{0,}')]],
      deliveryConfirmation: ['', Validators.required],
      msisdnFormat: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getSMSConfiguration();
  }

  // async getSMSConfiguration() {
  //   await this.loading.present();

  //   const reqBody = {
  //     'OperationId': '/Messages/SMSs/Configuration#get'
  //   }

  //   this.globService.operationAPIService(reqBody).subscribe(async (result: any) => {
  //     await this.loading.dismiss();
  //     const convResult = this.globService.ConvertKeysToLowerCase(JSON.parse(result));
      
  //     this.configurationData = convResult;
  //     this.configurationForm.reset();

  //     this.configurationForm.get('maximumMessageLength').setValue(this.configurationData.maximummessagelength);
  //     this.configurationForm.get('templates').setValue(this.configurationData.templates);
  //     this.configurationForm.get('dueDate').setValue(this.configurationData.duedate);
  //     this.calcMaxScheduleDays();
  //     if (this.configurationData.duedate) {
  //       this.configurationForm.get('maximumScheduleDays').setValue(this.configurationData.maximumscheduledays);
  //     }
  //     this.configurationForm.get('deliveryConfirmation').setValue(this.configurationData.deliveryconfirmation);
  //     this.configurationForm.get('msisdnFormat').setValue(this.configurationData.msisdnformat);
  //   }, async (error: any) => {
  //     await this.loading.dismiss();
  //     this.tranService.errorMessage(error);
  //   });
  // }

  async getSMSConfiguration() {
    await this.loading.present();
    this.configurationService.gSMSConfiguration('/Messages/SMSs/Configuration').subscribe(async (result: any) => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      
      this.configurationData = convResult;
      this.configurationForm.reset();

      this.configurationForm.get('maximumMessageLength').setValue(this.configurationData.maximummessagelength);
      this.configurationForm.get('templates').setValue(this.configurationData.templates);
      this.configurationForm.get('dueDate').setValue(this.configurationData.duedate);
      this.calcMaxScheduleDays();
      if (this.configurationData.duedate) {
        this.configurationForm.get('maximumScheduleDays').setValue(this.configurationData.maximumscheduledays);
      }
      this.configurationForm.get('deliveryConfirmation').setValue(this.configurationData.deliveryconfirmation);
      this.configurationForm.get('msisdnFormat').setValue(this.configurationData.msisdnformat);
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

  calcMaxScheduleDays() {
    if (this.configurationForm.get('dueDate').value) {
      this.configurationForm.addControl('maximumScheduleDays', new UntypedFormControl('', Validators.required));
      return true;
    } else {
      this.configurationForm.removeControl('maximumScheduleDays');
      return false;
    }
  }

  // async updateConfiguration() {
  //   if (this.configurationForm.valid) {
  //     await this.loading.present();
  //     let reqParam = {
  //       // Id: this.configurationData.id,
  //       MaximumMessageLength: parseFloat(this.configurationForm.get('maximumMessageLength').value),
  //       Templates: this.configurationForm.get('templates').value,
  //       DueDate: this.configurationForm.get('dueDate').value,
  //       DeliveryConfirmation: this.configurationForm.get('deliveryConfirmation').value,
  //       MSISDNFormat: this.configurationForm.get('msisdnFormat').value,
  //     };

  //     if (reqParam.DueDate) {
  //       reqParam['MaximumScheduleDays'] = parseFloat(this.configurationForm.get('maximumScheduleDays').value);
  //     }

  //     const reqBody = {
  //       OperationId: '/Messages/SMSs/Configuration#put',
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
        MaximumMessageLength: parseFloat(this.configurationForm.get('maximumMessageLength').value),
        Templates: this.configurationForm.get('templates').value,
        DueDate: this.configurationForm.get('dueDate').value,
        DeliveryConfirmation: this.configurationForm.get('deliveryConfirmation').value,
        MSISDNFormat: this.configurationForm.get('msisdnFormat').value,
      };

      if (reqParam.DueDate) {
        reqParam['MaximumScheduleDays'] = parseFloat(this.configurationForm.get('maximumScheduleDays').value);
      }

      this.configurationService.uSMSConfiguration(this.globService.convertRequestBody(reqParam), '/Messages/SMSs/Configuration').subscribe(async (result: any) => {
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
    this.EmailConfigurationComponent.emit('close');
  }

  get f() {
    return this.configurationForm.controls;
  }

}
