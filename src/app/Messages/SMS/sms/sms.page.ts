import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { LoadingService, ToastService, TranService } from 'src/services';
import { SMSService } from './services/sms.service';

import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-sms',
  templateUrl: './sms.page.html',
  styleUrls: ['./sms.page.scss'],
})
export class SmsPage implements OnInit {


  @Input() ContactNumber: string = '';
  @Input() pageTitle: string = '';
  @Output('setComponentValue') public componentValue: EventEmitter<string> = new EventEmitter<string>();

  
  smsGroup: UntypedFormGroup;

  phoneType: string = '';

  phoneList: any[] = [];


  constructor(
    private smsService: SMSService,
    private loading: LoadingService,
    private toast: ToastService,
    private tranService: TranService,
    
    private fromBuilder: UntypedFormBuilder,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    
    this.smsGroup = this.fromBuilder.group({
      phoneType: ['', Validators.required],
      'phoneNumber': ['', Validators.required],
      'smsBody': ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  selectPhoneType(value) {
    this.phoneType = value;
    if (this.phoneType === 'exist') {
      this.getPhoneNumberList();
      this.smsGroup.get('phoneNumber').reset();
    } else if (this.phoneType === 'new') {
      this.smsGroup.get('phoneNumber').reset();
    }
  }

  async getPhoneNumberList() {
    await this.loading.present();
    this.phoneList = [];
    this.smsService.getPhoneList(this.ContactNumber).subscribe(async (result: any) => {
      await this.loading.dismiss();
      
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.phoneList = convResult.contactphoneusages;
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  smsSend() {
    if (this.smsGroup.valid) {
      const smsData = {
        'phoneNumber': this.smsGroup.controls.phoneNumber.value,
        'smsBody': this.smsGroup.controls.smsBody.value
      };
      this.smsService.smsSend(smsData).subscribe((result: any) => {
        
        this.componentValue.emit('service_desk');
      }, (error: any) => {
        
        this.tranService.errorMessage(error);
      })
    }
  }

  triggerSubmit() {
    this.smsSend();
  }

}
