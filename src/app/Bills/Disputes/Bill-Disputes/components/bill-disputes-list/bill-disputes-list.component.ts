import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ComponentOutValue, Paging } from 'src/app/model';
import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { SpinnerService } from 'src/app/Shared/services';
import { DatatableAction, Permission, PermissionType, SearchOption } from 'src/app/Shared/models';
import { AlertService } from 'src/services/alert-service.service';
import { BillDisputesService } from '../../services';
import { BillDispute } from '../../models';
import { BillDisputesDetailComponent, BillDisputesEditComponent, BillDisputesNewComponent } from '..';
import { DialogComponent } from 'src/app/Shared/components';

@Component({
  selector: 'app-bill-list',
  templateUrl: './bill-disputes-list.component.html',
  styleUrls: ['./bill-disputes-list.component.scss'],
})
export class BillDisputesListComponent implements OnChanges, OnDestroy {
  @Input() ContactCode: string = '';
  @Input() PagingParam: any;
  @Input() billId: string = '';
  @Input() billNumber: number;
  @Output('BillListComponent') BillListComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  totalCount: number = 0;
  dataSource: BillDispute[] = [];
  dataTableAction: DatatableAction = { row: ['Details', 'Update', 'Delete'], toolBar: [ 'Create', 'Refresh', 'ExportExcel'] };
  csvFileName: string;
  permissions: PermissionType[] = [];
  searchOptions: SearchOption[] = [];
  columnsUsedForCurrency: string[] = ['DisputedAmount'];
  columns: string[] = [
    'Id',
    'Status',
    'Date',
    'DisputedAmount',
    'SettlementTax',
    'SettlementAmount',
    'Details',
    'ContactDetails',
    'ApprovalNotes',
    'RaisedBy',
    'ApprovedBy',
    'BillNumber',
    'StatusLastUpdated',
    'BillId',
    'BillDate',
    'Created',
    'CreatedBy',
    'UpdatedBy',
    'Updated',
  ];
  
  private dialogRef: MatDialogRef<any>;
  private eventParam = new Paging();
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private spinnerService: SpinnerService,
    private billDisputesService: BillDisputesService,
    private alertService: AlertService,
    private tranService: TranService,
    private globService: GlobalService,
    private dialog: MatDialog
  ) {
    this.tranService.translaterService();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.billId?.currentValue) {
      this.csvFileName = this.tranService.instant('BillDisputes') + ' ' + this.billId;
      this.spinnerService.loading();
      this.getPermission();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  deleteSelectedOne(event: any): void {
    this.spinnerService.loading();
    this.billDisputesService.deleteBillDispute(event.Id)
    .pipe(takeUntil(this.unsubscribeAll$))
    .subscribe({
      next: () => this.getBillDisputes(),
      error: error => {
        this.spinnerService.end();
        this.tranService.errorMessage(error);
      }
    });
  }

  addNew(): void {
    this.dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '600px',
      maxHeight: '615px',
      panelClass: 'dialog',
      data: {
        component:  BillDisputesNewComponent,
        billId: this.billId,
        billNumber: this.billNumber,
        contacCode: this.ContactCode
      }
    });
    this.dialogRef.afterClosed().subscribe(res => {
      if(res === 'ok') {
        this.getBillDisputes();
      }
    });
  }

  goToDisputeDetail(event: any): void {
    this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '600px',
      maxHeight: '615px',
      panelClass: 'dialog',
      data: {
        component: BillDisputesDetailComponent,
        billDispute: event,
      }
    });
  }

  editOne(event: BillDispute): void {
    this.dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '600px',
      maxHeight: '615px',
      panelClass: 'dialog',
      data: {
        component: BillDisputesEditComponent,
        billDispute: event,
      }
    });
    this.dialogRef.afterClosed().subscribe(res => {
      if(res === 'ok') {
        this.getBillDisputes();
      }
    });
  }

  fetchData(event: Paging): void {
    this.eventParam = {
      CountRecords: 'Y',
      ...event
    }
    this.spinnerService.loading();
    this.getBillDisputes();
  }

  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/Accounts/Bills/Disputes', "").replace('/', "") as PermissionType);
  }

  private getBillDisputes(): void {
    this.billDisputesService.getBillDisputesForBill(this.eventParam, this.billId)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: (result) => {
          this.spinnerService.end();
          if (result === null) {
            this.tranService.errorMessage('NoBillDisputes');
          } else {
            this.totalCount = result.Count;
            this.dataSource = result.BillDisputes;
          }
        },
        error: (error: any) => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      })
  }

  private getPermission(): void {
    this.spinnerService.loading();
    this.globService.getAuthorization('/Accounts/Bills/Disputes', true)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: (result: Permission[]) => {
          this.formatPermissions(result);
          if (this.permissions.includes('')) {
            this.getBillDisputes();
          } else {
            this.spinnerService.end();
            this.tranService.errorMessage('resource_forbidden');
            this.alertService.closeAllAlerts();
            setTimeout(() => this.BillListComponent.emit({ type: 'go-back' }), 1000);
          }
        },
        error: (error) => {
          this.spinnerService.end();
          const errResult = this.globService.ConvertKeysToLowerCase(error);
          this.tranService.errorMessage('resource_forbidden');

          if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
            this.alertService.closeAllAlerts();
            setTimeout(() => this.BillListComponent.emit({ type: 'go-back' }), 1000);
          }
        }
      });
  }
}
