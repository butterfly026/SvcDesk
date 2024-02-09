import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Paging } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { DatatableAction, SearchOption } from 'src/app/Shared/models';
import { FinancialTransactionDetailService } from '../financial-transaction-detail/services/financial-transaction-detail.service';
import { FinancialTransactionAllocation } from '../financial-transaction-detail/financial-transaction-detail.page.type';

@Component({
  selector: 'app-financial-allocations',
  templateUrl: './financial-allocations.component.html',
  styleUrls: ['./financial-allocations.component.scss'],
})
export class FinancialAllocationsComponent implements OnChanges, OnDestroy {
  @Input() FinancialId: string = '';

  totalCount: number = 0;
  dataSource: FinancialTransactionAllocation[] = [];
  dataTableAction: DatatableAction = { row: [], toolBar: ['Refresh', 'ExportExcel'] };
  csvFileName: string;
  searchOptions: SearchOption[] = [];
  columns: string[] = [
    'Id',
    'BillNumber',
    'TypeCode',
    'OtherReference',
    'TaxAmount',
    'Amount',
    'LastUpdated',
    'Category',
    'Status',
    'Type',
    'AllocatedAmount',
    'OpenAmount',
    'Date',
    'Number',
    'AssignmentDirection',
    'Source',
    'Created',
    'CreatedBy',
    'UpdatedBy'
  ];
  
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private tranService: TranService,
    public globService: GlobalService,
    private financialTransactionDetailsService: FinancialTransactionDetailService,
    private loading: LoadingService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.FinancialId?.currentValue) {
      this.csvFileName = this.tranService.instant('FinancialAllocations') + ' ' + this.FinancialId;
      this.getChargesList();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }
  
  async fetchData(event: Paging): Promise<void> {
    await this.loading.present();
    this.getChargesList();
  }

  private async getChargesList(): Promise<void> {
    this.financialTransactionDetailsService.FinantialTransactionsById(this.FinancialId)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result) =>{
          await this.loading.dismiss();
          if (!result?.Allocations) {
            this.tranService.errorMessage('NoFinancialAllocations');
          } else {
            this.totalCount = result.Allocations.length;
            this.dataSource = result.Allocations;
          }
        },
        error: async (error: any) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      })
  }

}
