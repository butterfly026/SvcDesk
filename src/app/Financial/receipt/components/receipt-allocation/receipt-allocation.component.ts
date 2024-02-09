import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Paging } from 'src/app/model';
import { TranService } from 'src/services';
import { SpinnerService } from 'src/app/Shared/services';
import { DialogComponent } from 'src/app/Shared/components';
import { DatatableAction, Permission, PermissionType } from 'src/app/Shared/models';
import { GlobalService } from 'src/services/global-service.service';
import { ReceiptPaymentService } from '../../services';
import { ReceiptAllocationItem } from '../../models';
import { ReceiptAllocationEditComponent } from '..';

@Component({
  selector: 'app-receipt-allocation',
  templateUrl: './receipt-allocation.component.html',
  styleUrls: ['./receipt-allocation.component.scss'],
})
export class ReceiptAllocationComponent implements OnChanges, OnDestroy {

  @Input() ContactCode: string;
  @Input() receiptAmount: string;  
  @Input() totalPrice: number;
  @Input() autoAllocation: boolean;

  @Output() onToggleAutoAllocation = new EventEmitter<boolean>();
  @Output() onUpdateAllocations = new EventEmitter<ReceiptAllocationItem[]>();

  totalCount: number = 0;
  originalDatasource: ReceiptAllocationItem[] = [];
  dataSource: ReceiptAllocationItem[] = [];
  dataTableAction: DatatableAction = { row: ['Update', 'RowRefresh'], toolBar: [ 'Refresh', 'ExportExcel'] };
  csvFileName: string;
  permissions: PermissionType[] = [];
  columns: string[] = ['AmountToAllocate', 'Number', 'OpenAmount', 'Type', 'Date', 'Amount'];
  columnsUsedForCurrency: string[] = ['AmountToAllocate', 'OpenAmount', 'Amount'];
  remainAmount: string;

  private sumPrice: number = 0;
  private defaultAmount: number = 0;
  private dialogRef: MatDialogRef<any>;
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    public globService: GlobalService,
    private spinnerService: SpinnerService,
    private receiptService: ReceiptPaymentService,
    private tranService: TranService,
    private dialog: MatDialog
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ContactCode?.currentValue) {
      this.csvFileName = this.tranService.instant('ContactPhonesHistory') + ' ' + this.ContactCode;
      this.spinnerService.loading();
      this.getPermission();
    }

    if (changes.autoAllocation?.currentValue === false && this.ContactCode) {
      this.spinnerService.loading();
      this.getReceiptAllocations();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  fetchData(event: Paging): void {
    this.dataSource.forEach(s => s.AmountToAllocate = 0);
    this.originalDatasource.forEach(s => s.AmountToAllocate = 0);
    this.calculateRemainAmount();
  }

  changeAllocation(event): void {
    this.onToggleAutoAllocation.emit(event.args.checked);
  }

  changeZeroItem(event): void {
  }

  changeBestMatch(event): void {
    this.dataSource = this.originalDatasource.filter(s => event.args.checked ? (s.OpenAmount === this.totalPrice || s.AmountToAllocate) : true);
  }

  onDoublClickRow(event: ReceiptAllocationItem): void {
    this.defaultAmount = (this.totalPrice - this.sumPrice) > event.OpenAmount 
      ? event.OpenAmount 
      : this.totalPrice - this.sumPrice;
      
    if (this.defaultAmount > 0) {
      this.dataSource.find(s => s.Id === event.Id).AmountToAllocate = this.defaultAmount;
      this.originalDatasource.find(s => s.Id === event.Id).AmountToAllocate = this.defaultAmount;
      this.calculateRemainAmount();
    }
  }

  refreshRow(event: ReceiptAllocationItem): void {
    this.dataSource.find(s => s.Id === event.Id).AmountToAllocate = 0;
    this.originalDatasource.find(s => s.Id === event.Id).AmountToAllocate = 0;
    this.calculateRemainAmount();
  }

  editOne(event: ReceiptAllocationItem): void {
    this.dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      maxWidth: '500px',
      panelClass: 'dialog',
      data: {
        component: ReceiptAllocationEditComponent,
        allocationData: event,
        totalPrice: this.totalPrice,
        dataSource: this.dataSource
      }
    });

    this.dialogRef.afterClosed().subscribe(res => {
      if (res?.AmountToAllocate >= 0) {
        this.dataSource.find(s => s.Id === event.Id).AmountToAllocate = res.AmountToAllocate;
        this.originalDatasource.find(s => s.Id === event.Id).AmountToAllocate = res.AmountToAllocate;
        this.calculateRemainAmount();
      }
    });
  }

  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/FinancialTransactions/Receipts', "").replace('/', "") as PermissionType);
  }

  private calculateRemainAmount(): void {
    this.sumPrice = 0;

    if (this.totalPrice === 0) {
      this.remainAmount = this.globService.getCurrencyConfiguration(0);
    }
    for (const list of this.dataSource) {
      this.sumPrice += list.AmountToAllocate;
    }
    if (this.totalPrice >= parseFloat(this.sumPrice.toFixed(2))) {
      this.remainAmount = this.globService.getCurrencyConfiguration(parseFloat((this.totalPrice - this.sumPrice).toFixed(2)));
    } else {
      this.remainAmount = this.globService.getCurrencyConfiguration(0);
    }

    this.onUpdateAllocations.emit(this.dataSource);
  }

  private getReceiptAllocations(): void {
    this.receiptService.getAllocationList(this.ContactCode)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: (result) => {
          this.spinnerService.end();
          if (result === null) {
            this.tranService.errorMessage('NoPhonesHistory');
          } else {
            this.totalCount = result.length;
            this.originalDatasource = result.map(s => ({ ...s, AmountToAllocate: 0 }));
            let sumPrice = 0;
            this.dataSource = this.originalDatasource.map( s => {
              if (this.totalPrice === 0) {
                s.AmountToAllocate = 0;
              } else {
                sumPrice += s.OpenAmount;

                if (this.totalPrice >= sumPrice) {
                  s.AmountToAllocate = s.OpenAmount;
                } else if (s.OpenAmount + this.totalPrice > sumPrice) {
                  s.AmountToAllocate = s.OpenAmount + this.totalPrice - sumPrice;
                } else {
                  s.AmountToAllocate = 0;
                }
              }

              return s;
            });

            this.calculateRemainAmount();
          }
        },
        error: (error: any) => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      })
  }

  private getPermission(): void {
    this.globService.getAuthorization('/FinancialTransactions/Receipts', true)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: (result: Permission[]) => {
          this.formatPermissions(result);
          if (this.permissions.length > 0) {
            this.getReceiptAllocations();
          } else {
            this.spinnerService.end();
            this.tranService.errorMessage('resource_forbidden');
          }
        },
        error: (error) => {
          this.spinnerService.end();
          const errResult = this.globService.ConvertKeysToLowerCase(error);
          this.tranService.errorMessage('resource_forbidden');

          if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
          }
        }
      });
  }


}
