import { SpinnerService } from 'src/app/Shared/services';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { FinancialTransaction } from '../financial-transaction-list/financial-transaction-list.page.type';
import { FinancialTransactionStatusService } from './services';
import { FinancialTransactionStatus } from './financial-transaction-edit-status.component.type';

@Component({
  selector: 'app-financial-transaction-edit-status',
  templateUrl: './financial-transaction-edit-status.component.html',
  styleUrls: ['./financial-transaction-edit-status.component.scss'],
})
export class FinancialTransactionEditStatusComponent implements OnInit, OnDestroy {

  status: string;
  statuses: FinancialTransactionStatus[] = [];

  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private spinnerService: SpinnerService,
    private financialTransactionStatusService: FinancialTransactionStatusService,
    private tranService: TranService,
    private dialogRef: MatDialogRef<FinancialTransactionEditStatusComponent>,
    public globService: GlobalService,
    @Inject(MAT_DIALOG_DATA) public data: { financialTransactionData: FinancialTransaction },
  ) { }

  ngOnInit() {
    this.status = this.data.financialTransactionData.StatusCode;
    this.getFinancialTransactionsStatuses();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  get isDisabledUpdating(): boolean {
    return this.status === this.data.financialTransactionData.StatusCode;
  }

  updateStatus(): void {
    if (!this.isDisabledUpdating) {
      this.spinnerService.loading();
      this.financialTransactionStatusService.updateFinancialTransactionStatus(this.data.financialTransactionData.Id, this.status)
        .pipe(
          takeUntil(this.unsubscribeAll$), 
          finalize(() => this.spinnerService.end())
        )
        .subscribe({
          next: () => this.dialogRef.close('ok'),
          error: error => this.tranService.errorMessage(error)
        })
    }
  }

  private getFinancialTransactionsStatuses(): void {
    this.spinnerService.loading();
    this.financialTransactionStatusService.getAvailableFinancialTransactionsStatuses(this.data.financialTransactionData.Id)
      .pipe(
        takeUntil(this.unsubscribeAll$), 
        finalize(() => this.spinnerService.end())
      )
      .subscribe({
        next: result => this.statuses = result,
        error: error => {
          this.tranService.errorMessage(error);
          this.dialogRef.close();
        }
      });
  }

}
