import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, OnChanges, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Paging } from 'src/app/model';
import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { SpinnerService } from 'src/app/Shared/services';
import { DatatableAction, SearchOption } from 'src/app/Shared/models';
import { BillTransactionService } from './services/bill-transactions-service';
import { Transaction } from './bill-transactions.component.type';

@Component({
  selector: 'app-bill-transactions',
  templateUrl: './bill-transactions.component.html',
  styleUrls: ['./bill-transactions.component.scss'],
})
export class BillTransactionsComponent implements OnChanges, OnDestroy {


  @Input() ContactCode: string = '';
  @Input() TypeStr: string = '';
  @Input() BillId: string = '';
  @Output('BillTransactionComponent') BillTransactionComponent: EventEmitter<string> = new EventEmitter<string>();

  totalCount: number = 0;
  dataSource: Transaction[] = [];
  dataTableAction: DatatableAction = { row: [], toolBar: ['Refresh', 'ExportExcel'] };
  subTableAction: DatatableAction = { row: [], toolBar: [] };  
  csvFileName: string;
  searchOptions: SearchOption[] = ['Text'];
  propertyNameToShowInSubTable = 'TransactionComponents';
  subTableColumnsUsedForCurrency: string[] = ['Amount']
  columnsUsedForCurrency: string[] = ['NonDiscountedTax', 'NonDiscountedPrice', 'Tax', 'Price', 'CostTax', 'Cost'];
  columns: string[] = [
    'Id',
    'Tariff',
    'Price',
    'Tax',
    'NonDiscountedPrice',
    'NonDiscountedTax',
    'UnitOfMeasure',
    'Duration',
    'BParty',
    'BPartyDescription',
    'StartDateTime',
    'UnitQuantity',
    'RateBandDescription',
    'Origin',
    'Band1RateUnit',
    'ThirdParty',
    'TariffCode',
    'UsageGroupOrder',
    'UsageGroupCode',
    'UsageGroup',
    'ServiceId',
    'ServiceReference',
    'ServiceNarrative',
    'ServiceType',
    'TaxFree',
    'CostTax',
    'Cost'
  ];

  subTableColumns = [
    'Id',
    'Name',
    'Type',
    'Amount',
    'DiscountId',
    'Discount',
    'TransactionCategory',
    'Tariff',
    'PlanId',
    'OverrideId',
    'Taxable'
  ]
  
  private eventParam = new Paging();
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private transactionService: BillTransactionService,
    private spinnerService: SpinnerService,
    private tranService: TranService,
    public globService: GlobalService,
    public dialog: MatDialog,
  ) {
    this.tranService.translaterService();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.BillId?.currentValue) {
      this.csvFileName = this.tranService.instant('BillTransactions') + ' ' + this.BillId;
      this.spinnerService.loading();
      this.getServicesList();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  async fetchData(event: Paging): Promise<void> {
    this.eventParam = {
      CountRecords: 'Y',
      ...event
    }
    this.spinnerService.loading();
    this.getServicesList();
  }

  private async getServicesList(): Promise<void> {
    this.transactionService.getTransactions(this.eventParam, this.BillId)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result) =>{
          this.spinnerService.end();
          if (result === null) {
            this.tranService.errorMessage('NoBillTransactions');
          } else {
            this.totalCount = result.Count;
            this.dataSource = result.Items;
          }
        },
        error: async (error: any) => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      })
  }

}
