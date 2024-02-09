import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TranService, LoadingService } from 'src/services';
import { Paging } from 'src/app/model/search/paging';
import { DatatableAction, PermissionType, SearchOption } from 'src/app/Shared/models';
import { ServiceDetail } from './service-list.page.type';
import { ServiceListService } from './services/service-list.service';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.page.html',
  styleUrls: ['./service-list.page.scss'],
})
export class ServiceListPage implements OnInit, OnChanges {

  @Input() ContactCode: string = '';
  @Output('ServiceListComponent') public ServiceListComponent: EventEmitter<string> = new EventEmitter<string>();

  totalCount: number;
  dataSource: ServiceDetail[] = [];
  dataTableAction: DatatableAction = { row: ['Details'], toolBar: ['Refresh', 'ExportExcel'] };
  permissions: PermissionType[] = ['Details', 'Download'];
  searchOptions: SearchOption[] = ['Text'];
  csvFileName = "Service List ";
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
    private serService: ServiceListService,
  ) {
    this.tranService.translaterService();
  }

  ngOnInit() {
    this.getServiceList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.ContactCode.currentValue) {
      this.csvFileName += changes.ContactCode.currentValue;
    }
  }
  
  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  viewDetail(event) {
    if (typeof (event.ServiceReference) !== 'undefined' && typeof (event.ServiceId) !== 'undefined') {
      this.ServiceListComponent.emit(event.ServiceId + 'ServiceListNew' + event.ServiceReference);
    }
  }

  async fetchData(event: Paging): Promise<void> {
    this.eventParam = {
      CountRecords: 'Y',
      ...event
    }
    this.getServiceList();
  }

  async getServiceList() {
    await this.loading.present();
    this.serService.getServiceList(this.ContactCode, this.eventParam)
      .pipe(takeUntil(this.unsubscribeAll$))  
      .subscribe(async result => {
        await this.loading.dismiss();
        
        if (result === null) {
          this.tranService.errorMessage('no_services');
        } else {
          this.dataSource = result.Services.filter(s => typeof (s.ServiceReference) !== 'undefined' && typeof (s.ServiceId) !== 'undefined');
          this.totalCount = this.dataSource.length;
        }

      }, async (error: any) => {
        await this.loading.dismiss();
        
        this.tranService.errorMessage(error);
      });
  }
}
