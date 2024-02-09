import { Component, EventEmitter, Output, Input, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { LoadingService, TranService } from 'src/services';
import { DatatableAction, Permission, PermissionType, SearchOption } from 'src/app/Shared/models';
import { GlobalService } from 'src/services/global-service.service';
import { AlertService } from 'src/services/alert-service.service';
import { ComponentOutValue, ContactBills, FinancialDocuments, Paging } from 'src/app/model';
import { BillHistoryService } from './services/bill-history.service';
import { BillEmailComponent } from '../bill-email/bill-email.component';
import { BillFinancialDocumentsDetailComponent } from '../bill-financial-documents-detail/bill-financial-documents-detail.component';

@Component({
  selector: 'app-bill-history',
  templateUrl: './bill-history.page.html',
  styleUrls: ['./bill-history.page.scss'],
})
export class BillHistoryPage implements OnChanges, OnDestroy {

  @Input() ContactCode: string = '';
  @Output('BillHistoryComponent') BillHistoryComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  billState: string = 'history';
  totalCount: number = 0;
  dataSource: ContactBills[] = [];
  csvFileName: string;
  searchOptions: SearchOption[] = ['Text'];
  permissions: PermissionType[] = [];
  dataTableAction: DatatableAction = {
    row: ['RowEmail', 'Services', 'UsageTransactions', 'Charges', 'Disputes', 'PDF', 'Excel', 'Delete'], 
    toolBar: ['Create', 'Refresh', 'ExportExcel'] 
  };
  subTableAction: DatatableAction = { row: ['Details'], toolBar: [] };
  columnsUsedForCurrency: string[] = ['Balance', 'DisputedAmount', 'RepaymentPlanAmount', 'DepositAmount', 'InstallmentAmount', 'NewCharges', 'PaymentAdjustmentAmount', 'PreviousBalance', 'AmountDue', ''];
  subTableColumnsUsedForCurrency: string[] = ['Amount', 'TaxAmount'];
  columnsUsedForDate: string[] = ['BillDate', 'DueDate'];
  propertyNameToShowInSubTable: string = 'FinancialDocuments';
  columns: string[] = [
    'Id',
    'Sequence',
    'BillPeriod',
    'BillCycle',
    'Source',
    'BillNumber',
    'BillDate',
    'DueDate',
    'AmountDue',
    'PreviousBalance',
    'PaymentAdjustmentAmount',
    'NewCharges',
    'InstallmentAmount',
    'DepositAmount',
    'RepaymentPlanAmount',
    'DisputedAmount',
    'Balance',
    'CreatedBy',
    'CreatedDateTime',
    'LastUpdated',
    'UpdatedBy',
    'Currency'
  ];
  subTableColumns: string[] = [
    'Id',
    'Type',
    'Number',
    'Date',
    'DueDate',
    'Amount',
    'TaxAmount',
    'Source',
    'ParentId',
    'CreatedBy',
    'Created',
    'LastUpdated',
    'UpdatedBy'
  ]
  
  private eventParam = new Paging();
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private tranService: TranService,
    private loading: LoadingService,
    private billService: BillHistoryService,
    private globService: GlobalService,
    private alertService: AlertService,
    private dialog: MatDialog
  ) {
    this.tranService.translaterService();
  }

  processBillHistory(event): void {
    if (event === 'list') {
      this.billState = 'history';
      this.getBillHistory();
    } else if (event === 'close') {
      this.billState = 'history';
      this.getBillHistory();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ContactCode?.currentValue) {
      this.csvFileName = this.tranService.instant('BillHistory') + ' ' + this.ContactCode;
      this.getPermission();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  viewDetail(event: ContactBills): void {
    this.BillHistoryComponent.emit({ type: 'invoice_details', data: { billId: event.Id, billnumber: event.BillNumber } });
  }

  goToAddNew(): void {
    this.BillHistoryComponent.emit({type: 'bill_now'});
  }

  goToDisputes(event: ContactBills): void {
    this.BillHistoryComponent.emit({ type: 'bill_disputes', data: { billId: event.Id, billnumber: event.BillNumber } });
  }

  goToCharges(event: ContactBills): void {
    this.BillHistoryComponent.emit({ type: 'bill_charges', data: { billId: event.Id, billnumber: event.BillNumber } });
  }

  goToUsageTransactions(event: ContactBills): void {
    this.BillHistoryComponent.emit({ type: 'bill_transaction', data: { billId: event.Id, billnumber: event.BillNumber } });
  }

  goToServices(event: ContactBills): void {
    this.BillHistoryComponent.emit({ type: 'bill_services', data: { billId: event.Id, billnumber: event.BillNumber } });
  }

  goToEmail(event: ContactBills): void {
    this.dialog.open(BillEmailComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '600px',
      maxHeight: '600px',
      data: {
        contactCode: this.ContactCode,
        billId: event.Id,
        billNumber: event.BillNumber,
      }
    });
  }

  viewDetailForSubData(event: FinancialDocuments): void {
    this.dialog.open(BillFinancialDocumentsDetailComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '600px',
      maxHeight: '600px',
      data: event
    })
  }

  async downloadBillExcel(event: ContactBills): Promise<void> {
    await this.loading.present();
    this.billService.ContactBillsExcel(event.Id)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result: any) => {
          await this.loading.dismiss();
          if (result.Content) {
            this.downloadBillFile({
              billNumber: event.BillNumber, 
              content: result.Content,
              fileType: 'xls'
            });
          } else {
            this.tranService.errorToastOnly('bill_not_download');
          }
    
        },
        error: async (error: any) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      });
  }

  
  async downloadBillPdf(event: ContactBills): Promise<void> {
    await this.loading.present();
    this.billService.ContactBillsPDF(event.Id)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result: any) => {
          await this.loading.dismiss();
          if (result.Content) {
            this.downloadBillFile({
              billNumber: event.BillNumber, 
              content: result.Content,
              fileType: 'pdf'
            });
          } else {
            this.tranService.errorToastOnly('bill_not_download');
          }
        },
        error: async (error: any) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      });
  }

  async deleteSelectedRow(event: ContactBills): Promise<void> {
    await this.loading.present();
    this.billService.deleteBill(event.Id)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (_result) => {
          this.getBillHistory();
        },
        error: async (err) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(err);
        }
      });
  }
  
  async fetchData(event: Paging): Promise<void> {
    this.eventParam = {
      CountRecords: 'Y',
      ...event
    }
    await this.loading.present();
    this.getBillHistory();
  }

  private downloadBillFile(value: { billNumber: string; content: string; fileType: 'pdf' | 'xls' }): void {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    var downloadUrl = 'data:application/octet-stream;base64,' + value.content;
    a.href = downloadUrl;
    a.download = 'Bill # ' + value.billNumber + '.' + value.fileType;
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(downloadUrl);
  }

  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/Accounts/Bills', "").replace('/', "") as PermissionType);
  }

  private async getBillHistory(): Promise<void> {
    this.billService.ContactBills(this.ContactCode, this.eventParam)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result) =>{
          await this.loading.dismiss();
          if (result === null) {
            this.tranService.errorMessage('NoBillHistory');
          } else {
            this.totalCount = result.Count;
            this.dataSource = result.Bills;
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
    this.globService.getAuthorization('/Accounts/Bills', true)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result: Permission[]) => {
          this.formatPermissions(result);
          if (this.permissions.includes('')) {
            this.getBillHistory();
          } else {
            await this.loading.dismiss();
            this.tranService.errorMessage('resource_forbidden');
            this.alertService.closeAllAlerts();
            setTimeout(() => {
              this.BillHistoryComponent.emit({type: 'service_desk'})
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
              this.BillHistoryComponent.emit({type: 'service_desk'})
            }, 1000);
          }
        }
      });
  }
}
