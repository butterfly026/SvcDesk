import { Component, Input, Output, EventEmitter,  SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Paging } from 'src/app/model';
import { TranService, LoadingService } from 'src/services';
import { ServiceSitesService } from './services/service-sites.service';
import { SiteDetail } from './service-sites.page.type';
import { DatatableAction, PermissionType, SearchOption } from 'src/app/Shared/models';

@Component({
  selector: 'app-service-sites',
  templateUrl: './service-sites.page.html',
  styleUrls: ['./service-sites.page.scss'],
})
export class ServiceSitesPage implements OnChanges, OnDestroy {

  @Input() ContactCode: string = '';

  @Output('ServiceSitesComponent') public ServiceSitesComponent: EventEmitter<string> = new EventEmitter<string>();

  SiteId: number;

  totalCount: number;
  dataSource: SiteDetail[] = [];
  dataTableAction: DatatableAction = { row: [], toolBar: ['Refresh', 'ExportExcel'] };
  eventParam = new Paging();
  permissions: PermissionType[] = ['Download'];
  csvFileName = "Service Sites ";
  columns = ['Id', 'Name', 'Count', 'Status', 'StatusCounts'];
  searchOptions: SearchOption[] = ['Text'];

  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private tranService: TranService,
    private loading: LoadingService,
    private serService: ServiceSitesService,
  ) {
    this.tranService.translaterService();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.ContactCode?.currentValue) {
      this.csvFileName += changes.ContactCode.currentValue;
      this.getServiceListTypes();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }


  processSites(event): void {
    this.ServiceSitesComponent.emit(event);
  }

  dblclickRow(event: SiteDetail): void {
    if (this.SiteId !== event.Id) {
      this.SiteId = event.Id;
    }
  }

  fetchData(event: Paging): void {
    this.eventParam = {
      CountRecords: 'Y',
      ...event
    }
    this.getServiceListTypes();
  }

  private async getServiceListTypes(): Promise<void> {
    await this.loading.present();

    this.serService.getSitesList(this.ContactCode, this.eventParam)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe(async result => {
        await this.loading.dismiss();
        
        if (result === null) {
          this.tranService.errorMessage('no_services');
        } else {
          this.dataSource = result.SiteNodes;
          this.totalCount = result.Count;
        }

      }, async error => {
        await this.loading.dismiss();
        this.tranService.errorMessage(error);
      });
  }
}

