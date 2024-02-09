import { Component, EventEmitter, Input, Output, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { BillServicesService } from './services/bill-services-service';
import { Paging } from 'src/app/model';
import { DatatableAction, SearchOption } from 'src/app/Shared/models';
import { ServiceSummary } from './bill-services.component.type';
import { SpinnerService } from 'src/app/Shared/services';

@Component({
  selector: 'app-bill-services',
  templateUrl: './bill-services.component.html',
  styleUrls: ['./bill-services.component.scss'],
})
export class BillServicesComponent implements OnChanges, OnDestroy {
  @Input() ContactCode: string = '';
  @Input() BillId: string = '';
  @Output('BillServices') BillServices: EventEmitter<string> = new EventEmitter<string>();

  totalCount: number = 0;
  dataSource: ServiceSummary[] = [];
  dataTableAction: DatatableAction = { row: [], toolBar: ['Refresh', 'ExportExcel'] };
  csvFileName: string;
  searchOptions: SearchOption[] = ['Text'];
  columnsUsedForCurrency: string[] = ['ChargeAmount', 'ChargeAmountInc', 'UsageAmount', 'UsageAmountInc', '']
  columns: string[] = [
    'ServiceId',
    'ServiceType',
    'ChargeAmount',
    'ChargeAmountInc',
    'UsageAmount',
    'UsageAmountInc',
    'ServiceReference',
  ];
  
  private eventParam = new Paging();
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private spinnerService: SpinnerService,
    private billServicesService: BillServicesService,
    private tranService: TranService,
    public globService: GlobalService,
    public dialog: MatDialog,
  ) {
    this.tranService.translaterService();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.BillId?.currentValue) {
      this.csvFileName = this.tranService.instant('BillServices') + ' ' + this.BillId;
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
    this.billServicesService.getServicesList(this.eventParam, this.BillId)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result) =>{
          this.spinnerService.end();
          if (result === null) {
            this.tranService.errorMessage('NoBillServices');
          } else {
            this.totalCount = result.Count;
            this.dataSource = result.ServiceSummaries;
          }
        },
        error: async (error: any) => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      })
  }
}
