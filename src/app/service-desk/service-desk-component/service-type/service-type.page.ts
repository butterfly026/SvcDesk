import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Paging } from 'src/app/model';
import { TranService, LoadingService } from 'src/services';
import { DatatableAction, PermissionType, SearchOption } from 'src/app/Shared/models';
import { ServiceTypeService } from './services/service-type.service';
import { ServiceTypeDetail, StatusCount } from './service-type.page.type';

@Component({
  selector: 'app-service-type',
  templateUrl: './service-type.page.html',
  styleUrls: ['./service-type.page.scss'],
})
export class ServiceTypePage implements OnInit {

  @Input() ContactCode: string = '';
  @Output('ServiceTypeComponent') public ServiceTypeComponent: EventEmitter<string> = new EventEmitter<string>();

  ServiceTypeCode: string = '';

  totalCount: number;
  dataSource: ServiceTypeDetail[] = [];
  dataTableAction: DatatableAction = { row: [], toolBar: ['Refresh', 'ExportExcel'] };
  eventParam = new Paging();
  permissions: PermissionType[] = ['Download'];
  csvFileName = "Service Types ";
  columns = ['ServiceType', 'Count', 'StatusCounts'];
  searchOptions: SearchOption[] = ['Text'];

  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private tranService: TranService,
    private loading: LoadingService,
    private serService: ServiceTypeService,
  ) {
    this.tranService.translaterService();
  }

  ngOnInit() {
    this.getServiceListTypes();
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

  dblclickRow(event: ServiceTypeDetail): void {
    this.ServiceTypeCode = event.ServiceTypeCode;
  }

  fetchData(event: Paging): void {
    this.eventParam = {
      CountRecords: 'Y',
      ...event
    }
    this.getServiceListTypes();
  }

  processServiceType(event): void {
    this.ServiceTypeComponent.emit(event);
  }

  private async getServiceListTypes(): Promise<void> {
    await this.loading.present();
    this.serService.getServiceListType(this.ContactCode, this.eventParam)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe(async result => {
        await this.loading.dismiss();
        
        if (result === null) {
          this.tranService.errorMessage('no_services');
        } else {
          this.dataSource = result.ServiceTypeNodes.map(s => ({
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

