import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Paging } from 'src/app/model';
import { TranService } from 'src/services';
import { SpinnerService } from 'src/app/Shared/services';
import { DialogComponent } from 'src/app/Shared/components';
import { GlobalService } from 'src/services/global-service.service';
import { DatatableAction, Permission, PermissionType, SearchOption } from 'src/app/Shared/models';
import { ReportsListService } from '../../services/';
import { Report } from '../../models';
import { ReportsInstancesComponent, ReportsRunNowComponent, ReportsRunScehduleComponent, ReportsScheduledsComponent } from '..';

@Component({
  selector: 'app-report-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.scss'],
})
export class ReportsListComponent implements OnChanges, OnDestroy {

  @Input() ContactCode: string = '';

  @Output('myServicesScroll') public myServicesScroll: EventEmitter<string> = new EventEmitter<string>();
  
  dataSource: Report[] = [];  
  totalCount: number;
  columns: string[] = ['Name'];
  dataTableAction: DatatableAction = { row: ['RunSchedule', 'RunNow', 'Instances', 'Schedules'], toolBar: ['Refresh', 'ExportExcel'] };
  searchOptions: SearchOption[] = ['Text'];
  permissions: PermissionType[] = [];
  csvFileName: string;
  
  private eventParam = new Paging();
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private tranService: TranService,
    private reportsListService: ReportsListService,
    private spinnerService: SpinnerService,
    public globService: GlobalService,
    public dialog: MatDialog,
  ) {
    this.tranService.translaterService();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.ContactCode?.currentValue) {
      this.csvFileName = this.tranService.instant('ReportsDefinitions') + " " + this.ContactCode;
      this.getPermission();
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
    this.getReportList();
  }
  
  onRunSchedule(event: Report): void {
    this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '675px',
      maxHeight: '795px',
      panelClass: 'dialog',
      data: {
        component: ReportsRunScehduleComponent,
        ReportId: event.Id,
        ReportMode: 'Request',
        editData: null,
        ReportName: event.Name,
      }
    });
  }

  onRunNow(event: Report): void {
    this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '675px',
      maxHeight: '720px',
      panelClass: 'dialog',
      data: {
        component: ReportsRunNowComponent,
        reportId: event.Id,
        reportName: event.Name
      }
    });
  }

  onInstances(event: Report): void {
    this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '780px',
      maxHeight: '865px',
      panelClass: 'dialog',
      data: {
        component: ReportsInstancesComponent,
        reportId: event.Id,
        reportName: event.Name
      }
    });
  }

  onSchedules(event: Report): void {
    this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '780px',
      maxHeight: '865px',
      panelClass: 'dialog',
      data: {
        component: ReportsScheduledsComponent,
        reportId: event.Id,
        reportName: event.Name
      }
    });
  }

  goBack() {
    this.myServicesScroll.emit('close');
  }
  
  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/Reports', "").replace('/', "") as PermissionType);
  }

  private getPermission(): void {
    this.spinnerService.loading();
    this.globService.getAuthorization('/Reports', true)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => {
          this.spinnerService.end();
          this.formatPermissions(result);
          if (this.permissions.includes('')) {
            this.getReportList();
          } else {
            this.tranService.errorMessage('resource_forbidden');
            setTimeout(() => this.goBack(), 1000);
          }
        },
        error: error => {
          this.spinnerService.end();
          const errResult = this.globService.ConvertKeysToLowerCase(error);
          this.tranService.errorMessage('resource_forbidden');

          if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
            setTimeout(() => this.goBack(), 1000);
          }
        }
      });
  }

  private getReportList(): void {
    this.spinnerService.loading();
    this.reportsListService.getReportList(this.eventParam)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => {
          this.spinnerService.end();
          if (!result || !result.ReportDefinitions) {
            this.tranService.errorToastMessage('no_reports');
          } else {
            this.totalCount = result.Count;
            this.dataSource = result.ReportDefinitions;
          }
        },
        error: error => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      });
  }

}
