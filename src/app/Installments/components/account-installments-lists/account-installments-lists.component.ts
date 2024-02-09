import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DatatableAction, MessageForRowDeletion, Permission, PermissionType, SearchOption } from 'src/app/Shared/models';
import { Paging } from 'src/app/model';
import { Subject } from 'rxjs';
import { LoadingService, TranService } from 'src/services';
import { AlertService } from 'src/services/alert-service.service';
import { GlobalService } from 'src/services/global-service.service';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { DialogComponent } from 'src/app/Shared/components';
import { AccountInstallmentsFormComponent } from '../account-installments-form/account-installments-form.component';
import { InstallmentItemDetail, InstallmentItemResponse } from '../../models/installments.types';
import { AccountInstallmentsService } from '../../services/account-installments.services';

@Component({
  selector: 'app-account-installments-lists',
  templateUrl: './account-installments-lists.component.html',
  styleUrls: ['./account-installments-lists.component.scss']
})
export class AccountInstallmentsListsComponent implements OnInit {
  @Input() ContactCode: string;
  @Output() AccountInstallmentsListsComponent: EventEmitter<string> = new EventEmitter<string>();

  totalCount: number = 0;
  dataSource: InstallmentItemDetail[] = [];
  tblPageSizeOptions: number[] = [10, 20];
  columns: string[];
  dataTableAction: DatatableAction = { row: ['Details', 'Update', 'Delete'], toolBar: ['Create', 'Refresh', 'ExportExcel'] };  
  columnsUsedForDate: string[] = ['NextInstallmentDue'];
  eventParam = new Paging();
  permissions: PermissionType[] = [];
  csvFileName: string;
  searchOptions: SearchOption[] = [];
  columnsUsedForCurrency: string[] = ['Amount', 'AmountPaid'];

  deletionMsg: MessageForRowDeletion = {
    header: this.tranService.instant('are_you_sure'),
    message: this.tranService.instant('are_you_sure_delete_installment'),
  }
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private loading: LoadingService,
    private accountInstallmentsService: AccountInstallmentsService,
    private tranService: TranService,
    private alertService: AlertService,
    public globService: GlobalService,
    public dialog: MatDialog,
  ) {
    this.configInitialValues();
    this.tranService.translaterService();

  }

  ngOnInit(): void {
    this.csvFileName = this.tranService.instant('Account Installments') + ' ' + this.ContactCode;
    this.getPermission();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  async fetchData(event: Paging): Promise<void> {
    this.eventParam = event;
    this.getInstallmentsList();
  }

  private configInitialValues(): void{
    this.columns = [
      'Id',
      'AccountPaymentMethodId',
      'Amount',
      'AmountPaid',
      'NextInstallmentDue',
      'LastDatePaid',
      'InstallmentDay',
      'InstallmentCycleType',
      'Status',
      'StatusChanged',
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
    this.permissions = value.map(s => s.Resource.replace('/Accounts/Installments', "").replace('/', "") as PermissionType);
  }

  private async getPermission(): Promise<void> {
    await this.loading.present();
    this.globService.getAuthorization('/Accounts/Installments', true)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (_result: Permission[]) => {
          this.formatPermissions(_result);
          await this.loading.dismiss();
          if (this.permissions.includes('')) {
            this.getInstallmentsList();
          } else {
            await this.loading.dismiss();
            this.tranService.errorMessage('resource_forbidden');
            this.alertService.closeAllAlerts();
            setTimeout(() => {
              this.AccountInstallmentsListsComponent.emit('go-back');
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
              this.AccountInstallmentsListsComponent.emit('go-back');
            }, 1000);
          }
        }
      });
  }

  private async getInstallmentsList(): Promise<void> {
    await this.loading.present();
    this.accountInstallmentsService.getInstallmentsList(this.eventParam, this.ContactCode)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result: InstallmentItemResponse) => {
          await this.loading.dismiss();
          if (result === null) {
            this.tranService.errorMessage('no_installments');
          } else {
            this.totalCount = result.Count;
            this.dataSource = result.Items.map((installment: InstallmentItemDetail) => {
              installment.Note = installment.Note ? installment.Note : '';
              return installment;
            });
          }
        },
        error: async (error: any) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      });
  }

  goBack(): void {
    this.AccountInstallmentsListsComponent.emit('go-back');
  }

  async addNew(): Promise<void> {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '650px',
      maxHeight: '680px',
      panelClass: 'dialog',
      data: {
        component: AccountInstallmentsFormComponent,
        ContactCode: this.ContactCode,
        EditMode: 'New',
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === 'ok') {
        this.getInstallmentsList();
      }
    });
  }

  async editOne(event: InstallmentItemDetail): Promise<void> {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '750px',
      maxHeight: '680px',
      panelClass: 'dialog',
      data: {
        component: AccountInstallmentsFormComponent,
        ContactCode: this.ContactCode,
        EditMode: 'Update',
        InstallmentId: event.Id,
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === 'ok') {
        this.getInstallmentsList();
      }
    });
  }

  async viewDetail(event: InstallmentItemDetail): Promise<void> {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '750px',
      maxHeight: '680px',
      panelClass: 'dialog',
      data: {
        component: AccountInstallmentsFormComponent,
        ContactCode: this.ContactCode,
        EditMode: 'View',
        InstallmentId: event.Id,
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === 'ok') {
        this.getInstallmentsList();
      }
    });
  }

  async deleteItem(event: InstallmentItemDetail): Promise<void> {
    await this.loading.present();
    this.accountInstallmentsService.deleteInstallment(event.Id)
      .subscribe({
        next: async (result) =>{
          await this.loading.dismiss();
          this.getInstallmentsList();
        },
        error: async (error: any) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      })
  }

}