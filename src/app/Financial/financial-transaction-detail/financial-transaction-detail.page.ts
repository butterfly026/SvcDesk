import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

import { TranService } from 'src/services';
import { SpinnerService } from 'src/app/Shared/services';
import { GlobalService } from 'src/services/global-service.service';
import { FinancialTransactionDetailService } from './services/financial-transaction-detail.service';
import { FinancialTransactionDetilTab, FinancialTransactionDetilTabTypeCode, GetFinancialTransactionResponse } from './financial-transaction-detail.page.type';

@Component({
  selector: 'app-financial-transaction-detail',
  templateUrl: './financial-transaction-detail.page.html',
  styleUrls: ['./financial-transaction-detail.page.scss'],
})
export class FinancialTransactionDetailPage implements OnInit, OnChanges, OnDestroy {

  @Input() FinancialId: string = '';
  @Input() ContactCode: string = '';
  @Output('setComponentValue') public componentValue: EventEmitter<string> = new EventEmitter<string>();

  financialTransactionDetail: GetFinancialTransactionResponse;
  selectedServiceDeskIndex: number = 0;
  availableTabList: FinancialTransactionDetilTab[] = [];
  orignalTabList: FinancialTransactionDetilTab[] = [
    {
      tabLabel: 'note',
      typeCodes: [],
      filterType: 'every'
    },
    {
      tabLabel: 'charges',
      typeCodes: ['R', 'RF', 'DA', 'CA'],
      filterType: 'every'
    },
    {
      tabLabel: 'usage',
      typeCodes: ['R', 'RF', 'DA', 'CA'],
      filterType: 'every'
    },
    {
      tabLabel: 'service_summary',
      typeCodes: ['R', 'RF', 'DA', 'CA'],
      filterType: 'every'
    },
    {
      tabLabel: 'product',
      typeCodes: ['R', 'RF', 'DA', 'CA'],
      filterType: 'every'
    },
    {
      tabLabel: 'allocations',
      typeCodes: [],
      filterType: 'every'
    },
    {
      tabLabel: 'distributions',
      typeCodes: [],
      filterType: 'every'
    },
    {
      tabLabel: 'events',
      typeCodes: [],
      filterType: 'every'
    },
    {
      tabLabel: 'pay_request',
      typeCodes: ['R', 'RF'],
      filterType: 'some'
    },
    {
      tabLabel: 'external_transactions',
      typeCodes: ['R', 'RF'],
      filterType: 'some'
    }
  ];

  currentTabLabel: string = '';
  createUpdateData: any = {
    created: '',
    createdBy: '',
    updated: '',
    updatedBy: ''
  };
  
  private finanacialTypeCodesForAbsoulteAmount: FinancialTransactionDetilTabTypeCode[] = ['R', 'R', 'CN', 'CA'];
  private unSubscriebAll$: Subject<any> = new Subject<any>();

  constructor(
    private spinnerService: SpinnerService,
    private fTDService: FinancialTransactionDetailService,
    private tranService: TranService,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
  }

  ngOnInit(): void {
    this.getData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.FinancialId?.currentValue) {
      this.getData();
    }
  }

  ngOnDestroy(): void {
    this.unSubscriebAll$.next(null);
    this.unSubscriebAll$.complete();
  }

  getCurrencyConfiguration(val: number): string {
    return this.globService.getCurrencyConfiguration(val);
  }

  getData(): void {
    this.spinnerService.loading();
    this.fTDService.FinantialTransactionsById(this.FinancialId)
      .pipe(takeUntil(this.unSubscriebAll$))
      .subscribe({
        next: result => {
          this.createUpdateData.created = result.Created;
          this.createUpdateData.createdBy = result.CreatedBy;
          this.createUpdateData.updated = result.LastUpdated;
          this.createUpdateData.updatedBy = result.UpdatedBy;
          
          this.availableTabList = this.orignalTabList.filter(
            s => s.filterType === 'every' 
              ? s.typeCodes.every(t => t !== result.TypeCode)
              : s.typeCodes.some(t => t === result.TypeCode)
          );

          if (result.Amount < 0 && this.finanacialTypeCodesForAbsoulteAmount.includes(result.TypeCode)) {
            result.Amount = Math.abs(result.Amount)
          }
          
          this.financialTransactionDetail = result;
          this.spinnerService.end();
        },
        error: error => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      });
  }

  selectTabs(event): void {
    this.selectedServiceDeskIndex = event.index;
    this.currentTabLabel = this.availableTabList[this.selectedServiceDeskIndex].tabLabel;
  }
}
