import { Component, Input, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Paging } from 'src/app/model';
import { DatatableAction } from 'src/app/Shared/models';
import { SpinnerService } from 'src/app/Shared/services';
import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { FinancialTransactionPayRequest } from '../financial-transaction-detail/financial-transaction-detail.page.type';
import { FinancialTransactionDetailService } from '../financial-transaction-detail/services/financial-transaction-detail.service';

@Component({
  selector: 'app-financial-pay-requests',
  templateUrl: './financial-pay-requests.component.html',
  styleUrls: ['./financial-pay-requests.component.scss'],
})
export class FinancialPayRequestsComponent implements OnChanges, OnDestroy {
  @Input() FinancialId: string = '';

  totalCount: number = 0;
  dataSource: FinancialTransactionPayRequest[] = [];
  dataTableAction: DatatableAction = { row: [], toolBar: ['Refresh', 'ExportExcel'] };
  csvFileName: string;
  columns: string[] = [ 'Id', 'TypeId', 'SourceId', 'Amount', 'TaxAmount', 'ProviderId', 'Provider', 'Date', 'Status', 'Reason', 'SettlementDate'];
      
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private finantialPayRequests: FinancialTransactionDetailService,
    private tranService: TranService,
    private spinnerService: SpinnerService,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.FinancialId?.currentValue) {
      this.csvFileName = this.tranService.instant('FinantialPayRequests') + ' ' + this.FinancialId;
      this.getFinantialPayRequests();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }
  
  fetchData(event: Paging): void {
    this.spinnerService.loading();
    this.getFinantialPayRequests();
  }

  private getFinantialPayRequests(): void {
    this.finantialPayRequests.FinantialTransactionsById(this.FinancialId)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result =>{
          this.spinnerService.end();
          if (result === null || !result.PayRequests) {
            this.tranService.errorMessage('NoFinantialPayRequests');
          } else {
            this.totalCount = result.PayRequests.length;
            this.dataSource = result.PayRequests;
          }
        },
        error: error => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      })
  }
}
