import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipList } from '@angular/material/chips';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { SMSSendService } from './services/sms-send-service';

@Component({
  selector: 'app-sms-send',
  templateUrl: './sms-send.component.html',
  styleUrls: ['./sms-send.component.scss'],
})
export class SmsSendComponent implements OnInit {


  @Input() ContactNumber: string = '';
  @Output('SMSSendComponent') public SmsSendComponent: EventEmitter<string> = new EventEmitter<string>();

  
  smsGroup: UntypedFormGroup;

  phoneType: string = '';

  phoneList: any[] = [];
  templatelist: any[] = [
  ];
  seletedPhoneList: any[] = [];

  filteredPhone: any[] = [];

  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA, 190];

  @ViewChild('phoneNumber') phoneNumber: ElementRef<HTMLInputElement>;
  @ViewChild('chipList') chipList: MatChipList;

  chipState: string = '';
  templateState: boolean = false;
  smsConfiguration: any = {};
  minDate: any = new Date();
  maxDate: any;

  constructor(
    private smsService: SMSSendService,
    private loading: LoadingService,
    private tranService: TranService,
    
    private fromBuilder: UntypedFormBuilder,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    
    this.smsGroup = this.fromBuilder.group({
      'phoneNumber': [''],
      'template': [''],
      'smsBody': ['', Validators.required],
      'dueDate': ['', Validators.required]
    });

    this.smsGroup.get('dueDate').setValue(new Date());
  }

  ngOnInit() {
    this.getTemplateList();
    this.getPhoneNumberList();
    this.getSMSConfiguration();

    this.smsGroup.get('phoneNumber').valueChanges.subscribe((result: any) => {
      this.filteredPhone = this.filter(result, this.phoneList);
      this.getChipValid();
    });
  }

  // getSMSConfiguration() {

  //   const reqBody = {
  //     'OperationId': '/Messages/SMSs/Configuration#get'
  //   }

  //   this.globService.operationAPIService(reqBody).subscribe(async (result: any) => {
      
  //     const convResult = this.globService.ConvertKeysToLowerCase(JSON.parse(result));
  //     this.smsConfiguration = convResult;
  //     if (this.smsConfiguration.maximumscheduledays) {
  //       this.maxDate = new Date();
  //       this.maxDate.setDate(this.maxDate.getDate() + this.smsConfiguration.maximumscheduledays)
  //     }
  //   }, async (error: any) => {
  //     this.tranService.errorMessage(error);
  //   })
  // }

  getSMSConfiguration() {
    this.smsService.gSMSConfiguration('/Messages/SMSs/Configuration').subscribe(async (result: any) => {
      
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.smsConfiguration = convResult;
      if (this.smsConfiguration.maximumscheduledays) {
        this.maxDate = new Date();
        this.maxDate.setDate(this.maxDate.getDate() + this.smsConfiguration.maximumscheduledays)
      }
    }, async (error: any) => {
      this.tranService.errorMessage(error);
    })
  }

  getChipValid() {
    if (this.seletedPhoneList.length === 0) {
      this.chipList.errorState = true;
    } else {
      this.chipList.errorState = false;
      this.chipState = 'required';
    }
  }

  get f() {
    return this.smsGroup.controls;
  }

  filter(value: string, list): any[] {
    if (value !== null && typeof (value) !== 'undefined') {
      const filterValue = value.toLowerCase();
      return list.filter(option => option.msisdn.toLowerCase().includes(filterValue));
    } else {
      return [];
    }
  }


  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.seletedPhoneList.push(value);
    }

    this.smsGroup.get('phoneNumber').setValue(null);

    // Reset the input value
    if (input) {
      input.value = '';
    }
    this.filteredPhone = this.filter('', this.phoneList);
  }

  remove(fruit: string): void {
    const index = this.seletedPhoneList.indexOf(fruit);

    if (index >= 0) {
      this.seletedPhoneList.splice(index, 1);
    }
    this.getChipValid();
    this.filteredPhone = this.filter('', this.phoneList);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.seletedPhoneList.push(event.option.viewValue);
    this.phoneNumber.nativeElement.value = '';
    this.smsGroup.get('phoneNumber').setValue(null);
    this.filteredPhone = this.filter('', this.phoneList);
  }

  addTemplate(event) {
    this.templateState = event.checked;
  }

  async getTemplateList() {
    await this.loading.present();
    this.smsService.getTemplateList().subscribe(async (result: any) => {
      await this.loading.dismiss();
      
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      for (let list of convResult) {
        const temp = {
          name: list.name, value: list.id
        };
        this.templatelist.push(temp);
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    })
  }

  async selectTemplate(index) {
    await this.loading.present();
    this.smsService.getTemplateDetail(this.templatelist[index].value, this.ContactNumber).subscribe(async (result: any) => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.smsGroup.get('smsBody').setValue(convResult[0].text);
    })
  }

  async getPhoneNumberList() {
    await this.loading.present();
    this.phoneList = [];
    this.smsService.getPhoneList(this.ContactNumber).subscribe(async (result: any) => {
      await this.loading.dismiss();
      
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.phoneList = convResult;
      this.filteredPhone = this.filter('', this.phoneList);
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  smsSend() {
    if (this.smsGroup.valid) {
      const smsData = {
        "Recipient": this.seletedPhoneList,
        "Text": this.smsGroup.get('smsBody').value,
        "RequestDeliveryReceipt": false,
        "Schedule": this.smsGroup.get('dueDate').value,
        "NewConversationId": false,
        "ConversationId": "AEFVDD"
      };
      this.smsService.smsSend(this.globService.convertRequestBody(smsData), this.ContactNumber).subscribe((result: any) => {
        
        this.SmsSendComponent.emit('sms_list');
      }, (error: any) => {
        
        this.tranService.errorMessage(error);
      })
    }
  }

  triggerSubmit() {
    this.smsSend();
  }

  goBack() {
    this.SmsSendComponent.emit('sms_list');
  }

}
