import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TranService } from 'src/services';
import { Paging } from 'src/app/model';
import { DatatableService, SpinnerService } from 'src/app/Shared/services';
import { DialogComponent } from 'src/app/Shared/components';
import { DatatableAction, Permission, PermissionType, SearchOption } from 'src/app/Shared/models';
import { GlobalService } from 'src/services/global-service.service';
import { InstanceParam, ReportInstance } from '../../models';
import { ReportsInstancesService } from '../../services/reports-instances.service';
import { ReportsInstancesViewComponent } from '..';

@Component({
  selector: 'app-reports-instances',
  templateUrl: './reports-instances.component.html',
  styleUrls: ['./reports-instances.component.scss'],
})
export class ReportsInstancesComponent implements OnInit {
  
  dataSource: ReportInstance[] = [];  
  totalCount: number;
  dataTableAction: DatatableAction = { row: ['Details', 'Download', 'Delete'], toolBar: ['Refresh', 'ExportExcel'] };
  columns: string[] = ['Id', 'Name', 'Status', 'StatusDateTime', 'Created', 'CreatedBy'];
  searchOptions: SearchOption[] = ['Text'];
  permissions: PermissionType[] = [];
  csvFileName: string = '';

  private eventParam = new Paging();
  private unsubscribeAll$: Subject<any> = new Subject<any>();
  private InstanceParam: InstanceParam = {
    DefinitionId: '',
    IncludeParameters: true,
    IncludeEmails: true,
    SkipRecords: 0,
    TakeRecords: 10,
    CountRecords: 'Y',
  };

  constructor(
    public navCtrl: NavController,
    private tranService: TranService,
    private spinnerService: SpinnerService,
    private reportsInstancesService: ReportsInstancesService,
    private dataTableService: DatatableService,
    public globService: GlobalService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ReportsInstancesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { reportName: string; reportId: string; }
  ) {
    this.tranService.translaterService();
  }

  ngOnInit(): void {
    this.csvFileName = this.tranService.instant('ReportInstances') + ' ' + this.data.reportId;
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

  viewDetail(event: ReportInstance): void {
    this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '600px',
      maxHeight: '600px',
      panelClass: 'dialog',
      data: {
        component: ReportsInstancesViewComponent,
        data: event
      }
    });
  }

  deleteSelectedRow(event: ReportInstance): void {
    this.spinnerService.loading();
    this.reportsInstancesService.deleteReportInstance(event.Id)
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

  downloadDocument(event: ReportInstance): void {
    this.spinnerService.loading();
    this.reportsInstancesService.downloadReportInstance(event.Id)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async result => {
          this.spinnerService.end();
          !!result?.Content 
            ? this.dataTableService.saveDocument(result.Content, result.FileName, result.FileType) 
            : this.tranService.errorToastMessage('NoDocuments');
        }, 
        error: async error => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      });
  }

  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/Reports/Instances', "").replace('/', "") as PermissionType);
  }

  private getPermission(): void {
    this.spinnerService.loading();
    this.globService.getAuthorization('/Reports/Instances', true)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => {
          this.spinnerService.end();
          this.formatPermissions(result);
          if (this.permissions.includes('')) {
            this.getScheduledList();
          } else {
            this.spinnerService.end();
            this.tranService.errorMessage('resource_forbidden');
            setTimeout(() => this.dialogRef.close(), 1000);
          }
        },
        error: error => {
          this.spinnerService.end();
          const errResult = this.globService.ConvertKeysToLowerCase(error);
          this.tranService.errorMessage('resource_forbidden');

          if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
            setTimeout(() => this.dialogRef.close(), 1000);
          }
        }
      });
  }

  private getScheduledList(): void {
    this.spinnerService.loading();
    this.InstanceParam = {
      DefinitionId: this.data.reportId,
      IncludeParameters: true,
      IncludeEmails: true,
      ...this.eventParam
    };    

    this.reportsInstancesService.getReportInstancesForDefinition(this.data.reportId, this.InstanceParam)
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
