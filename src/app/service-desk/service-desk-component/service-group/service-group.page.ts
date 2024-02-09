import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Paging } from 'src/app/model';
import { TranService, LoadingService } from 'src/services';
import { DatatableAction, PermissionType, SearchOption } from 'src/app/Shared/models';
import { ServiceGroupDetail, StatusCount } from './service-group.page.type';
import { ServiceGroupService } from './services/service-group.service';

@Component({
  selector: 'app-service-group',
  templateUrl: './service-group.page.html',
  styleUrls: ['./service-group.page.scss'],
})
export class ServiceGroupPage implements OnChanges, OnDestroy {

  @Input() ContactCode: string = '';
  @Output('ServiceGroupComponent') ServiceGroupComponent: EventEmitter<string> = new EventEmitter<string>();

  GroupId: number;

  totalCount: number;
  dataSource: ServiceGroupDetail[] = [];
  dataTableAction: DatatableAction = { row: [], toolBar: ['Refresh', 'ExportExcel'] };
  eventParam = new Paging();
  permissions: PermissionType[] = ['Download'];
  csvFileName = "Service Group ";
  columns = ['Id', 'Name', 'Count', 'Status', 'StatusCounts'];
  searchOptions: SearchOption[] = ['Text'];

  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private tranService: TranService,
    private loading: LoadingService,
    private serService: ServiceGroupService,
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

  processServiceGroup(event) {
    this.ServiceGroupComponent.emit(event);
  }
  
  dblclickRow(event: ServiceGroupDetail): void {
    if (this.GroupId !== event.Id) {
      this.GroupId = event.Id;
    }
  }

  fetchData(event: Paging): void {
    this.eventParam = {
      CountRecords: 'Y',
      ...event
    }
    this.getServiceList();
  }

  private async getServiceList() {
    await this.loading.present();
    this.serService.getServiceGroupList(this.ContactCode, this.eventParam)
    .pipe(takeUntil(this.unsubscribeAll$))
    .subscribe(async result => {
      await this.loading.dismiss();
      
      if (result === null) {
        this.tranService.errorMessage('no_services');
      } else {
        this.dataSource = result.ServiceGroupNodes.map(s => ({
          ...s,
          StatusCounts: this.formatStatusCounts(s.StatusCounts as StatusCount[])
        }));
        this.totalCount = result.Count;
      }

    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  private formatStatusCounts(statusCounts: StatusCount[]): string {
    let value = '';

    statusCounts.forEach((s, i) => {
      value += `${s.Status}: ${s.Count}`;

      if (i !== statusCounts.length - 1) {
        value += ', ';
      }
    });
    return value;
  }
}
