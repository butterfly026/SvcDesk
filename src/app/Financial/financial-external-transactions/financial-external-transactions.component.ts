import { Component, Input, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Paging } from 'src/app/model';
import { TranService } from 'src/services';
import { DatatableAction } from 'src/app/Shared/models';
import { SpinnerService } from 'src/app/Shared/services';
import { GlobalService } from 'src/services/global-service.service';
import { FinancialTransactionDetailService } from '../financial-transaction-detail/services/financial-transaction-detail.service';
@Component({
  selector: 'app-financial-external-transactions',
  templateUrl: './financial-external-transactions.component.html',
  styleUrls: ['./financial-external-transactions.component.scss'],
})
export class FinancialExternalTransactionsComponent implements OnChanges, OnDestroy {
  @Input() FinancialId: string = '';

  totalCount: number = 0;
  dataSource: any[] = [];
  dataTableAction: DatatableAction = { row: [], toolBar: ['Refresh', 'ExportExcel'] };
  csvFileName: string;
  columns: string[] = [
    'Id',
    'Status',
    'Date',
    'Amount',
    'Reference',
    'DebtorCode',
    'OriginalReference',
    'OriginalDate',
    'PayerId',
    'SettlementDate',
    'AdditionalInformation',
    'Created',
    'CreatedBy',
    'LastUpdated',
    'UpdatedBy',
  ];
      
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private spinnerService: SpinnerService,
    private financialTransactionDetailService: FinancialTransactionDetailService,
    private tranService: TranService,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.FinancialId?.currentValue) {
      this.csvFileName = this.tranService.instant('FinantialExternalTransactions') + ' ' + this.FinancialId;
      this.getFinantialExternalTransactions();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }
  
  fetchData(event: Paging): void {
    this.spinnerService.loading();
    this.getFinantialExternalTransactions();
  }

  private getFinantialExternalTransactions(): void {
    this.financialTransactionDetailService.FinantialTransactionsById(this.FinancialId)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: (result) =>{
          this.spinnerService.end();
          if (result === null || !result.ExternalTransactions) {
            this.tranService.errorMessage('NoFinantialExternalTransactions');
          } else {
            this.totalCount = result.PayRequests.length;
            this.dataSource = result.PayRequests;
          }
        },
        error: (error: any) => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      })
  }

}
