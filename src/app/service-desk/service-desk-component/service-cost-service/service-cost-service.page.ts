import { Component, Input, Output, EventEmitter, ViewChild, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Paging } from 'src/app/model';
import { TranService, LoadingService } from 'src/services';
import { ServiceCostIdService } from './services/service-cost-service';
import { DatatableAction, PermissionType, SearchOption } from 'src/app/Shared/models';
import { ServiceDetail } from './../service-list/service-list.page.type';

@Component({
  selector: 'app-service-cost-service',
  templateUrl: './service-cost-service.page.html',
  styleUrls: ['./service-cost-service.page.scss'],
})
export class ServiceCostServicePage implements OnChanges, OnDestroy {

  @Input() ContactCode: string = '';
  @Input() ServiceId: string = '';
  @Input() SearchString: string = '';
  @Output('ServiceCostServiceComponent') public ServiceCostServiceComponent: EventEmitter<string> = new EventEmitter<string>();

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
    private serService: ServiceCostIdService,
  ) {
    this.tranService.translaterService();
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ContactCode?.currentValue || changes.ServiceId?.currentValue) {
      this.csvFileName = 'Service Cost Service ' + this.ContactCode + ' ' + this.ServiceId;
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
      this.ServiceCostServiceComponent.emit(event.ServiceId + 'ServiceListNew' + event.ServiceReference);
    }
  }
  
  fetchData(event: Paging): void {
    this.eventParam = {
      CountRecords: 'Y',
      ...event
    };
    this.getServiceList();
  }

  private async getServiceList(): Promise<void> {
    await this.loading.present();

    this.serService.getServiceListByCost(this.ContactCode, this.ServiceId, this.eventParam)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe(async result => {
        await this.loading.dismiss();
        
        if (result === null) {
          this.tranService.errorToastMessage('no_services');
        } else {
          this.dataSource = result.Services;
          this.totalCount = result.Count;
        }

      }, async error => {
        await this.loading.dismiss();
        this.tranService.errorMessage(error);
      });
  }
}
