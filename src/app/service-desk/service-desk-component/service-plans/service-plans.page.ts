import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Paging } from 'src/app/model';
import { TranService, LoadingService } from 'src/services';
import { ServicePlansService } from './services/service-plans.service';
import { DatatableAction, PermissionType, SearchOption } from 'src/app/Shared/models';
import { ServicePlanDetail } from './service-plans.page.type';

@Component({
  selector: 'app-service-plans',
  templateUrl: './service-plans.page.html',
  styleUrls: ['./service-plans.page.scss'],
})
export class ServicePlansPage implements OnInit, OnChanges, OnDestroy {

  @Input() ContactCode: string = '';
  @Output('ServicePlansComponent') public ServicePlansComponent: EventEmitter<string> = new EventEmitter<string>();

  selectedPlanId: number = null;

  totalCount: number;
  dataSource: ServicePlanDetail[] = [];
  dataTableAction: DatatableAction = { row: [], toolBar: ['Refresh', 'ExportExcel'] };
  eventParam = new Paging();
  permissions: PermissionType[] = ['Download'];
  csvFileName = "Service Plans ";
  columns = ['Id', 'Plan', 'Count'];
  searchOptions: SearchOption[] = ['Text'];

  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private tranService: TranService,
    private loading: LoadingService,
    private serService: ServicePlansService,
  ) {
    this.tranService.translaterService();
  }

  ngOnInit(): void {
    this.getServiceChangeList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ContactCode.currentValue) {
      this.csvFileName += changes.ContactCode.currentValue;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  dblclickRow(event: ServicePlanDetail): void {
    if (event.Id) {
      if (!!this.selectedPlanId && this.selectedPlanId !== event.Id) {
        this.selectedPlanId = event.Id;
      } else {
        this.selectedPlanId = event.Id;
      }
    }
  }

  fetchData(event: Paging): void {
    this.eventParam = {
      CountRecords: 'Y',
      ...event
    }
    this.getServiceChangeList();
  }

  private async getServiceChangeList(): Promise<void> {
    await this.loading.present();
   
    this.serService.getPlansList(this.ContactCode, this.eventParam)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe(async result => {
        await this.loading.dismiss();
        
        if (result === null) {
          this.tranService.errorMessage('no_services');
        } else {
          if (result.PlanNodes !== null) {
            this.dataSource = result.PlanNodes;
            this.totalCount = result.Count;
          }
        }

      }, async (error: any) => {
        await this.loading.dismiss();
        this.tranService.errorMessage(error);
      });
  }

  processChanges(event): void {
    this.ServicePlansComponent.emit(event);
  }
}

