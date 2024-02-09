import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { ComponentOutValue, Paging } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { ServiceTasksListService } from './services/service-task-list.service';
import { DatatableAction, Permission, PermissionType, SearchOption } from 'src/app/Shared/models';
import { Subject } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from 'src/services/alert-service.service';
import { Status } from '../../account-task-lists/account-task-list.types';
import { AccountTasksListService } from '../../account-task-lists/services/task-list.service';

@Component({
  selector: 'app-service-task-list',
  templateUrl: './service-task-list.component.html',
  styleUrls: ['./service-task-list.component.scss'],
})
export class ServiceTaskListComponent implements OnInit {
  @Input() ServiceReference: string = '';
  @Input() ServiceID: string = '';
  @Input() Refresh: Boolean = true; 
  @Output('ServiceTaskListComponent') ServiceTaskListComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  tasks: any[] = [];
  totalCount: number = 0;
  columns: string[] = [];
  columnIDs: string[] = [];
  dataTableAction: DatatableAction = {  row: ['Update', 'Details', 'Delete'], toolBar: ['Create','Refresh', 'ExportExcel'] };
  _showSearchOption: boolean = false;
  permissions: PermissionType[] = [];
  searchOptions: SearchOption[] = ['Text', 'From', 'To', 'Uninvoiced'];
  csvFileName: string = '';

  eventParam = new Paging();  
  private unsubscribeAll$: Subject<any> = new Subject<any>();
  private Refresh_: Boolean = true;

  groupForm: UntypedFormGroup;
  statusList: Status[] = [];

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    public globService: GlobalService,
    private alertService: AlertService, 
    private taskService: ServiceTasksListService,
    private accountTaskService: AccountTasksListService,
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
      'Number',
      'Type',
      'Status',
      'Priority',
      'ShortDescription',
      'ShortResolution',
      'RequestedBy',
      'Reference',
      'RequiredDate',
      'CustomerRequestedDate',     
      'CreatedBy',
      'Created',
      'UpdatedBy',
      'Updated',
    ];
  }

  ngOnInit() {    
    this.csvFileName = 'Customer Task List - ' + this.ServiceID;
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
    this.permissions = value.map(s => s.Resource.replace('/Services/Tasks', "").replace('/', "") as PermissionType);
  }
  async getPermission(){
    await this.loading.present();
    this.globService.getAuthorization('/Services/Tasks', true).subscribe(async (_result) => {
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
    this.taskService.getTasksList(this.ServiceReference, tempParam)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result) => {
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
    this.ServiceTaskListComponent.emit({ type: 'close' });
  }

  goToNew() {
    this.ServiceTaskListComponent.emit({ type: 'create' });
  }

  viewTaskDetail(task){

  }
  editTask(task){

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
    this.accountTaskService.getStatuses()
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
