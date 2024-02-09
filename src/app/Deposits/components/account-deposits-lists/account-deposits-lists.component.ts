import { DepositItem, DepositItemResponse } from './../../deposits.types';
import { AccountDepositsService } from '../../services/account-deposits.services';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DepositItemDetail } from '../../deposits.types';
import { DatatableAction, MessageForRowDeletion, Permission, PermissionType, SearchOption } from 'src/app/Shared/models';
import { Paging } from 'src/app/model';
import { Subject } from 'rxjs';
import { LoadingService, TranService } from 'src/services';
import { AlertService } from 'src/services/alert-service.service';
import { GlobalService } from 'src/services/global-service.service';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { DialogComponent } from 'src/app/Shared/components';
import { AccountDepositsFormComponent } from '../account-deposits-form/account-deposits-form.component';

@Component({
  selector: 'app-account-deposits-lists',
  templateUrl: './account-deposits-lists.component.html',
  styleUrls: ['./account-deposits-lists.component.scss']
})
export class AccountDepositsListsComponent implements OnInit {
  @Input() ContactCode: string;
  @Output() AccountDepositsListsComponent: EventEmitter<string> = new EventEmitter<string>();

  totalCount: number = 0;
  dataSource: DepositItemDetail[] = [];
  tblPageSizeOptions: number[] = [10, 20];
  columns: string[]
  dataTableAction: DatatableAction = { row: ['Details', 'Update', 'Delete'], toolBar: ['Create', 'Refresh', 'ExportExcel'] };
  columnsUsedForDate: string[] = ['Date', 'ExpiryDate']
  eventParam = new Paging();
  permissions: PermissionType[] = [];
  csvFileName: string;
  searchOptions: SearchOption[] = [];
  columnsUsedForCurrency: string[] = ['Amount'];

  deletionMsg: MessageForRowDeletion = {
    header: this.tranService.instant('are_you_sure'),
    message: this.tranService.instant('are_you_sure_delete_deposit'),
  }
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private loading: LoadingService,
    private accountDepositsService: AccountDepositsService,
    private tranService: TranService,
    private alertService: AlertService,
    public globService: GlobalService,
    public dialog: MatDialog,
  ) {
    this.configInitialValues();
    this.tranService.translaterService();

  }

  ngOnInit(): void {
    this.csvFileName = this.tranService.instant('Account Deposits') + ' ' + this.ContactCode;
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
    this.getDepositsList();
  }

  private configInitialValues(): void{
    this.columns = [
      'Id',
      'Type',
      'Amount',
      'Date',
      'ExpiryDate',
      'Status',
      'StatusUpdated',
      'StatusChangedBy',
      'StatusReasonId',
      'StatusReason',
      'Note',
      'CreatedBy',
      'Created',
      'UpdatedBy',
      'Updated'
    ];
  }
  
  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/Accounts/Deposits', "").replace('/', "") as PermissionType);
  }

  private async getPermission(): Promise<void> {
    await this.loading.present();
    this.globService.getAuthorization('/Accounts/Deposits', true)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (_result: Permission[]) => {
          this.formatPermissions(_result);
          await this.loading.dismiss();
          if (this.permissions.includes('')) {
            this.getDepositsList();
          } else {
            await this.loading.dismiss();
            this.tranService.errorMessage('resource_forbidden');
            this.alertService.closeAllAlerts();
            setTimeout(() => {
              this.AccountDepositsListsComponent.emit('go-back');
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
              this.AccountDepositsListsComponent.emit('go-back');
            }, 1000);
          }
        }
      });
  }
  private async getDepositsList(): Promise<void> {
    await this.loading.present();
    this.accountDepositsService.getDepositsList(this.eventParam, this.ContactCode)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result: DepositItemResponse) =>{
          await this.loading.dismiss();
          if (result === null) {
            this.tranService.errorMessage('no_deposits');
          } else {
            this.totalCount = result.Count;
            this.dataSource = result.Deposits.map((deposit: DepositItem) => {
              deposit.Note = deposit.Note ? deposit.Note : '';
              return deposit;
            });
          }
        },
        error: async (error: any) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      })
  }
  goBack(): void {
    this.AccountDepositsListsComponent.emit('go-back');
  }
  async addNew(): Promise<void> {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '650px',
      maxHeight: '600px',
      panelClass: 'dialog',
      data: {
        component: AccountDepositsFormComponent,
        ContactCode: this.ContactCode,
        EditMode: 'New',
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === 'ok') {
        this.getDepositsList();
      }
    });

  }
  async editOne(event: DepositItemDetail): Promise<void> {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '650px',
      maxHeight: '600px',
      panelClass: 'dialog',
      data: {
        component: AccountDepositsFormComponent,
        ContactCode: this.ContactCode,
        EditMode: 'Update',
        DepositId: event.Id,
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === 'ok') {
        this.getDepositsList();
      }
    });
  }
  async viewDetail(event: DepositItemDetail): Promise<void> {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '650px',
      maxHeight: '600px',
      panelClass: 'dialog',
      data: {
        component: AccountDepositsFormComponent,
        ContactCode: this.ContactCode,
        EditMode: 'View',
        DepositId: event.Id,
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === 'ok') {
        this.getDepositsList();
      }
    });
  }
  async deleteItem(event: DepositItemDetail): Promise<void> {
    await this.loading.present();
    this.accountDepositsService.deleteDeposit(event.Id?.toString())
      .subscribe({
        next: async (result) =>{
          await this.loading.dismiss();
          this.getDepositsList();
        },
        error: async (error: any) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      })
  }

}
