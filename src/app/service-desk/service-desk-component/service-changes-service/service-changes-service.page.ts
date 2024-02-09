import { takeUntil } from 'rxjs/operators';
import { Component, Input, Output, EventEmitter, OnDestroy, SimpleChanges, OnChanges } from '@angular/core';
import { Subject } from 'rxjs';

import { Paging } from 'src/app/model';
import { TranService, LoadingService } from 'src/services';
import { ServiceChangeIdService } from './services/service-change-id.service';
import { ServiceDetail } from 'src/app/service-desk/service-desk-component/service-list/service-list.page.type';
import { DatatableAction, PermissionType, SearchOption } from 'src/app/Shared/models';

@Component({
  selector: 'app-service-changes-service',
  templateUrl: './service-changes-service.page.html',
  styleUrls: ['./service-changes-service.page.scss'],
})
export class ServiceChangesServicePage implements OnChanges, OnDestroy {

  @Input() ContactCode: string = '';
  @Input() ChangeId: string = '';
  @Input() From: string = '';
  @Input() SearchString: string = '';
  @Input() ChangesSubject: Subject<any> = new Subject<any>();
  @Output('ServiceChangesServiceComponent') ServiceChangesServiceComponent: EventEmitter<string> = new EventEmitter<string>();

  totalCount: number;
  dataSource: ServiceDetail[] = [];
  dataTableAction: DatatableAction = { row: ['Details'], toolBar: ['Refresh', 'ExportExcel'] };
  permissions: PermissionType[] = ['Details', 'Download'];
  searchOptions: SearchOption[] = ['Text'];
  csvFileName = "";
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
    private serService: ServiceChangeIdService,
  ) {
    this.tranService.translaterService();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ContactCode?.currentValue || changes.ChangeId?.currentValue || changes.From?.currentValue) {
      this.csvFileName = 'Service Changes Service ' + this.ContactCode + ' ' + this.ChangeId + ' ' + this.From;
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
  
  viewDetail(event: ServiceDetail) {
    if (typeof (event.ServiceReference) !== 'undefined' && typeof (event.ServiceId) !== 'undefined') {
      this.ServiceChangesServiceComponent.emit(event.ServiceId + 'ServiceListNew' + event.ServiceReference);
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
    const reqData = {
      ...this.eventParam,
      From: this.From,
    };
    
    this.serService.getChangesServiceList(this.ContactCode, this.ChangeId, reqData)
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