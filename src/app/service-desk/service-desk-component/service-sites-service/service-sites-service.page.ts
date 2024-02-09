import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Paging } from 'src/app/model';
import { TranService, LoadingService } from 'src/services';
import { ServiceDetail } from './../service-list/service-list.page.type';
import { ServiceSiteIdService } from './services/sites-service.service';
import { DatatableAction, PermissionType, SearchOption } from 'src/app/Shared/models';

@Component({
  selector: 'app-service-sites-service',
  templateUrl: './service-sites-service.page.html',
  styleUrls: ['./service-sites-service.page.scss'],
})
export class ServiceSitesServicePage implements OnChanges, OnDestroy {

  @Input() ContactCode: string = '';
  @Input() SiteId: string = '';
  @Input() SearchString: string = '';
  @Output('ServiceSitesServiceComponent') public ServiceSitesServiceComponent: EventEmitter<string> = new EventEmitter<string>();
  
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
    private serService: ServiceSiteIdService,
  ) {
    this.tranService.translaterService();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ContactCode?.currentValue || changes.SiteId?.currentValue) {
      this.csvFileName = 'Service Site Service ' + this.ContactCode + ' ' + this.SiteId;
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
      this.ServiceSitesServiceComponent.emit(event.ServiceId + 'ServiceListNew' + event.ServiceReference);
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

    this.serService.getServiceSitesServiceList(this.ContactCode, this.SiteId, this.eventParam)
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