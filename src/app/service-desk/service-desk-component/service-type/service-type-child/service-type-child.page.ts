import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, SimpleChanges, OnChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Paging } from 'src/app/model';
import { TranService, LoadingService } from 'src/services';
import { ServiceDetail } from 'src/app/service-desk/service-desk-component/service-list/service-list.page.type';
import { DatatableAction, PermissionType, SearchOption } from 'src/app/Shared/models';
import { ServiceTypeChildService } from './services/service-type-child.service';

@Component({
  selector: 'app-service-type-child',
  templateUrl: './service-type-child.page.html',
  styleUrls: ['./service-type-child.page.scss'],
})
export class ServiceTypeChildPage implements OnInit, OnChanges, OnDestroy {

  @Input() ContactCode: string = '';
  @Input() ServiceTypeCode: string = '';
  @Input() SearchString: string = '';
  @Output('ServiceTypeServiceComponent') ServiceTypeServiceComponent: EventEmitter<string> = new EventEmitter<string>();

  totalCount: number;
  dataSource: ServiceDetail[] = [];
  dataTableAction: DatatableAction = { row: ['Details'], toolBar: ['Refresh', 'ExportExcel'] };
  permissions: PermissionType[] = ['Details', 'Download'];
  searchOptions: SearchOption[] = ['Text'];
  csvFileName = "Service Type Child ";
  columns = [
    'ServiceId', 
    'ServiceType', 
    'UserLabel', 
    'Status', 
    'Plan', 
    'PlanOption', 
    'Connected', 
    'DisConnected', 
    'PlanId', 
    'PlanOptionId', 
    'ServiceReference', 
    'StatusCode'
  ];

  private eventParam = new Paging();
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private tranService: TranService,
    private loading: LoadingService,
    private serService: ServiceTypeChildService,
  ) {
    this.tranService.translaterService();
  }

  ngOnInit(): void {
    this.getServiceList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      !!changes.ContactCode?.currentValue || 
      !!changes.ServiceTypeCode?.currentValue || 
      !!changes.SearchString?.currentValue
    ) {
      if (!!this.ContactCode && !!this.ServiceTypeCode) {
        this.csvFileName = this.csvFileName + this.ContactCode + ' ' + this.ServiceTypeCode;
      }

      if (!!this.SearchString) {
        this.eventParam.SearchString = this.SearchString;
      }
      this.getServiceList();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  fetchData(event: Paging): void {
    this.eventParam = {
      CountRecords: 'Y',
      ...event
    }
    this.getServiceList();
  }

  viewDetail(event: ServiceDetail): void {
    if (typeof (event.ServiceReference) !== 'undefined' && typeof (event.ServiceId) !== 'undefined') {
      this.ServiceTypeServiceComponent.emit(event.ServiceId + 'ServiceListNew' + event.ServiceReference);
    }
  }

  private async getServiceList(): Promise<void> {
    await this.loading.present();

    this.serService.getServiceList(this.ContactCode, this.ServiceTypeCode, this.eventParam)
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
