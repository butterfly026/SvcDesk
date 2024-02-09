import { Component, Output, EventEmitter, Input, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TranService, LoadingService } from 'src/services';
import { Paging } from 'src/app/model';
import { DatatableAction, PermissionType, SearchOption } from 'src/app/Shared/models';
import { ServiceCostCentreService } from './services/service-cost-centre.service';
import { CostCenterDetail, StatusCount } from './service-cost-centre.page.type';

@Component({
  selector: 'app-service-cost-centre',
  templateUrl: './service-cost-centre.page.html',
  styleUrls: ['./service-cost-centre.page.scss'],
})
export class ServiceCostCentrePage implements OnChanges, OnDestroy {

  @Input() ContactCode: string = '';
  @Output('ServiceCostCenterComponent') ServiceCostCenterComponent: EventEmitter<string> = new EventEmitter<string>();

  ServiceId: number;

  totalCount: number;
  dataSource: CostCenterDetail[] = [];
  dataTableAction: DatatableAction = { row: [], toolBar: ['Refresh', 'ExportExcel'] };
  eventParam = new Paging();
  permissions: PermissionType[] = ['Download'];
  csvFileName = "Service Cost Center ";
  columns = ['Id', 'Name', 'Code', 'Count', 'Status', 'StatusCounts'];
  searchOptions: SearchOption[] = ['Text'];

  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private tranService: TranService,
    private loading: LoadingService,
    private serService: ServiceCostCentreService,
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

  processServiceCostCenter(event) {
    this.ServiceCostCenterComponent.emit(event);
  }

  dblclickRow(event: CostCenterDetail): void {
    if (this.ServiceId !== event.Id) {
      this.ServiceId = event.Id;
    }
  }

  fetchData(event: Paging): void {
    this.eventParam = {
      CountRecords: 'Y',
      ...event
    }
    this.getServiceList();
  }

  async getServiceList() {
    await this.loading.present();

    this.serService.getServiceCost(this.ContactCode, this.eventParam)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe(async result => {
        await this.loading.dismiss();
        
        if (result === null) {
          this.tranService.errorMessage('no_services');
        } else {
          this.dataSource = result.CostCenterNodes.map(s => ({
            ...s,
            StatusCounts: this.formatStatusCounts(s.StatusCounts as StatusCount[])
          }));
          this.totalCount = result.Count;
        }

      }, async error => {
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
