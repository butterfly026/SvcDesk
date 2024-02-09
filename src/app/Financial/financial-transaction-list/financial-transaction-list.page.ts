import { Component, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Paging } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { FinancialTransactionListService } from './services/transaction-list.service';
import { GlobalService } from 'src/services/global-service.service';
import { DatatableAction, Permission, PermissionType, SearchOption } from 'src/app/Shared/models';
import { AlertService } from 'src/services/alert-service.service';
import { FinancialTransaction } from './financial-transaction-list.page.type';
import { DialogComponent } from 'src/app/Shared/components';
import { FinancialTransactionEditStatusComponent } from '../financial-transaction-edit-status/financial-transaction-edit-status.component';
import { FinancialTransactionStatus } from '../financial-transaction-edit-status/financial-transaction-edit-status.component.type';

@Component({
  selector: 'app-financial-transaction-list',
  templateUrl: './financial-transaction-list.page.html',
  styleUrls: ['./financial-transaction-list.page.scss'],
})
export class FinancialTransactionListPage implements OnChanges, OnDestroy {

  @Input() ContactNumber: string;
  @Input() Refresh: number;
  @Output('setComponentValue') public componentValue: EventEmitter<string> = new EventEmitter<string>();

  totalCount: number = 0;
  dataSource: FinancialTransaction[] = [];
  dataTableAction: DatatableAction = { row: ['Details', 'Reallocate', 'UpdateStatus', 'Update', 'Delete'], toolBar: ['Refresh', 'ExportExcel', 'Receipt', 'CreditNote', 'Refund', 'DebitNote', 'Invoice', 'CreditAdjustment', 'DebitAdjustment'] };
  columnsUsedForCurrency: string[] = ['Amount', 'TaxAmount', 'OpenAmount', 'RoundingAmount'];
  permissions: PermissionType[] = [];
  csvFileName: string;
  searchOptions: SearchOption[] = [];
  columns: string[] = [
    'Id',
    'Type',
    'Status',
    'Number',
    'Date',
    'DueDate',
    'Amount',
    'TaxAmount',
    'OpenAmount',
    'RoundingAmount',
    'BillNumber',
    'Source',
    'Category',
    'Reason',
    'OtherReference',
    'ParentId',
    'ServiceReference',
    'ServiceId',
    'CreatedBy',
    'Created',
    'LastUpdated',
    'UpdatedBy'
  ];

  private financialTransactionStatuses: FinancialTransactionStatus[] = [];
  private eventParam = new Paging();
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private loading: LoadingService,
    private financialTransactionListService: FinancialTransactionListService,
    private tranService: TranService,
    private alertService: AlertService,
    private dialog: MatDialog,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.Refresh?.currentValue) {
      if (this.ContactNumber) {
        this.csvFileName = this.tranService.instant('FinancialTransactions') + ' ' + this.ContactNumber;
        this.getPermission();
      }
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  viewDetail(event: FinancialTransaction): void {
    this.componentValue.emit(`finantialDetail&${event.Id}&${event.Number}&${event.Type}`);
  }

  onInvoice(): void {
    this.componentValue.emit('financial-invoice');
  }

  goToReceipt(): void {
    this.componentValue.emit('receipts');
  }

  goToCreditAdjustment(): void {
    this.componentValue.emit('financial-credit-adjustment');
  }

  goToDebitAdjustment(): void {
    this.componentValue.emit('financial-debit-adjustment');
  }

  updateStatus(data: FinancialTransaction): void {
    const dialog = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '600px',
      maxHeight: '300px',
      panelClass: 'dialog',
      data: {
        component: FinancialTransactionEditStatusComponent,
        financialTransactionData: data,
      }
    });

    dialog.afterClosed()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe(async result => {
        if (result === 'ok') {
          await this.loading.present();
          this.getFinancialTransactions();
        }
      });
  }

  reallocate(data: FinancialTransaction): void {
    this.componentValue.emit(`financial-reallocate&${data.Id}&${data.Number}&${data.Type}`);
  }

  async deleteSelectedRow(data: FinancialTransaction): Promise<void> {
    await this.loading.present();
    this.financialTransactionListService.deleteFinancialTransaction(data.Id)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async () => {
          await this.loading.dismiss();
          this.getFinancialTransactions();
        },
        error: async error => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      });
  }

  async editOne(event: FinancialTransaction): Promise<void> { }

  async fetchData(event: Paging): Promise<void> {
    this.eventParam = {
      CountRecords: 'Y',
      ...event
    }
    await this.loading.present();
    this.getFinancialTransactions();
  }

  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/FinancialTransactions', "").replace('/', "") as PermissionType);
  }

  private getFinancialTransactionsStatuses(): void {
    this.financialTransactionListService.getFinancialTransactionsStatuses()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => this.financialTransactionStatuses = result,
        error: error => this.tranService.errorMessage(error)
      });
  }

  private async getFinancialTransactions(): Promise<void> {
    this.financialTransactionListService.FinantialTransactionsList(this.eventParam, this.ContactNumber)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result) =>{
          await this.loading.dismiss();
          if (result === null) {
            this.tranService.errorMessage('no_financials');
          } else {
            this.totalCount = result.Count;
            this.dataSource = result.FinancialTransactions.map(s => ({
              ...s,
              RevokedRowActionPermissions: !['Receipt', 'Credit Adjustment', 'Credit Note'].includes(s.Type) 
                ? ['Allocations/Reallocate'] 
                : []
            }));
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
    this.globService.getAuthorization('/FinancialTransactions', true)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (_result: Permission[]) => {
          this.formatPermissions(_result);
          if (this.permissions.includes('')) {
            this.getFinancialTransactions();
            this.getFinancialTransactionsStatuses();
          } else {
            await this.loading.dismiss();
            this.tranService.errorMessage('resource_forbidden');
            this.alertService.closeAllAlerts();
            setTimeout(() => {
              this.componentValue.emit('close');
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
              this.componentValue.emit('close');
            }, 1000);
          }
        }
      });
  }
}
