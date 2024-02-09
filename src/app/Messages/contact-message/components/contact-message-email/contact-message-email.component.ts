import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { jqxEditorComponent } from 'jqwidgets-ng/jqxeditor';

import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { SpinnerService } from 'src/app/Shared/services';
import { ArrayValidator } from 'src/app/Shared/validators';
import { ContactMessageEmailService } from '../../services';
import { AvailableDocument, EmailConfiguration } from '../../models';

@Component({
  selector: 'app-contact-message-email',
  templateUrl: './contact-message-email.component.html',
  styleUrls: ['./contact-message-email.component.scss'],
})
export class ContactMessageEmailComponent implements OnInit {

  @ViewChild('emailBody') emailBody: jqxEditorComponent;
  
  formGroup: FormGroup;
  emailList: string[] = [];
  existDocList: AvailableDocument[] = [];
  emailConfiguration: EmailConfiguration;
  minDate: string;
  maxDate: string;
  selectableExistingDocs: boolean = false;

  constructor(
    public globService: GlobalService,
    private emailService: ContactMessageEmailService,
    private spinnerService: SpinnerService,
    private tranService: TranService,
    private fromBuilder: UntypedFormBuilder,
    private dialogRef: MatDialogRef<ContactMessageEmailComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { contactCode: string }
  ) {
    this.tranService.translaterService();
  }

  ngOnInit(): void {
    this.formGroup = this.fromBuilder.group({
      TO: ['', [Validators.required, ArrayValidator('email')]],
      CC: ['', [Validators.required, ArrayValidator('email')]],
      BCC: ['', [Validators.required, ArrayValidator('email')]],
      Subject: ['', Validators.required],
      Due: ['', Validators.required],
      existingDocs: [''],
      loadDocs: ['',],
    });

    this.minDate = this.globService.getDateTimeWithString('YYYY-MM-DDTHH:mm', new Date());
    this.formGroup.get('Due').setValue(this.minDate);
    this.getEmailConfiguration();
  }

  get TOFormControlValue(): string[] {
    return this.formGroup.get('TO').value || [];
  }

  get CCFormControlValue(): string[] {
    return this.formGroup.get('CC').value || [];
  }

  get BCCFormControlValue(): string[] {
    return this.formGroup.get('BCC').value || [];
  }

  changeExistingDocs(event: MatSlideToggleChange): void {
    this.selectableExistingDocs = event.checked;
    if (event.checked) {
      this.getAvailableDocuments();
    }
  }
  
  triggerSubmit() {
    document.getElementById('submitButton').click();
  }
  
  sendEmail(): void {
    if (this.formGroup.valid) {
      const reqParam = {
        Recipients: [
          ...this.TOFormControlValue.map(s => ({ Type: 'TO', Address: s })),
          ...this.CCFormControlValue.map(s => ({ Type: 'CC', Address: s })),
          ...this.BCCFormControlValue.map(s => ({ Type: 'BCC', Address: s })),
        ],
        Subject: this.formGroup.get('Subject').value,
        Body: this.HTMLEncode(this.emailBody.val()),
        Due: this.formGroup.get('Due').value,
        BodyFormat: 'HTML',
        Priority: 'MEDIUM',
        CorrelationId: 0,
        RequestDeliveryReceipt: false,
        Attachments: [],
        TemplateId: 0,
      }

      if (this.emailConfiguration.ExternalAttachments) {
        for (let list of this.formGroup.get('existingDocs').value) {
          const tempDocuments = { DocumentId: list, Type: this.existDocList.filter(s => s.Id === list).map(s => s.Type) };
          reqParam.Attachments.push(tempDocuments);
        }
      }

      this.spinnerService.loading();
      this.emailService.sendEmail(reqParam, this.data.contactCode)
        .subscribe({
          next: () => {
            this.spinnerService.end();
            this.dialogRef.close('ok');
          },
          error: error => {
            this.spinnerService.end();
            this.tranService.errorMessage(error);
          }
        });
    }
  }

  private getEmailConfiguration(): void {
    this.spinnerService.loading();
    this.emailService.getEmailConfiguration()
      .subscribe({
        next: result => {
          this.emailConfiguration = result;

          if (result?.MaximumScheduleDays) {
            const date = new Date();
            date.setDate(date.getDate() + result.MaximumScheduleDays);
            this.maxDate = this.globService.getDateTimeWithString('YYYY-MM-DDTHH:mm', date);
          }

          if (!result?.CC) {
            this.formGroup.get('CC').disable();
          }

          if (!result?.BCC) {
            this.formGroup.get('BCC').disable();
          }

          this.getEmailLists();
        },
        error: error => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      });
  }

  private getAvailableDocuments() {
    this.spinnerService.loading();
    this.emailService.getAvailableDocuments(this.data.contactCode)
      .subscribe({
        next: result => {
          this.spinnerService.end();
          this.existDocList = result.Documents;
        },
        error: error => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      });
  }

  
  private getEmailLists(): void {
    this.emailService.getEmailAddresses(this.data.contactCode)
      .subscribe({
        next: result => {
          this.spinnerService.end();
          this.emailList = result.map(s => s.Address);
        },
        error: error => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      });
  }

  private HTMLEncode(str) {
    var i = str.length,
      aRet = [];

    while (i--) {
      var iC = str[i].charCodeAt();
      if (iC < 65 || iC > 127 || (iC > 90 && iC < 97)) {
        aRet[i] = '&#' + iC + ';';
      } else {
        aRet[i] = str[i];
      }
    }
    return aRet.join('');
  }
}
