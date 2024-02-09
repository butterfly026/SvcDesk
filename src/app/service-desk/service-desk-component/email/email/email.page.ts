import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { EmailService } from './services/email.service';
import { LoadingService, ToastService, TranService } from 'src/services';
import { UntypedFormGroup, UntypedFormControl, Validators, UntypedFormBuilder } from '@angular/forms';

import { COMMA, ENTER, SEMICOLON } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { GlobalService } from 'src/services/global-service.service';

export interface EmailItem {
  name: string;
}

export interface FileAttach {
  lastModified: number
  name: string,
  size: number,
  type: string,
  data: string,
}

@Component({
  selector: 'app-email',
  templateUrl: './email.page.html',
  styleUrls: ['./email.page.scss'],
})
export class EmailPage implements OnInit {

  @Input() DefaultEmail: string = '';
  @Input() ContactNumber: string = '';
  @Input() pageTitle: string = '';

  @Output('setComponentValue') public componentValue: EventEmitter<string> = new EventEmitter<string>();

  emailGroup: UntypedFormGroup;
  ccEmailArray: EmailItem[] = [];
  bccEmailArray: EmailItem[] = [];
  attachFiles = [];

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SEMICOLON];

  ccEmailCtrl = new UntypedFormControl(
    '', [
    Validators.email
  ]
  );

  bccEmailCtrl = new UntypedFormControl(
    '', [
    Validators.email
  ]
  );


  accept = '*';
  files: File[] = [];
  progress: number;
  hasBaseDropZoneOver: boolean = false;
  lastFileAt: Date;

  sendableFormData: FormData // populated via ngfFormData directive

  dragFiles: any
  validComboDrag: any
  lastInvalids: any
  fileDropDisabled: any
  maxSize: any
  baseDropValid: any

  constructor(
    private emailService: EmailService,
    private loading: LoadingService,
    private toast: ToastService,
    private tranService: TranService,
    private formBuilder: UntypedFormBuilder,
    
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    this.emailGroup = this.formBuilder.group({
      'defaultEmail': ['', [
        Validators.required,
        Validators.email
      ]],
      'emailSubject': [''
      ],
      'emailBody': ['']
      // 'multiEmailCtrl': this.multiEmailCtrl,
    });

    

    this.emailGroup.controls.defaultEmail.setValue(this.DefaultEmail);

  }

  ngOnInit() {
  }

  emailSend() {
    this.attachFiles = [];
    if (this.files.length === 0) {
      this.emailSubmit();
    } else {
      for (const list of this.files) {
        this.getFileSource(list);
      }
    }
  }

  emailSubmit() {
    if (this.emailGroup.valid) {
      const emailForm = {
        'email': this.emailGroup.controls.defaultEmail.value,
        'subject': this.emailGroup.controls.emailSubject.value,
        'cc': this.ccEmailArray,
        'bcc': this.bccEmailArray,
        'body': this.emailGroup.controls.emailBody.value,
        'attached': this.attachFiles,
      }
      this.emailService.emailSend(emailForm).subscribe((result: any) => {
        // await this.loading.dismiss();
        
        this.componentValue.emit('service_desk');
      }, (error: any) => {
        // await this.loading.dismiss();
        
        this.tranService.errorMessage(error);
      })
    }
  }

  goBack() {
    this.componentValue.emit('service_desk');
  }

  get f() {
    return this.emailGroup.controls;
  }

  multiEmail(en: any) {
    if (en.key === 'Enter') {
      if (!this.emailGroup.controls.multiEmailCtrl.hasError('email')) {
        this.ccEmailArray.push(this.emailGroup.controls.multiEmailCtrl.value);
        this.emailGroup.controls.multiEmailCtrl.setValue('');
      }
    }
  }

  cancelMultiEmail(index) {
    this.ccEmailArray.splice(index, 1);
  }

  triggerSubmit() {
    // document.getElementById('submitButton').click();
    this.emailSend();
  }

  addCC(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.ccEmailCtrl.setValue(value.trim());
      if (!this.ccEmailCtrl.hasError('email')) {
        this.ccEmailArray.push({ name: value.trim() });
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  addBCC(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.bccEmailCtrl.setValue(value.trim());
      if (!this.bccEmailCtrl.hasError('email')) {
        this.bccEmailArray.push({ name: value.trim() });
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeCC(email: EmailItem): void {
    const index = this.ccEmailArray.indexOf(email);

    if (index >= 0) {
      this.ccEmailArray.splice(index, 1);
    }
  }

  removeBCC(email: EmailItem): void {
    const index = this.bccEmailArray.indexOf(email);

    if (index >= 0) {
      this.bccEmailArray.splice(index, 1);
    }
  }

  getDate() {
    return new Date()
  }

  getFile(en: any) {
    
    if (en.target.files && en.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        
      };
      reader.readAsDataURL(en.target.files[0]);
    }
  }

  getFileSource(file: any) {
    const tempFile = {
      'lastModified': file.lastModified,
      'name': file.name,
      'size': file.size,
      'type': file.type,
      'data': ''
    }
    const reader = new FileReader();
    reader.onload = (event: any) => {
      
      tempFile.data = event.target.result;
      this.attachFiles.push(tempFile);
      if (this.attachFiles.length === this.files.length) {
        this.emailSubmit();
      }
    };
    reader.readAsDataURL(file);
  }

}
