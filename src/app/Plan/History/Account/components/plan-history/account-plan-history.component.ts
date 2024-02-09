import { Component, EventEmitter, Input, Output, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TranService, LoadingService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { DatatableAction, Permission, PermissionType, PlanInstance } from 'src/app/Shared/models';
import { Paging } from 'src/app/model';
import { AlertService } from 'src/services/alert-service.service';
import { DialogComponent } from 'src/app/Shared/components';
import { AccountPlanService } from '../../services';
import { AccountPlanDetailComponent, AccountPlanNewComponent } from '..';


@Component({
  selector: 'app-account-plan-history',
  templateUrl: './account-plan-history.component.html',
  styleUrls: ['./account-plan-history.component.scss'],
})
export class AccountPlanHistoryComponent implements OnChanges, OnDestroy {
  @Input() ContactCode: string = ''; 
  @Output('AccountPlanHistoryComponent') public AccountPlanHistoryComponent: EventEmitter<string> = new EventEmitter<string>();

  totalCount: number = 0;
  dataSource: PlanInstance[] = [];
  columns = ['PlanType', 'Plan', 'Option', 'Status', 'From', 'To', 'LastUpdated', 'UpdatedBy'];
  dataTableAction: DatatableAction = { row: ['Details'], toolBar: ['Create', 'Refresh', 'ExportExcel'] };
  eventParam = new Paging();
  permissions: PermissionType[] = ['Details', 'Update', 'Delete', 'New'];
  csvFileName: string;

  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private tranService: TranService,
    private loading: LoadingService,
    private accountPlanService: AccountPlanService,
    private dialog: MatDialog,
    private alertService: AlertService,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.ContactCode?.currentValue) {
      this.csvFileName = this.tranService.instant('AccountPlanHistory') + ' ' + this.ContactCode;

      this.getPermission();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  viewDetail(data: PlanInstance): void {
    this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '650px',
      maxHeight: '750px',
      panelClass: 'dialog',
      data: {
        component: AccountPlanDetailComponent,
        accountPlanInstance: data,
      }
    });
  }

  addNew():void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '600px',
      maxHeight: '780px',
      panelClass: 'dialog',
      data: {
        component: AccountPlanNewComponent,
        contactCode: this.ContactCode
      }
    });

    dialogRef.afterClosed().subscribe(async (res) => {
      if (res === 'ok') {
        await this.loading.present();
        this.getAccountPlans()
      }
    })
  }

  async fetchData(event: Paging): Promise<void> {
    this.eventParam = {
      CountRecords: 'Y',
      ...event
    }
    await this.loading.present();
    this.getAccountPlans();
  }

  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/Accounts/Plans', "").replace('/', "") as PermissionType);
  }

  private async getAccountPlans() {
     this.accountPlanService.getAccountPlans(this.ContactCode)
     .pipe(takeUntil(this.unsubscribeAll$))
     .subscribe({
      next: async (result: any) => {
        await this.loading.dismiss();
        if (result === null) {
          this.tranService.errorMessage('no_account_plan');
        } else {   
          this.totalCount = result.length;    
          this.dataSource = result;             
        }
      },
      error: async (error: any) => {
        await this.loading.dismiss();      
        this.tranService.errorMessage(error);
      }
     });
  }

  private async getPermission(): Promise<void> {
    await this.loading.present();
    this.globService.getAuthorization('/Accounts/Plans', true)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (_result: Permission[]) => {
          this.formatPermissions(_result);
          if (this.permissions.includes('')) {
            this.getAccountPlans();
          } else {   
            await this.loading.dismiss();         
            this.tranService.errorMessage('resource_forbidden');
            this.alertService.closeAllAlerts();
            setTimeout(() => {
              this.AccountPlanHistoryComponent.emit('go-back');
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
              this.AccountPlanHistoryComponent.emit('go-back');
            }, 1000);
          }
        }
      });
  }

}
