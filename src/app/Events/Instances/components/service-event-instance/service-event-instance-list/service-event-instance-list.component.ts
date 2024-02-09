import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';

import { Paging } from 'src/app/model/search/paging';
import { EventInstance } from 'src/app/Events/Instances/models';
import { LoadingService, TranService } from 'src/services';
import { ContactEventInstanceService, ServiceEventInstanceService } from 'src/app/Events/Instances/services';
import { AlertService } from 'src/services/alert-service.service';
import { GlobalService } from 'src/services/global-service.service';
import { DatatableAction, Permission, PermissionType, SearchOption } from 'src/app/Shared/models';
import { ServiceEventInstanceDetailsComponent, ServiceEventInstanceEdit, ServiceEventInstanceNewComponent } from '../..';

@Component({
  selector: 'app-service-event-instance-list',
  templateUrl: './service-event-instance-list.component.html',
  styleUrls: ['./service-event-instance-list.component.scss'],
})
export class ServiceEventInstanceListComponent implements OnInit, OnDestroy {

  @Input() ServiceReferenceId: number;
  @Input() ServiceId: string;
  @Output() contactEventInstancesList: EventEmitter<string> = new EventEmitter<string>();

  totalCount: number = 0;
  dataSource: EventInstance[] = [];
  columns: string[]
  dataTableAction: DatatableAction = { row: ['Details', 'Update', 'Delete'], toolBar: ['Create', 'Refresh', 'ExportExcel'] };
  eventParam = new Paging();
  permissions: PermissionType[] = [];
  csvFileName: string;
  searchOptions: SearchOption[] = ['Text'];

  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private loading: LoadingService,
    private ContactEventInstancesListService: ContactEventInstanceService,
    private serviceEventInstanceListService: ServiceEventInstanceService,
    private tranService: TranService,
    private alertService: AlertService,
    public globService: GlobalService,
    public dialog: MatDialog,
  ) {
    this.configInitialValues();
    this.tranService.translaterService();
  }

  ngOnInit(): void {
    this.csvFileName = this.tranService.instant('ServiceEventList') + ' ' + this.ServiceReferenceId;
    this.getPermission();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  async fetchData(event: Paging): Promise<void> {
    this.eventParam = {
      CountRecords: 'Y',
      ...event
    }
    await this.loading.present();
    this.getEventList();
  }

  async deleteSelectedRow(data: EventInstance): Promise<void> {
    await this.loading.present();
    this.ContactEventInstancesListService.deleteEvent(data.Id)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (_result) => {
          this.getEventList();
        },
        error: async (err) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(err);
        }
      });
  }

  async addNew(): Promise<void> { 
    const dialogRef = this.dialog.open(ServiceEventInstanceNewComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '600px',
      maxHeight: '600px',
      data: {
        ServiceReferenceId: this.ServiceReferenceId,
        ServiceId: this.ServiceId
      }
    });

    dialogRef.afterClosed().subscribe(async (res) => {
      if (res === 'ok') {
        await this.loading.present();
        this.getEventList()
      }
    })
  }

  async editOne(event: EventInstance): Promise<void> {
    const dialogRef = this.dialog.open(ServiceEventInstanceEdit, {
      width: '100%',
      height: '100%',
      maxWidth: '600px',
      maxHeight: '600px',
      autoFocus: false,
      data: {
        ContactCode: this.ServiceReferenceId,
        eventInstance: event
      }
    });

    dialogRef.afterClosed().subscribe(async (res) => {
      if (res === 'ok') {
        await this.loading.present();
        this.getEventList()
      }
    })
  }

  viewDetail(event: EventInstance): void {
    this.dialog.open(ServiceEventInstanceDetailsComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '600px',
      maxHeight: '600px',
      data: event
    });
  }

  private configInitialValues(): void {
    this.columns = [
      'Id', 'Name', 'Note', 'Due', 'ScheduleStatus', 'StatusDateTime', 'ScheduledBy', 'ScheduledTo', 'DepartmentScheduledTo', 'Reason', 'DefinitionId', 'Code', 'Type', 'CreatedBy', 'Created'
    ];
  }

  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/Services/Events', "").replace('/', "") as PermissionType);
  }

  private async getEventList(): Promise<void> {
    this.serviceEventInstanceListService.getEventList(this.eventParam, this.ServiceReferenceId)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result) =>{
          await this.loading.dismiss();
          if (result === null) {
            this.tranService.errorMessage('no_events');
          } else {
            this.totalCount = result.Count;
            this.dataSource = result.Events.map(s => ({ ...s, RevokedRowActionPermissions: !!s.ScheduleStatus ? null : 'Update' }));
          }
        },
        error: async (error: any) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      })
  }

  private async getPermission(): Promise<void> {
    await this.loading.present();
    this.globService.getAuthorization('/Services/Events', true)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (_result: Permission[]) => {
          this.formatPermissions(_result);
          if (this.permissions.includes('')) {
            this.getEventList();
          } else {
            await this.loading.dismiss();
            this.tranService.errorMessage('resource_forbidden');
            this.alertService.closeAllAlerts();
            setTimeout(() => {
              this.contactEventInstancesList.emit('go-back');
            }, 1000);
          }
        },
        error: async (err) => {
          await this.loading.dismiss();
          const errResult = this.globService.ConvertKeysToLowerCase(err);
          this.tranService.errorMessage('resource_forbidden');

          if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
            this.alertService.closeAllAlerts();
            setTimeout(() => {
              this.contactEventInstancesList.emit('go-back');
            }, 1000);
          }
        }
      });
  }

}
