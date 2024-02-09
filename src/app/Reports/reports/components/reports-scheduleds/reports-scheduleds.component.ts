import { Component, OnInit, Output, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ComponentOutValue, Paging } from 'src/app/model';
import { TranService } from 'src/services';
import { SpinnerService } from 'src/app/Shared/services';
import { DatatableAction, Permission, PermissionType, SearchOption } from 'src/app/Shared/models';
import { GlobalService } from 'src/services/global-service.service';
import { AlertService } from 'src/services/alert-service.service';
import { ShceduledReport, ScheduleParam } from '../../models';
import { ReportsScheduledService } from '../../services';

@Component({
  selector: 'app-reports-scheduled',
  templateUrl: './reports-scheduleds.component.html',
  styleUrls: ['./reports-scheduleds.component.scss'],
})
export class ReportsScheduledsComponent implements OnInit, OnDestroy {

  @Output('ScheduledReportComponent') public ScheduledReportComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  dataSource: ShceduledReport[] = [];  
  totalCount: number;
  columns: string[] = ['Id', 'Name', 'Comments', 'From', 'To', 'Created', 'CreatedBy'];
  columnsUsedForWrap: string[] = ['Comments'];
  dataTableAction: DatatableAction = { row: ['Delete'], toolBar: ['Refresh', 'ExportExcel'] };
  searchOptions: SearchOption[] = ['Text'];
  permissions: PermissionType[] = [];
  csvFileName: string = '';
  
  private eventParam = new Paging();
  private unsubscribeAll$: Subject<any> = new Subject<any>();
  private scheduleParam: ScheduleParam = {
    DefinitionId: '',
    IncludeParameters: true,
    IncludeEmails: true,
    SkipRecords: 0,
    TakeRecords: 10,
    CountRecords: 'Y',
  };

  constructor(
    public navCtrl: NavController,
    private spinnerService: SpinnerService,
    private tranService: TranService,
    private alertService: AlertService,
    private scheduledReportService: ReportsScheduledService,    
    public globService: GlobalService,
    private dialogRef: MatDialogRef<ReportsScheduledsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { reportId: string; reportName: string  }
  ) {}

  ngOnInit(): void {
    this.csvFileName = this.tranService.instant('ScheduledReports') +' '+ this.data.reportId;
    this.getPermission();
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
    this.getScheduledList();
  }

  deleteSelectedRow(event: ShceduledReport): void {
    this.spinnerService.loading();
    this.scheduledReportService.deleteScheduleReport(event.Id)
    .pipe(takeUntil(this.unsubscribeAll$))
    .subscribe({
      next: () => {
        this.spinnerService.end();
        this.getScheduledList();
      },
      error: error => {
        this.spinnerService.end();
        this.tranService.errorMessage(error);
      }
    });
  }

  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/Reports/Schedule', "").replace('/', "") as PermissionType);
  }

  private getPermission(): void {
    this.spinnerService.loading();
    this.globService.getAuthorization('/Reports/Schedule', true)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => {
          this.spinnerService.end();
          this.formatPermissions(result);
          if (this.permissions.includes('')) {
            this.getScheduledList();
          } else {
            this.tranService.errorMessage('resource_forbidden');
            this.alertService.closeAllAlerts();
            setTimeout(() => this.dialogRef.close(), 1000);
          }
        },
        error: err => {
          this.spinnerService.end();
          const errResult = this.globService.ConvertKeysToLowerCase(err);
          this.tranService.errorMessage('resource_forbidden');

          if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
            this.alertService.closeAllAlerts();
            setTimeout(() => this.dialogRef.close(), 1000);
          }
        }
      });
  }

  private getScheduledList(): void {
    this.spinnerService.loading();    
    this.scheduleParam = {
      DefinitionId: this.data.reportId,
      IncludeParameters: true,
      IncludeEmails: true,
      ...this.eventParam
    };    

    this.scheduledReportService.getScheduleReportList(this.data.reportId, this.scheduleParam)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => {
          this.spinnerService.end();
          if (!result || !result.Reports) {
            this.tranService.errorToastMessage('no_schedules');
          } else {
            this.totalCount = result.Count;
            this.dataSource = result.Reports;
          }
        },
        error: error => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      });
  }
}
