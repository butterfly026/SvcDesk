import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Paging } from 'src/app/model';
import { TranService, LoadingService } from 'src/services';
import { ServiceDetail } from 'src/app/service-desk/service-desk-component/service-list/service-list.page.type';
import { DatatableAction, PermissionType, SearchOption } from 'src/app/Shared/models';
import { ServicePlansIdService } from './services/service-planid-service.service';

@Component({
  selector: 'app-service-plans-service',
  templateUrl: './service-plans-service.page.html',
  styleUrls: ['./service-plans-service.page.scss'],
})
export class ServicePlansServicePage implements OnChanges, OnDestroy {

  @Input() ContactCode: string = '';
  @Input() PlanId: string = '';
  @Input() SearchString: string = '';
  @Output('ServicePlansServiceComponent') ServicePlansServiceComponent: EventEmitter<string> = new EventEmitter<string>();

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
    private serService: ServicePlansIdService,
  ) {
    this.tranService.translaterService();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ContactCode?.currentValue || changes.PlanId?.currentValue) {
      this.csvFileName = 'Service Plans Service ' + this.ContactCode + ' ' + this.PlanId;
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
      this.ServicePlansServiceComponent.emit(event.ServiceId + 'ServiceListNew' + event.ServiceReference);
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

    this.serService.getPlansIdList(this.ContactCode, this.PlanId, this.eventParam)
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
