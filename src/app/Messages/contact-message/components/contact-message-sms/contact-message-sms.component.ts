import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, Validators, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { TranService } from 'src/services';
import { SpinnerService } from 'src/app/Shared/services';
import { GlobalService } from 'src/services/global-service.service';
import { ContactMessageSMSService } from '../../services';
import { SendSMSRequest } from '../../models';

@Component({
  selector: 'app-contact-message-sms',
  templateUrl: './contact-message-sms.component.html',
  styleUrls: ['./contact-message-sms.component.scss'],
})
export class ContactMessageSmsComponent implements OnInit, OnDestroy {

  formGroup: FormGroup;
  minDate: string;
  maxDate: string;

  smsList: string[] = [];
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    public globService: GlobalService,
    private contactSmsService: ContactMessageSMSService,
    private spinnerService: SpinnerService,
    private tranService: TranService,
    private fromBuilder: UntypedFormBuilder,
    private dialogRef: MatDialogRef<ContactMessageSmsComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { contactCode: string }
  ) {
    this.tranService.translaterService();   
  }

  ngOnInit(): void {
    this.minDate = this.globService.getDateTimeWithString('YYYY-MM-DDTHH:mm', new Date());
    this.maxDate = this.globService.getDateTimeWithString('YYYY-MM-DDTHH:mm', new Date('9999-01-01'));

    this.formGroup = this.fromBuilder.group({
      Addresses: ['', Validators.required],
      Message: ['', Validators.required],
      Due: [this.minDate, Validators.required],
      CorrelationId: 13213,
      RequestDeliveryReceipt: false,
    });

    this.getSMSNumbersLists();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  triggerSubmit(): void {
    document.getElementById('submitButton').click();
  }

  sendSMS(): void {
    this.spinnerService.loading();
    const payload: SendSMSRequest = {
      ...this.formGroup.value,
      Addresses: this.formGroup.get('Addresses').value?.map(s => ({ MSISDN: s })),
      Due: this.formGroup.get('Due').value + ':00'
    };

    this.contactSmsService.sendSMS(payload, this.data.contactCode)
      .pipe(takeUntil(this.unsubscribeAll$))
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

  private getSMSNumbersLists(): void {
    this.spinnerService.loading();
    this.contactSmsService.getSMSNumbersList(this.data.contactCode)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => {
          this.spinnerService.end();
          this.smsList = result.filter(s => !!s.MSISDN).map(s => s.MSISDN);
        },
        error: error => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      })
  }

}
