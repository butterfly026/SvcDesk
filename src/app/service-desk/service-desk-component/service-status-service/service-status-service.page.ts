import { Component, Input, Output, EventEmitter, OnDestroy, SimpleChanges, OnChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Paging } from 'src/app/model';
import { DatatableAction, PermissionType, SearchOption } from 'src/app/Shared/models';
import { ServiceDetail } from 'src/app/service-desk/service-desk-component/service-list/service-list.page.type';
import { TranService, LoadingService } from 'src/services';
import { ServiceStatusIdService } from './services/service-status-service';

@Component({
  selector: 'app-service-status-service',
  templateUrl: './service-status-service.page.html',
  styleUrls: ['./service-status-service.page.scss'],
})
export class ServiceStatusServicePage implements OnChanges, OnDestroy {

  @Input() ContactCode: string = '';
  @Input() StatusId: string = '';
  @Input() SearchString: string = '';
  @Output('ServiceStatusServiceComponent') public ServiceStatusServiceComponent: EventEmitter<string> = new EventEmitter<string>();

  totalCount: number;
  dataSource: ServiceDetail[] = [];
  dataTableAction: DatatableAction = { row: ['Details'], toolBar: ['Refresh', 'ExportExcel'] };
  permissions: PermissionType[] = ['Details', 'Download'];
  searchOptions: SearchOption[] = ['Text'];
  csvFileName = '';
  columns = [
    'ServiceReference', 
    'ServiceId', 
    'ServiceType', 
    'StatusCode', 
    'Status', 
    'Plan', 
    'PlanOption', 
    'Connected', 
    'Disconnected', 
    'PlanId', 
    'PlanOptionId', 
    'UserLabel'
  ];

  private eventParam = new Paging();
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private tranService: TranService,
    private loading: LoadingService,
    private serService: ServiceStatusIdService,
  ) {
    this.tranService.translaterService();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ContactCode?.currentValue || changes.StatusId?.currentValue) {
      this.csvFileName = 'Service Status Service ' + this.ContactCode + ' ' + this.StatusId;
    }

    if (!!this.SearchString) {
      this.eventParam.SearchString = this.SearchString;
    }
    this.getServiceList();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  viewDetail(event: ServiceDetail): void {
    if (typeof (event.ServiceReference) !== 'undefined' && typeof (event.ServiceId) !== 'undefined') {
      this.ServiceStatusServiceComponent.emit(event.ServiceId + 'ServiceListNew' + event.ServiceReference);
    }
  }
  
  fetchData(event: Paging): void {
    this.eventParam = {
      CountRecords: 'Y',
      ...event
    };
    this.getServiceList();
  }

  private async getServiceList() {
    await this.loading.present();

    this.serService.getServiceListByStatus(this.ContactCode, this.StatusId, this.eventParam)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe(async result => {
        await this.loading.dismiss();
        
        if (result === null) {
          this.tranService.errorToastMessage('no_services');
        } else {
          this.dataSource = result.Services;
          this.totalCount = result.Count;
        }

      }, async error  => {
        await this.loading.dismiss();
        this.tranService.errorMessage(error);
      });
  }
}
