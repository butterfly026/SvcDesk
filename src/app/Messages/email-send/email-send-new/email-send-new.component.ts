import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { MatChipInputEvent, MatChipList } from '@angular/material/chips';
import { ModalController } from '@ionic/angular';
import { jqxEditorComponent } from 'jqwidgets-ng/jqxeditor';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { EmailSendNewService } from './services/email-send-new-service';

@Component({
  selector: 'app-email-send-new',
  templateUrl: './email-send-new.component.html',
  styleUrls: ['./email-send-new.component.scss'],
})
export class EmailSendNewComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Input() DocLists: any[] = [];
  @Input() EmailType: string = '';
  @Input() BillId: string = '';
  @Input() BillNumber: string = '';
  @Output('EmailSendNewComponent') EmailSendNewComponent: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('emailBody') emailBody: jqxEditorComponent;

  @ViewChild('createFile') createFile: ElementRef;
  @ViewChild('toInput') toInput: ElementRef<HTMLInputElement>;
  @ViewChild('ccInput') ccInput: ElementRef<HTMLInputElement>;
  @ViewChild('bccInput') bccInput: ElementRef<HTMLInputElement>;
  @ViewChild('chipListTo') chipListTo: MatChipList;
  @ViewChild('chipListCc') chipListCc: MatChipList;
  @ViewChild('chipListBcc') chipListBcc: MatChipList;

  
  emailGroup: UntypedFormGroup;

  phoneType: string = '';

  filterToList: any[] = [];
  filterCcList: any[] = [];
  filterBccList: any[] = [];

  emailList: any[] = [];
  templatelist: any[] = []
  createDoc: any = [];;
  existDocList = [];

  visible = true;
  selectable = true;
  removable = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  toList: any[] = [];
  ccList: any[] = [];
  bccList: any[] = [];

  chipStateTo: string = '';
  chipStateCc: string = '';
  chipStateBcc: string = '';

  templateState: boolean = false;
  emailConfiguration: any = {};
  minDate: any = new Date();
  maxDate: any;

  constructor(
    private emailService: EmailSendNewService,
    private loading: LoadingService,
    private tranService: TranService,
    
    private fromBuilder: UntypedFormBuilder,
    public globService: GlobalService,
    private modalCtrl: ModalController,
  ) {
    this.tranService.translaterService();
    
    this.emailGroup = this.fromBuilder.group({
      'toInput': [''],
      'ccInput': [''],
      'bccInput': [''],
      'subject': ['', Validators.required],
      'existingDocs': [''],
      'attachmentNew': [''],
      'body': [''],
      'template': [''],
      'dueDate': [''],
    });

    this.emailGroup.get('toInput').valueChanges.subscribe((result: any) => {
      
      this.filterToList = result ? this._filter(result.toString()) : this.emailList.slice();
    });

    this.emailGroup.get('ccInput').valueChanges.subscribe((result: any) => {
      this.filterCcList = result ? this._filter(result.toString()) : this.emailList.slice();
    });

    this.emailGroup.get('bccInput').valueChanges.subscribe((result: any) => {
      this.filterBccList = result ? this._filter(result.toString()) : this.emailList.slice();
    });
  }

  ngOnInit() {
    this.getEmailLists();
    this.getTemplateList();
    this.getEmailConfiguration();
    if (this.EmailType === 'billEmail') {
      if (this.DocLists.length > 0) {
        this.existDocList = [];
        let formValue = [];
        for (let list of this.DocLists) {
          const temp = {
            id: list.id,
            name: this.ContactCode + '-' + list.id,
            type: list.type,
          }
          this.existDocList.push(temp);
          formValue.push(list.id);
        }
        this.emailGroup.get('subject').setValue('Bill');
        this.emailGroup.removeControl('attachmentNew');
        this.emailGroup.get('existingDocs').setValue(formValue);
        this.emailGroup.get('existingDocs').disable();
      } else {
        this.emailGroup.get('subject').setValue('Bill');
        this.emailGroup.removeControl('attachmentNew');
        this.emailGroup.removeControl('existingDocs');
      }
    } else {
      this.getAvailableDocuments();
    }
  }

  getChipValid(value) {
    switch (value) {
      case 'to':
        if (this.toList.length === 0) {
          this.chipListTo.errorState = true;
          this.chipStateTo = 'required';
        } else {
          this.chipListTo.errorState = false;
          this.chipStateTo = '';
          for (let list of this.toList) {
            let tempCtrl = new UntypedFormControl('', Validators.email);
            tempCtrl.setValue(list.email);
            if (!tempCtrl.valid) {
              this.chipListTo.errorState = true;
              this.chipStateTo = 'invalid';
            }
          }
        }
        break;
      case 'cc':
        if (this.ccList.length === 0) {
        } else {
          this.chipListCc.errorState = false;
          this.chipStateCc = '';
          for (let list of this.ccList) {
            let tempCtrl = new UntypedFormControl('', Validators.email);
            tempCtrl.setValue(list.email);
            if (!tempCtrl.valid) {
              this.chipListCc.errorState = true;
              this.chipStateCc = 'invalid';
            }
          }
        }
        break;
      case 'bcc':
        if (this.bccList.length === 0) {
        } else {
          this.chipListBcc.errorState = false;
          this.chipStateBcc = '';
          for (let list of this.bccList) {
            let tempCtrl = new UntypedFormControl('', Validators.email);
            tempCtrl.setValue(list.email);
            if (!tempCtrl.valid) {
              this.chipListBcc.errorState = true;
              this.chipStateBcc = 'invalid';
            }
          }
        }
        break;

      default:
        break;
    }
  }

  addTemplate(event) {
    this.templateState = event.checked;
  }

  // async getEmailLists() {
  //   const reqBody = {
  //     OperationId: '/Bills/Emails/Addresses/BillId/{BillId}#get',
  //     Parameters: [
  //       {
  //         Type: 'path',
  //         Name: 'BillId',
  //         Value: this.BillId.toString()
  //       }
  //     ]
  //   }
  //   try {
  //     let result = await this.globService.operationAPIService(reqBody).toPromise();
  //     const convResult = this.globService.ConvertKeysToLowerCase(JSON.parse(result));
  //     for (let list of convResult) {
  //       const temp = {
  //         email: list.address,
  //         id: list.address,
  //       }
  //       this.emailList.push(temp);
  //       this.filterToList.push(temp);
  //       this.filterCcList.push(temp);
  //       this.filterBccList.push(temp);
  //     }
  //   } catch (error) {
      
  //   }
  // }

  async getEmailLists() {

    console.log('HERE', this.BillId);

    try {
      let result = await this.emailService.getEmailLists(this.BillId.toString(), '/Bills/Emails/Addresses/BillId/').toPromise();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      for (let list of convResult) {
        const temp = {
          email: list.address,
          id: list.address,
        }
        this.emailList.push(temp);
        this.filterToList.push(temp);
        this.filterCcList.push(temp);
        this.filterBccList.push(temp);
      }
    } catch (error) {
      
    }
  }

  // getEmailConfiguration() {

  //   const reqBody = {
  //     'OperationId': '/Messages/Email/Configuration#get'
  //   }

  //   this.globService.operationAPIService(reqBody).subscribe((result: any) => {
  //     this.emailConfiguration = this.globService.ConvertKeysToLowerCase(JSON.parse(result));
  //     if (this.emailConfiguration && this.emailConfiguration.maximumscheduledays) {
  //       this.maxDate = new Date();
  //       this.maxDate.setDate(this.maxDate.getDate() + this.emailConfiguration.maximumscheduledays)
  //     }
  //   }, (error: any) => {
  //     this.tranService.errorMessage(error);
  //   })
  // }

  getEmailConfiguration() {
    this.emailService.gEmailConfiguration('/Messages/Email/Configuration').subscribe((result: any) => {
      this.emailConfiguration = this.globService.ConvertKeysToLowerCase(result);
      if (this.emailConfiguration && this.emailConfiguration.maximumscheduledays) {
        this.maxDate = new Date();
        this.maxDate.setDate(this.maxDate.getDate() + this.emailConfiguration.maximumscheduledays)
      }
    }, (error: any) => {
      this.tranService.errorMessage(error);
    })
  }

  getAvailableDocuments() {
    this.emailService.getAvailableDocuments(this.ContactCode).subscribe((result: any) => {
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.existDocList = convResult.list;
    }, (error: any) => {
      this.tranService.errorMessage(error);
    })
  }

  validateFruits(to: UntypedFormControl) {
    if (to.value && to.value.length === 0) {
      return {
        validateFruitsArray: { valid: false }
      };
    }

    return null;
  }

  add(event: MatChipInputEvent, type: string): void {
    const input = event.input;
    const value = event.value;
    let tempCtrl = new UntypedFormControl('', Validators.email);
    tempCtrl.setValue(value);
    if ((value || '').trim()) {
      switch (type) {
        case 'to':
          if (tempCtrl.valid) {
            this.toList.push({ email: value.trim(), color: '', id: null });
          } else {
            this.toList.push({ email: value.trim(), color: 'warn', id: null });
          }
          this.getChipValid('to');
          break;
        case 'cc':
          if (tempCtrl.valid) {
            this.ccList.push({ email: value.trim(), color: '', id: null });
          } else {
            this.ccList.push({ email: value.trim(), color: 'warn', id: null });
          }
          this.getChipValid('cc');
          break;
        case 'bcc':
          if (tempCtrl.valid) {
            this.bccList.push({ email: value.trim(), color: '', id: null });
          } else {
            this.bccList.push({ email: value.trim(), color: 'warn', id: null });
          }
          this.getChipValid('bcc');
          break;
        default:
          break;
      }
    }

    if (input) {
      input.value = '';
    }
  }

  remove(index: number, type: string): void {
    switch (type) {
      case 'to':
        this.toList.splice(index, 1);
        this.getChipValid('to');
        break;
      case 'cc':
        this.ccList.splice(index, 1);
        this.getChipValid('cc');
        break;
      case 'bcc':
        this.bccList.splice(index, 1);
        this.getChipValid('bcc');
        break;
      default:
        break;
    }
  }

  selected(event, type: string) {
    let tempCtrl = new UntypedFormControl('', Validators.email);
    switch (type) {
      case 'to':
        if (tempCtrl.valid) {
          this.toList.push({ email: event.option.viewValue, color: '', id: this.getEmailId(event.option.viewValue) });
        } else {
          this.toList.push({ email: event.option.viewValue, color: '', id: this.getEmailId(event.option.viewValue) });
        }
        this.toInput.nativeElement.value = '';
        this.emailGroup.get('toInput').setValue(null);
        break;
      case 'cc':
        if (tempCtrl.valid) {
          this.ccList.push({ email: event.option.viewValue, color: '', id: this.getEmailId(event.option.viewValue) });
        } else {
          this.ccList.push({ email: event.option.viewValue, color: '', id: this.getEmailId(event.option.viewValue) });
        }
        this.ccInput.nativeElement.value = '';
        this.emailGroup.get('ccInput').setValue(null);
        break;
      case 'bcc':
        if (tempCtrl.valid) {
          this.bccList.push({ email: event.option.viewValue, color: '', id: this.getEmailId(event.option.viewValue) });
        } else {
          this.bccList.push({ email: event.option.viewValue, color: '', id: this.getEmailId(event.option.viewValue) });
        }
        this.bccInput.nativeElement.value = '';
        this.emailGroup.get('bccInput').setValue(null);
        break;
      default:
        break;
    }
  }

  // addOnBlurTo(event: FocusEvent, type: string) {
  //   const target: HTMLElement = event.relatedTarget as HTMLElement;
  //   if (!target || target.tagName !== 'MAT-OPTION') {
  //     let matChipEvent: MatChipInputEvent;
  //     switch (type) {
  //       case 'to':
  //         matChipEvent = { input: this.toInput.nativeElement, value: this.toInput.nativeElement.value };
  //         this.add(matChipEvent, 'to');
  //         break;
  //       case 'cc':
  //         matChipEvent = { input: this.ccInput.nativeElement, value: this.ccInput.nativeElement.value };
  //         this.add(matChipEvent, 'cc');
  //         break;
  //       case 'bcc':
  //         matChipEvent = { input: this.bccInput.nativeElement, value: this.bccInput.nativeElement.value };
  //         this.add(matChipEvent, 'bcc');
  //         break;

  //       default:
  //         break;
  //     }
  //   }
  // }

  addOnBlurTo(event: MatChipInputEvent, type: string) {
  if(event&& (type !='' && type !=null && type!=undefined))
          this.add(event, type);      
  }

  getEmailId(value) {
    let emailId = null;
    for (let list of this.emailList) {
      if (list.email === value) {
        emailId = list.id;
      }
    }
    return emailId;
  }

  private _filter(value: string): string[] {
    if (value !== null && value !== '') {
      const filterValue = value.toLowerCase();

      return this.emailList.filter(item => item.email.toLowerCase().indexOf(filterValue) === 0);
    }
  }

  async getTemplateList() {
    await this.loading.present();
    this.emailService.getTemplateList().subscribe(async (result: any) => {
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

  get f() {
    return this.emailGroup.controls;
  }

  async selectTemplate(index) {
    await this.loading.present();
    this.emailService.getTemplateDetail(this.templatelist[index].value, this.ContactCode).subscribe(async (result: any) => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.emailGroup.get('body').setValue(convResult[0].text);
    })
  }

  getFormValidate() {
    if (this.emailGroup.valid && this.toList.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  async emailSend() {
    if (this.emailGroup.valid) {
      const emailData = {
        Id: null,
        Scheduled: new Date().toISOString(),
        Recipients: [],
        Subject: this.emailGroup.get('subject').value,
        Body: this.emailBody.val(),
        BodyFormat: 'Plain',
        AttachementsExisting: [],
        AttachementsNew: [],
        Importance: 'Medium',
        NewConversationId: false,
        ConversationId: 'AEFVDD',
      };
      for (let list of this.toList) {
        const tempRecipient = {
          Id: list.id,
          Address: list.email,
          RequestDeliveryReceipt: false
        }
        emailData.Recipients.push(tempRecipient);
      }
      for (let list of this.ccList) {
        const tempRecipient = {
          Id: list.id,
          Address: list.email,
          RequestDeliveryReceipt: false
        }
        emailData.Recipients.push(tempRecipient);
      }
      for (let list of this.bccList) {
        const tempRecipient = {
          Id: list.id,
          Address: list.email,
          RequestDeliveryReceipt: false
        }
        emailData.Recipients.push(tempRecipient);
      }

      if (this.EmailType === 'billEmail') {
        const reqParam = {
          Recipients: [
          ],
          Subject: this.emailGroup.get('subject').value,
          Body: this.emailBody.val(),
          BodyFormat: 'TEXT',
          BillId: 123213,
          Importance: 'MEDIUM',
          AttachPDF: true,
          AttachXLS: false,
          Images: []
        }
        for (let list of this.toList) {
          const tempRecipient = {
            Id: list.id,
            Address: list.email,
            RequestDeliveryReceipt: false
          }
          reqParam.Recipients.push(tempRecipient);
        }

        // const reqBody = {
        //   OperationId: '/Bills/{BillId}/Email#post',
        //   Parameters: [
        //     {
        //       Type: 'path',
        //       Name: 'BillId',
        //       Value: this.BillId.toString()
        //     }
        //   ],
        //   RequestBody: reqParam
        // }

        // await this.loading.present();
        // try {
        //   const result = await this.globService.operationAPIService(reqBody).toPromise();

        //   
        // } catch (error) {
        //   
        //   this.tranService.errorMessage(error);
        // }
        // await this.loading.dismiss();

        this.emailService.emailSend(this.globService.convertRequestBody(reqParam), this.BillId).subscribe((result: any) => {
          
          this.EmailSendNewComponent.emit('list');
        }, (error: any) => {
          
          this.tranService.errorMessage(error);
        })
      }

      // this.globService.operationAPIService(reqBody).subscribe(async (result: any) => {
      //   await this.loading.dismiss();
      //   
      // }, async (error: any) => {
      //   await this.loading.dismiss();
      //   this.tranService.errorMessage(error);
      // })
    }
  }

  triggerSubmit() {
    document.getElementById('submitButton').click();
  }

  goBack() {
    this.EmailSendNewComponent.emit('list');
    this.modalCtrl.dismiss({});
  }

  createFileEvent(file) {
    if (file.target.files) {
      for (let list of file.target.files) {
        let tempFile = { name: '', content: '' };
        tempFile.name = list.name;

        let reader = new FileReader();
        reader.onload = (e: any) => {
          tempFile.content = e.target.result;
          this.createDoc.push(tempFile);
        };
        reader.readAsDataURL(list);
      }

      this.createFile.nativeElement.value = '';
    } else {
      this.createDoc = [];
    }
  }

  openCreateFile() {
    document.getElementById('createFile').click();
  }
}
