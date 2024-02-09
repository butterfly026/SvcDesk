import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Paging } from 'src/app/model';
import { DatatableAction, PermissionType, SearchOption } from 'src/app/Shared/models';
import { TranService, LoadingService } from 'src/services';
import { ServiceStatusService } from './services/service-status.service';
import { StatusDetail } from './service-status.page.type';

@Component({
  selector: 'app-service-status',
  templateUrl: './service-status.page.html',
  styleUrls: ['./service-status.page.scss'],
})
export class ServiceStatusPage implements OnChanges, OnDestroy {

  @Input() ContactCode: string = '';
  @Output('ServiceStatusComponent') ServiceStatusComponent: EventEmitter<string> = new EventEmitter<string>();

  StatusId: string = '';

  totalCount: number;
  dataSource: StatusDetail[] = [];
  dataTableAction: DatatableAction = { row: [], toolBar: ['Refresh', 'ExportExcel'] };
  eventParam = new Paging();
  permissions: PermissionType[] = ['Download'];
  csvFileName = "Service Status ";
  columns = ['Id', 'Status', 'Count'];
  searchOptions: SearchOption[] = ['Text'];

  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private tranService: TranService,
    private loading: LoadingService,
    private serService: ServiceStatusService,
  ) {
    this.tranService.translaterService();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.ContactCode?.currentValue) {
      this.csvFileName += changes.ContactCode.currentValue;
      this.getServiceList();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  processServiceStatus(event) {
    this.ServiceStatusComponent.emit(event);
  }

  dblclickRow(event: StatusDetail): void {
    if (this.StatusId !== event.Id) {
      this.StatusId = event.Id;
    }
  }

  fetchData(event: Paging): void {
    this.eventParam = {
      CountRecords: 'Y',
      ...event
    }
    this.getServiceList();
  }

  private async getServiceList(): Promise<void> {
    await this.loading.present();

    this.serService.getServiceStatus(this.ContactCode, this.eventParam)
    .pipe(takeUntil(this.unsubscribeAll$))
    .subscribe(async result => {
      await this.loading.dismiss();
      
      if (result === null) {
        this.tranService.errorMessage('no_services');
      } else {
        this.dataSource = result.StatusNodes;
        this.totalCount = result.Count;
      }

    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }
}
