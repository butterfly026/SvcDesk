import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { EmailConfigurationService } from './services/email-configuration.service';

@Component({
  selector: 'app-email-configuration',
  templateUrl: './email-configuration.component.html',
  styleUrls: ['./email-configuration.component.scss'],
})
export class EmailConfigurationComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Output('EmailConfigurationComponent') EmailConfigurationComponent: EventEmitter<string> = new EventEmitter<string>();



  configurationForm: UntypedFormGroup;

  configurationData: any;

  selList: any[] = [
    { id: true, name: 'yes' },
    { id: false, name: 'no' },
  ]

  constructor(
    private configurationService: EmailConfigurationService,
    private loading: LoadingService,
    private tranService: TranService,

    private fromBuilder: UntypedFormBuilder,
    public globService: GlobalService,
  ) {

    this.configurationForm = this.fromBuilder.group({
      cc: ['', Validators.required],
      bcc: ['', Validators.required],
      externalAttachments: ['', Validators.required],
      attachments: ['', Validators.required],
      templates: ['', Validators.required],
      dueDate: ['', Validators.required],
      maximumScheduleDays: ['', Validators.required],
      deliveryConfirmation: ['', Validators.required],
      emailFormat: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getEmailConfigurations();
  }

  // async getEmailConfigurations() {
  //   await this.loading.present();

  //   const reqBody = {
  //     'OperationId': '/Messages/Email/Configuration#get'
  //   }

  //   this.globService.operationAPIService(reqBody).subscribe(async (result: any) => {
  //     await this.loading.dismiss();
  //     const convResult = this.globService.ConvertKeysToLowerCase(JSON.parse(result));
  //     this.configurationData = convResult;

  //     this.configurationForm.reset();

  //     this.configurationForm.get('cc').setValue(this.configurationData.cc);
  //     this.configurationForm.get('bcc').setValue(this.configurationData.bcc);
  //     this.configurationForm.get('externalAttachments').setValue(this.configurationData.externalattachments);
  //     this.configurationForm.get('attachments').setValue(this.configurationData.attachments);
  //     this.configurationForm.get('templates').setValue(this.configurationData.templates);
  //     this.configurationForm.get('dueDate').setValue(this.configurationData.duedate);
  //     this.calcMaxScheduleDays();
  //     if (this.configurationData.duedate) {
  //       this.configurationForm.get('maximumScheduleDays').setValue(this.configurationData.maximumscheduledays);
  //     }
  //     this.configurationForm.get('deliveryConfirmation').setValue(this.configurationData.deliveryconfirmation);
  //     this.configurationForm.get('emailFormat').setValue(this.configurationData.emailformat);

  //   }, async error => {
  //     await this.loading.dismiss();
  //     this.tranService.errorMessage(error);
  //   });
  // }

  async getEmailConfigurations() {
    await this.loading.present();

    this.configurationService.emailConfiguration('/Messages/Emails/Configuration').subscribe(async (result: any) => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.configurationData = convResult;

      this.configurationForm.reset();

      this.configurationForm.get('cc').setValue(this.configurationData.cc);
      this.configurationForm.get('bcc').setValue(this.configurationData.bcc);
      this.configurationForm.get('externalAttachments').setValue(this.configurationData.externalattachments);
      this.configurationForm.get('attachments').setValue(this.configurationData.attachments);
      this.configurationForm.get('templates').setValue(this.configurationData.templates);
      this.configurationForm.get('dueDate').setValue(this.configurationData.duedate);
      this.calcMaxScheduleDays();
      if (this.configurationData.duedate) {
        this.configurationForm.get('maximumScheduleDays').setValue(this.configurationData.maximumscheduledays);
      }
      this.configurationForm.get('deliveryConfirmation').setValue(this.configurationData.deliveryconfirmation);
      this.configurationForm.get('emailFormat').setValue(this.configurationData.emailformat);

    }, async error => {
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
  //     let reqbody = {
  //       Id: this.configurationData.id,
  //       CC: this.configurationForm.get('cc').value,
  //       BCC: this.configurationForm.get('bcc').value,
  //       ExternalAttachments: this.configurationForm.get('externalAttachments').value,
  //       Attachments: this.configurationForm.get('attachments').value,
  //       Templates: this.configurationForm.get('templates').value,
  //       DueDate: this.configurationForm.get('dueDate').value,
  //       DeliveryConfirmation: this.configurationForm.get('deliveryConfirmation').value,
  //       EmailFormat: this.configurationForm.get('emailFormat').value
  //     };

  //     if (reqbody.DueDate) {
  //       reqbody['MaximumScheduleDays'] = parseFloat(this.configurationForm.get('maximumScheduleDays').value);
  //     }
  //     const reqData = {
  //       OperationId: '/Messages/Email/Configuration#put',
  //       Parameters: [],
  //       RequestBody: this.globService.convertRequestBody(reqbody)
  //     }
  //     this.globService.operationAPIService(reqData).subscribe(async (result: any) => {
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
      let reqbody = {
        Id: this.configurationData.id,
        CC: this.configurationForm.get('cc').value,
        BCC: this.configurationForm.get('bcc').value,
        ExternalAttachments: this.configurationForm.get('externalAttachments').value,
        Attachments: this.configurationForm.get('attachments').value,
        Templates: this.configurationForm.get('templates').value,
        DueDate: this.configurationForm.get('dueDate').value,
        DeliveryConfirmation: this.configurationForm.get('deliveryConfirmation').value,
        EmailFormat: this.configurationForm.get('emailFormat').value
      };

      if (reqbody.DueDate) {
        reqbody['MaximumScheduleDays'] = parseFloat(this.configurationForm.get('maximumScheduleDays').value);
      }

      this.configurationService.uEmailConfiguration(this.globService.convertRequestBody(reqbody), '/Messages/Emails/Configuration').subscribe(async (result: any) => {
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

}
