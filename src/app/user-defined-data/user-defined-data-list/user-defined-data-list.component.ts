import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { UserDefinedDataListService } from './services/user-defined-data-list.service';
import { UserDefinedData } from '../models/user-defined-data.model';
import { DatatableAction, Permission, PermissionType } from 'src/app/Shared/models';
import { Paging } from 'src/app/model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from 'src/services/alert-service.service';

@Component({
  selector: 'app-user-defined-data-list',
  templateUrl: './user-defined-data-list.component.html',
  styleUrls: ['./user-defined-data-list.component.scss'],
})
export class UserDefinedDataListComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Input() Refresh: Boolean = true;
  @Output('UserDefinedDataListComponent') UserDefinedDataListComponent: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('UsersDefinedDataListGrid') UsersDefinedDataListGrid: jqxGridComponent;
  totalCount: number = 0;
  dataSource: UserDefinedData[] = [];
  columns: string[] = [];
  csvFileName: string = '';
  dataTableAction: DatatableAction = { row: ['Update', 'Delete'], toolBar: ['Create','Refresh', 'ExportExcel'] };
  _showSearchOption: boolean = false;
  permissions: PermissionType[] = [];
  eventParam = new Paging();  

  private unsubscribeAll$: Subject<any> = new Subject<any>();
  private Refresh_: Boolean = true;

  availProcess: boolean = false;
  gridRecords: any = {};


  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private usersService: UserDefinedDataListService,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    
    this.configInitialValues();
  }
  private configInitialValues(): void {    
    this.columns = [
      'Id',
      'Name',
      'Value',
      'Order',
      'CreatedBy',
      'Created',
      'LastUpdated',
      'UpdatedBy'
    ];
  }
  async ngOnInit() {
    this.csvFileName = 'User Defined Data';
    // await this.getGroupList();
    await this.getPermission();
  }

  ngOnChanges(): void {
    if (this.Refresh !== undefined && this.Refresh !== this.Refresh_) {
      this.getGroupList()
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
    this.getGroupList();
  }

  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/Contacts/UserDefinedData', "").replace('/', "") as PermissionType);
  }
  private async getPermission(): Promise<void> {
    await this.loading.present();
    this.globService.getAuthorization('/Contacts/UserDefinedData', true)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (_result) => {
          await this.loading.dismiss();
          this.formatPermissions(_result);
          if (this.permissions.includes('')) {
            this.getGroupList();
          } else {
            await this.loading.dismiss();
            this.tranService.errorMessage('resource_forbidden');
            this.alertService.closeAllAlerts();
            setTimeout(() => {
              this.goBack();
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
              this.goBack();
            }, 1000);
          }
        }
      });
  }

  async getGroupList() {
    this.dataSource = [];
    await this.loading.present();
    this.usersService.getUsersList(this.ContactCode)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result) => {
          await this.loading.dismiss();
          if (result === null) {
            this.tranService.errorMessage('no_data');
          } else {
            this.totalCount = result?.length;
            this.dataSource = result;
          }
        },
        error: async (error: any) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      })

    this.Refresh_ = this.Refresh;
  }
  
  gotoNew() {
    this.UserDefinedDataListComponent.emit('add&&' + JSON.stringify(this.dataSource));
  }

  updateData(data) {
    this.UserDefinedDataListComponent.emit('update&&' + JSON.stringify(data));
  }

  deleteData(data) {
    this.deleteUserById(data.Id);
  }

  goBack() {
    this.UserDefinedDataListComponent.emit('close-list');
  }

  async deleteUserById(Id) {
    await this.loading.present();
    this.usersService.deleteRelatedContactById(this.ContactCode, Id).subscribe(async (result: any) => {
      await this.loading.dismiss();
      this.getGroupList();
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

}
