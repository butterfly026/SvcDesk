import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranService } from 'src/services';
import { SpinnerService } from 'src/app/Shared/services';
import { GlobalService } from 'src/services/global-service.service';
import { StringOrDatePipe } from 'src/app/Shared/pipes';
import { ContactMessageAttachment } from '../../models';
import { ContactMessageService } from '../../services';

@Component({
  selector: 'app-contact-message-detail',
  templateUrl: './contact-message-detail.component.html',
  styleUrls: ['./contact-message-detail.component.scss'],
})
export class ContactMessageDetailComponent implements OnInit {

  formGroup: FormGroup;
  attachments: ContactMessageAttachment[] = [];

  constructor(
    public globService: GlobalService,
    private spinnerService: SpinnerService,
    private transervice: TranService,
    private contactMessageService: ContactMessageService,
    private stringOrDatePipe: StringOrDatePipe,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ContactMessageDetailComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { messageId: number }
  ) { }

  ngOnInit() {
    this.getMessage();
  }

  downloadAttachment(val: ContactMessageAttachment): void {
  }

  private getMessage(): void {
    this.spinnerService.loading();
    this.contactMessageService.getMessage(this.data.messageId)
      .subscribe({
        next: result => {
          this.spinnerService.end();
          if (result.BodyFormat === 'TEXT') {
            result.Body = this.formatHtmlEntityCodes(result.Body)
          }
          this.attachments = result.Attachments;
          this.formGroup = this.formBuilder.group({
            ...result,
            Addresses: result.Addresses.map(s => s + ', ').toString(),
            Created: this.stringOrDatePipe.transform(result.Created, 'YYYY-MM-DD hh:mm:ss'),
            LastUpdated: this.stringOrDatePipe.transform(result.LastUpdated, 'YYYY-MM-DD hh:mm:ss'),
          });

          this.formGroup.disable();
        },
        error: error => {
          this.spinnerService.end();
          this.transervice.errorMessage(error);
          setTimeout(() => this.dialogRef.close(), 1000);
        }
      })
  }

  private formatHtmlEntityCodes(string: any): string {
    return !!string
      ? string.replace(/&#\d+;/gm, (s: any) => String.fromCharCode(s.match(/\d+/gm)[0]))
      : '';
  }

}
