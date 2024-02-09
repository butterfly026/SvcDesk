import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { ComponentOutValue, Paging } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { AccountTasksListService } from '../services/task-list.service';
import { Subject } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { AlertService } from 'src/services/alert-service.service';
import { takeUntil } from 'rxjs/operators';
import { DatatableAction, Permission, PermissionType, SearchOption } from 'src/app/Shared/models';
import { MatDialog } from '@angular/material/dialog';
import { AccountTaskNewComponent } from '../account-task-new/account-task-new.component';
import { DialogComponent } from 'src/app/Shared/components';
import { AccountTaskItem, AccountTaskResponse } from '../account-task-list.types';
import { Status } from '../account-task-list.types';

@Component({
  selector: 'app-account-task-list',
  templateUrl: './account-task-list.component.html',
  styleUrls: ['./account-task-list.component.scss'],
})
export class AccountTaskListComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Input() Refresh: Boolean = true; 
  
  @Output('AccountTaskListComponent') AccountTaskListComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();
  
  tasks: any[] = [];
  totalCount: number = 0;
  columns: string[] = [];
  columnIDs: string[] = [];
  dataTableAction: DatatableAction = { row: ['Update', 'Details', 'Delete'], toolBar: ['Create','Refresh', 'ExportExcel'] };
  _showSearchOption: boolean = false;
  permissions: PermissionType[] = [];
  searchOptions: SearchOption[] = ['Text', 'From','To', 'Uninvoiced'];
  csvFileName: string = '';
  statusList: Status[] = [];

  eventParam = new Paging();  
  private unsubscribeAll$: Subject<any> = new Subject<any>();
  private Refresh_: Boolean = true;

  groupForm: UntypedFormGroup;
  

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    public globService: GlobalService,
    private alertService: AlertService,    
    private dialog: MatDialog,
    private taskService: AccountTasksListService,
    private formBuilder: UntypedFormBuilder,
  ) {
    this.tranService.translaterService();
    this.configInitialValues();
    this.getStatuses();
    this.groupForm = this.formBuilder.group({
      Status: [],
    });
    this.groupForm.get('Status').valueChanges.subscribe((result: any) => {
      this.getTaskList();
    });
  }

  configInitialValues(){
    this.columns = [
      'Id',
      'Number',
      'ServiceId',
      'ServiceReference',
      'Type',
      'Status',
      'Priority',
      'ShortDescription',
      'ShortResolution',
      'RequestedBy',
      'RequiredDate',
      'CustomerRequestedDate',
      'CreatedBy',
      'Created',
      'UpdatedBy',
      'Updated',
    ];
  }
  
  ngOnInit() {    
    this.csvFileName = 'Account Tasks - ' + this.ContactCode;
    this.getPermission();
  }

  ngOnChanges(): void {
    if (this.Refresh !== undefined && this.Refresh !== this.Refresh_) {
      this.getTaskList()
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
    this.getTaskList();
  }
  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/Contacts/Tasks', "").replace('/', "") as PermissionType);
  }
  async getPermission(){
    await this.loading.present();
    this.globService.getAuthorization('/Contacts/Tasks', true).subscribe(async (_result) => {
      await this.loading.dismiss();      
      this.formatPermissions(_result);
      if (this.permissions.includes('')) {
        this.getTaskList();
      } else {
        await this.loading.dismiss();
        this.tranService.errorMessage('resource_forbidden');
        this.alertService.closeAllAlerts();
        setTimeout(() => {
          this.goBack();
        }, 1000);
      }
    }, async (err) => {
      await this.loading.dismiss();
      const errResult = this.globService.ConvertKeysToLowerCase(err);
      this.tranService.errorMessage('resource_forbidden');
      console.log('errResult', errResult);
      if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
        this.alertService.closeAllAlerts();        
        setTimeout(() => {
          this.goBack();
        }, 1000);
      } else {
        
      }
    });
  }

  async getTaskList() {
    await this.loading.present();
    var tempParam;
    if (this.ShowSearchOption && this.groupForm.get('Status').value !== null) {
      tempParam = {
        ...this.eventParam,
        StatusId: this.groupForm.get('Status').value,
      };
    } else {
      tempParam = this.eventParam;
    }

    this.taskService.getTasksList(this.ContactCode, tempParam)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result: AccountTaskResponse) => {
          await this.loading.dismiss();
          if (result === null) {
            this.tranService.errorMessage('no_data');
          } else {
            this.totalCount = result.Count;
            this.tasks = result.Items;
          }
        },
        error: async (error: any) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      })

    this.Refresh_ = this.Refresh;
  }

  
  goBack() {
    this.AccountTaskListComponent.emit({ type: 'close' });
  }

  goToNew() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '850px',
      maxHeight: '650px',
      panelClass: 'dialog',
      data: {
        component: AccountTaskNewComponent,
        EditMode: 'New',
        IsModal: true,
        ContactCode: this.ContactCode
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == 'ok') {
        this.getTaskList();
      }
    });
    
  }

  goToUpdate() {
    // this.AccountTaskListComponent.emit({ type: 'update', data: this.selectedData?.id });
  }
  
  viewTaskDetail(task: AccountTaskItem){
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '850px',
      maxHeight: '650px',
      panelClass: 'dialog',
      data: {
        component: AccountTaskNewComponent,
        EditMode: 'Detail',
        IsModal: true,
        TaskId: task.Id,
        ContactCode: this.ContactCode
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == 'ok') {
        this.getTaskList();
      }
    });

  }
  editTask(task){
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '850px',
      maxHeight: '650px',
      panelClass: 'dialog',
      data: {
        component: AccountTaskNewComponent,
        EditMode: 'Update',
        IsModal: true,
        TaskId: task.Id,
        ContactCode: this.ContactCode
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == 'ok') {
        this.getTaskList();
      }
    });

  }
  async delelteTask(selectedData) {
    await this.loading.present();
    try {
      const result = await this.taskService.deleteTask(selectedData.Id).toPromise();
      await this.loading.dismiss();
      this.getTaskList();
    } catch (error) {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    }
  }

  private async getStatuses(){
    this.taskService.getStatuses()
      .subscribe({
        next: async (result) => {
          this.statusList = result;
        },
        error: async (error: any) => {
          this.tranService.errorMessage(error);
        }
      });
  }

  showHideSearchOption(val){
    this._showSearchOption = val;
  }
  get ShowSearchOption(){
    return this._showSearchOption;
  }
}
