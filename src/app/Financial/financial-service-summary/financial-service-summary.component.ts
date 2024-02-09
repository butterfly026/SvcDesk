import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { TranService, LoadingService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { Paging } from 'src/app/model';
import { DatatableAction, SearchOption } from 'src/app/Shared/models';
import { FinancialServiceSummaryService } from './services/service-summary.service';
import { ServiceSummary } from './financial-service-summary.component.type';

@Component({
  selector: 'app-financial-service-summary',
  templateUrl: './financial-service-summary.component.html',
  styleUrls: ['./financial-service-summary.component.scss'],
})
export class FinancialServiceSummaryComponent implements OnChanges, OnDestroy {
  @Input() FinancialId: string = '';

  totalCount: number = 0;
  dataSource: ServiceSummary[] = [];
  dataTableAction: DatatableAction = { row: [], toolBar: ['Refresh', 'ExportExcel'] };
  csvFileName: string;
  searchOptions: SearchOption[] = ['Text'];
  columns: string[] = [
    'ServiceTypeCode',
    'ServiceReference',
    'ServiceId',
    'ChargeAmount',
    'ChargeAmountInc',
    'UsageAmount',
    'UsageAmountInc',
    'UsageStart',
    'UsageEnd'
  ];
  
  private eventParam = new Paging();
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private tranService: TranService,
    public globService: GlobalService,
    private financialServiceSummaryService : FinancialServiceSummaryService,
    private loading: LoadingService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.FinancialId?.currentValue) {
      this.csvFileName = this.tranService.instant('FinantialServiceSummary') + ' ' + this.FinancialId;
      this.getChargesList();
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
    await this.loading.present();
    this.getChargesList();
  }

  private async getChargesList(): Promise<void> {
    this.financialServiceSummaryService.FinancialServiceSummary(this.FinancialId, this.eventParam)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result) =>{
          await this.loading.dismiss();
          if (result === null) {
            this.tranService.errorMessage('NoFinantialServiceSummary');
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
