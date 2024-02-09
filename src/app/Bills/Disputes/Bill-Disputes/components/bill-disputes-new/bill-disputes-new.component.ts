import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SpinnerService } from 'src/app/Shared/services';
import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { AlertService } from 'src/services/alert-service.service';
import { BillDisputesService } from '../../services';

@Component({
  selector: 'app-bill-disputes-new',
  templateUrl: './bill-disputes-new.component.html',
  styleUrls: ['./bill-disputes-new.component.scss'],
})
export class BillDisputesNewComponent implements OnInit, OnDestroy {

  formGroup: FormGroup;
  statusList = [
    { id: 'New', name: 'new' },
    { id: 'UnderAssessment', name: 'under_assessment' },
    { id: 'PendingApproval', name: 'pending_approval' },
    { id: 'Approved', name: 'approved' },
    { id: 'Cancelled', name: 'cancelled' },
    { id: 'Declined', name: 'declined' },
    { id: 'OnHold', name: 'on_hold' },
    { id: 'ClosedPendingCredit', name: 'closed_pending_credit' },
    { id: 'ClosedCreditRaised', name: 'closed_credit_raised' },
  ];

  private unsubscriebAll$: Subject<any> = new Subject<any>();

  constructor(
    private billDisputesService: BillDisputesService,
    private alertService: AlertService,
    private spinnerService: SpinnerService,
    private tranService: TranService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<BillDisputesNewComponent>,
    public globService: GlobalService,
    @Inject(MAT_DIALOG_DATA) public data: { billId: string, billNumber: number, contacCode: string }
  ) { }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      Date: [new Date()],
      Status: ['', Validators.required],
      DisputedAmount: [0, [Validators.required, Validators.min(0)]],
      Details: ['', Validators.required],
      RaisedBy: [''],
      ContactDetails: [''],
    });

    this.billDisputesService.getBills(this.data.contacCode).subscribe(res => {})
  }

  ngOnDestroy(): void {
    this.alertService.closeAllAlerts();
    this.unsubscriebAll$.next(null);
    this.unsubscriebAll$.complete();
  }

  close() {
    this.dialogRef.close();
  }

  submitTrigger(): void {
    document.getElementById('submitButton').click();
  }

  submitForm(): void {
    this.spinnerService.loading();
    this.billDisputesService.createBillDisputes(this.formGroup.value, this.data.billId)
      .pipe(takeUntil(this.unsubscriebAll$))
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
