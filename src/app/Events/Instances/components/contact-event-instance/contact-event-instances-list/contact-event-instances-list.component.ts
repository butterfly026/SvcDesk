import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import{ Paging } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { AlertService } from 'src/services/alert-service.service';
import { ContactEventInstanceService } from 'src/app/Events/Instances/services';
import { EventInstance } from 'src/app/Events/Instances/models';
import { ContactEventInstanceDetailsComponent, ContactEventInstanceEdit, ContactEventInstanceNew } from '../..';
import { DatatableAction, Permission, PermissionType, SearchOption } from 'src/app/Shared/models';

@Component({
  selector: 'app-event-list',
  templateUrl: './contact-event-instances-list.component.html',
  styleUrls: ['./contact-event-instances-list.component.scss'],
})

export class ContactEventInstancesList implements OnInit,OnChanges, OnDestroy {
  @Input() ContactCode: string = '';
  @Input() Refresh: Boolean = true;
  @Output() contactEventInstancesList: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('EventListGrid') EventListGrid: jqxGridComponent;

  totalCount: number = 0;
  dataSource: EventInstance[] = [];
  columns: string[]
  dataTableAction: DatatableAction = { row: ['Details', 'Update', 'Delete'], toolBar: ['Create', 'Refresh', 'ExportExcel'] };
  eventParam = new Paging();
  permissions: PermissionType[] = [];
  csvFileName: string;
  searchOptions: SearchOption[] = ['Text'];

  private unsubscribeAll$: Subject<any> = new Subject<any>();
  private Refresh_: Boolean = true;

  constructor(
    private loading: LoadingService,
    private ContactEventInstancesListService: ContactEventInstanceService,
    private tranService: TranService,
    private alertService: AlertService,
    public globService: GlobalService,
    public dialog: MatDialog,
  ) {
    this.configInitialValues();
    this.tranService.translaterService();
  }

  ngOnInit(): void {
    this.csvFileName =  this.tranService.instant('ContactEventList') + ' ' + this.ContactCode;
    this.getPermission();
  }

  async ngOnChanges(): Promise<void> {
    if (this.Refresh !== undefined && this.Refresh !== this.Refresh_) {
      await this.loading.present();
      this.getEventList()
    }
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
    const dialogRef = this.dialog.open(ContactEventInstanceNew, {
      width: '100%',
      height: '100%',
      maxWidth: '600px',
      maxHeight: '600px',
      data: {
        ContactCode: this.ContactCode
      }
    });

    dialogRef.afterClosed().subscribe(async (res) => {
      if (res === 'ok') {
        await this.loading.present();
        this.getEventList()
        this.Refresh = !this.Refresh;
      }
    })
  }

  async editOne(event: EventInstance): Promise<void> {
    const dialogRef = this.dialog.open(ContactEventInstanceEdit, {
      width: '100%',
      height: '100%',
      maxWidth: '600px',
      maxHeight: '570px',
      autoFocus: false,
      data: {
        ContactCode: this.ContactCode,
        eventInstance: event
      }
    });

    dialogRef.afterClosed().subscribe(async (res) => {
      if (res === 'ok') {
        await this.loading.present();
        this.getEventList()
        this.Refresh = !this.Refresh;
      }
    })
  }

  viewDetail(event: EventInstance): void {
    this.dialog.open(ContactEventInstanceDetailsComponent, {
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

  private async getEventList(): Promise<void> {
    this.ContactEventInstancesListService.getEventList(this.eventParam, this.ContactCode)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result) =>{
          await this.loading.dismiss();
          if (result === null) {
            this.tranService.errorMessage('no_events');
          } else {
            this.totalCount = result.Count;
            this.dataSource = result.Events.map(s => ({ ...s, RevokedRowActionPermissions: !!s.ScheduleStatus ? null : 'Update', }));
          }
        },
        error: async (error: any) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      })

    this.Refresh_ = this.Refresh;
  }

  private async getPermission(): Promise<void> {
    await this.loading.present();
    this.globService.getAuthorization('/Contacts/Events', true)
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

  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/Contacts/Events', "").replace('/', "") as PermissionType);
  }
}

