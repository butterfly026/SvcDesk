import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TranService, LoadingService } from 'src/services';
import { Paging } from 'src/app/model';
import { DatatableAction, SearchOption } from 'src/app/Shared/models';
import { EventService } from './services/event-service';
import { FinantialEvent } from './financial-events.component.type';

@Component({
  selector: 'app-financial-events',
  templateUrl: './financial-events.component.html',
  styleUrls: ['./financial-events.component.scss'],
})
export class FinancialEventsComponent implements OnChanges, OnDestroy {
  @Input() FinancialId: string = '';

  totalCount: number = 0;
  dataSource: FinantialEvent[] = [];
  dataTableAction: DatatableAction = { row: [], toolBar: ['Refresh', 'ExportExcel'] };
  csvFileName: string;
  searchOptions: SearchOption[] = ['Text'];
  columns: string[] = [
    'Id',
    'Name',
    'Due',
    'ScheduleStatus',
    'StatusDateTime',
    'ScheduledBy',
    'ScheduledTo',
    'DepartmentScheduledTo',
    'Reason',
    'Note',
    'Code',
    'Type',
    'CreatedBy',
    'Created'
  ];
  
  private eventParam = new Paging();
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private tranService: TranService,
    private eventService: EventService,
    private loading: LoadingService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.FinancialId?.currentValue) {
      this.csvFileName = this.tranService.instant('FinantialEvents') + ' ' + this.FinancialId;
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
    this.eventService.FinancialEvents(this.FinancialId, this.eventParam)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result) =>{
          await this.loading.dismiss();
          if (result === null) {
            this.tranService.errorMessage('NoFinantialEvents');
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
