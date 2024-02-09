import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Paging } from 'src/app/model';
import { DatatableAction, SearchOption } from 'src/app/Shared/models';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { DistributionService } from './services/distribution-service';
import { GeneralLedgerDistribution } from './financial-distributions.component.type';

@Component({
  selector: 'app-financial-distributions',
  templateUrl: './financial-distributions.component.html',
  styleUrls: ['./financial-distributions.component.scss'],
})
export class FinancialDistributionsComponent implements OnChanges, OnDestroy {
  @Input() FinancialId: string = '';

  totalCount: number = 0;
  dataSource: GeneralLedgerDistribution[] = [];
  dataTableAction: DatatableAction = { row: [], toolBar: ['Refresh', 'ExportExcel'] };
  csvFileName: string;
  searchOptions: SearchOption[] = [];
  columns: string[] = [
    'Id',
    'ServiceId',
    'ServiceReference',
    'ServiceTypeCode',
    'AdjustedDailyAmount',
    'Control',
    'Comment',
    'Sign',
    'To',
    'From',
    'AdjustedAmount',
    'TaxAmount',
    'Amount',
    'Period',
    'AccountName',
    'AccountCode',
    'Created',
    'CreatedBy'
  ];
  
  private eventParam = new Paging();
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private tranService: TranService,
    public globService: GlobalService,
    private distributionService: DistributionService,
    private loading: LoadingService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.FinancialId?.currentValue) {
      this.csvFileName = this.tranService.instant('FinantialDistributions') + ' ' + this.FinancialId;
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
    this.distributionService.FinancialDistribution(this.FinancialId, this.eventParam)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result) =>{
          await this.loading.dismiss();
          if (!result) {
            this.tranService.errorMessage('NoFinantialDistributions');
          } else {
            this.totalCount = result.length;
            this.dataSource = result;
          }
        },
        error: async (error: any) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      })
  }
}
