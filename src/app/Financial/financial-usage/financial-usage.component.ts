import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Paging } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { DatatableAction, SearchOption } from 'src/app/Shared/models';
import { FinancialUsageService } from './service/financial-usage-service';
import { Transaction } from './financial-usage.component.type';
import { FinancialUsageHistoryComponent } from '../financial-usage-history/financial-usage-history.component';

@Component({
  selector: 'app-financial-usage',
  templateUrl: './financial-usage.component.html',
  styleUrls: ['./financial-usage.component.scss'],
})
export class FinancialUsageComponent implements OnChanges, OnDestroy {

  @Input() FinancialId: string = '';
  @Output('FinancialUsageComponent') public FinancialUsageComponent: EventEmitter<string> = new EventEmitter<string>();

  totalCount: number = 0;
  dataSource: Transaction[] = [];
  dataTableAction: DatatableAction = { row: ['Details'], toolBar: ['Refresh', 'ExportExcel'] };
  csvFileName: string;
  searchOptions: SearchOption[] = ['Text'];
  columns: string[] = [
    'Id',
    'ServiceReference',
    'ServiceId',
    'ServiceType',
    'StartDateTime',
    'BParty',
    'BPartyDescription',
    'Duration',
    'UnitQuantity',
    'UnitOfMeasure',
    'Price',
    'Tax',
    'NonDiscountedPrice',
    'NonDiscountedTax',
    'Cost',
    'CostTax',
    'UsageGroup',
    'UsageGroupCode',
    'UsageGroupOrder',
    'TariffCode',
    'Tariff',
    'Band1RateUnit',
    'TaxFree',
    'ServiceNarrative',
  ];
  
  private eventParam = new Paging();
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private loading: LoadingService,
    private financialService: FinancialUsageService,
    private tranService: TranService,
    public globService: GlobalService,
    private dialog: MatDialog,
  ) {
    this.tranService.translaterService();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.FinancialId?.currentValue) {
      this.csvFileName = this.tranService.instant('FinancialUsage') + ' ' + this.FinancialId;
      this.getChargesList();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }
  
  viewDetail(event: Transaction): void {
    this.dialog.open(FinancialUsageHistoryComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '600px',
      maxHeight: '600px',
      data: event
    });
  }

  async fetchData(event: Paging): Promise<void> {
    this.eventParam = {
      CountRecords: 'Y',
      ...event
    }
    await this.loading.present();
    this.getChargesList();
  }

  private async getChargesList(): Promise<void> {
    this.financialService.FinancialUsageService(this.FinancialId, this.eventParam)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result) =>{
          await this.loading.dismiss();
          if (result === null) {
            this.tranService.errorMessage('NoFinancialUsage');
          } else {
            this.totalCount = result.Count;
            this.dataSource = result.Items;
          }
        },
        error: async (error: any) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      })
  }

}
