import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { GlobalService } from 'src/services/global-service.service';
import { SpinnerService } from 'src/app/Shared/services';
import { TranService } from 'src/services';
import { FormatStringPipe } from 'src/app/Shared/pipes';
import { BillDisputesService } from '../../services';
import { AlertService } from 'src/services/alert-service.service';
import { BillDispute } from '../../models';

@Component({
  selector: 'app-bill-disputes-edit',
  templateUrl: './bill-disputes-edit.component.html',
  styleUrls: ['./bill-disputes-edit.component.scss'],
})
export class BillDisputesEditComponent implements OnInit, OnDestroy {

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
    private spinnerService: SpinnerService,
    private formatStringPipe: FormatStringPipe,
    private tranService: TranService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<BillDisputesEditComponent>,
    public globService: GlobalService,
    @Inject(MAT_DIALOG_DATA) public data: { billDispute: BillDispute }
  ) { }

  ngOnInit(): void {   
    this.spinnerService.loading();
    this.billDisputesService.getBillDisputeDetail(this.data.billDispute.Id)
      .pipe(takeUntil(this.unsubscriebAll$))
      .subscribe({
        next: result => {
          this.spinnerService.end();
          this.formGroup = this.formBuilder.group({
            Date: result.Date,
            Status: [result.Status, Validators.required],
            DisputedAmount: [result.DisputedAmount, [Validators.required, Validators.min(0)]],
            Details: [this.formatStringPipe.transform(result.Details), Validators.required],
            RaisedBy: [result.RaisedBy],
            ContactDetails: [result.ContactDetails],
            ApprovedById: result.ApprovedBy,
            ApprovalNotes: result.ApprovalNotes,
            SettlementAmount: result.SettlementAmount,
            SettlementTax: result.SettlementTax,
          });
        },
        error: error => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      })
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
    this.billDisputesService.updateBillDispute(this.formGroup.value, this.data.billDispute.Id)
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
