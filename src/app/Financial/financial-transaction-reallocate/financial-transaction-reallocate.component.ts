import { Component, Input, OnInit } from '@angular/core';
import { takeUntil, finalize, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { Paging } from 'src/app/model';
import { TranService } from 'src/services';
import { DatatableAction, PermissionType } from 'src/app/Shared/models';
import { GlobalService } from 'src/services/global-service.service';
import { SpinnerService } from 'src/app/Shared/services';
import { ReceiptAllocationItem } from '../receipt/models';
import { FinancialTransactionReallocateService } from './services';
import { DialogComponent } from 'src/app/Shared/components';
import { ReallocationRequestBody } from './financial-transaction-reallocate.component.type';
import { ReceiptAllocationEditComponent } from '../receipt/components';

@Component({
  selector: 'app-financial-transaction-reallocate',
  templateUrl: './financial-transaction-reallocate.component.html',
  styleUrls: ['./financial-transaction-reallocate.component.scss'],
})
export class FinancialTransactionReallocateComponent implements OnInit {

  @Input() ContactCode: string;
  @Input() FinancialId: number;

  totalCount: number = 0;
  originalDatasource: ReceiptAllocationItem[] = [];
  dataSource: ReceiptAllocationItem[] = [];
  dataTableAction: DatatableAction = { row: ['Update', 'RowRefresh'], toolBar: ['Refresh', 'ExportExcel'] };
  csvFileName: string;
  clearExistingAll: boolean;
  permissions: PermissionType[] = ['Update'];
  columns: string[] = ['AmountToAllocate', 'Number', 'OpenAmount', 'Type', 'Date', 'Amount'];
  columnsUsedForCurrency: string[] = ['AmountToAllocate', 'OpenAmount', 'Amount'];
  remainAmount: string;
  totalPriceString: string;

  private totalPrice: number = 0;
  private sumPrice: number = 0;
  private defaultAmount: number = 0;
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private spinnerService: SpinnerService,
    private tranService: TranService,
    public globService: GlobalService,
    private financialTransactionReallocateService: FinancialTransactionReallocateService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.csvFileName = this.tranService.instant('FinancialAllocations') + ' ' + this.ContactCode;
    this.getFinantialTransactionById();
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
    const dialogRef = this.dialog.open(DialogComponent, {
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

    dialogRef.afterClosed().subscribe(res => {
      if (res?.AmountToAllocate >= 0) {
        this.dataSource.find(s => s.Id === event.Id).AmountToAllocate = res.AmountToAllocate;
        this.originalDatasource.find(s => s.Id === event.Id).AmountToAllocate = res.AmountToAllocate;
        this.calculateRemainAmount();
      }
    });
  }

  saveReallocation(): void {
    const reqData: ReallocationRequestBody = {
      DeleteExisting: false,
      Items: this.dataSource.map(s => ({ Id: s.Id, Amount: s.AmountToAllocate }))
    };

    this.spinnerService.loading();
    this.financialTransactionReallocateService.saveReallocation(this.FinancialId, reqData)
      .pipe(
        takeUntil(this.unsubscribeAll$),
        finalize(() => this.spinnerService.end())
      )
      .subscribe({
        error: error => this.tranService.errorMessage(error)
      });
  }

  clearExistingAllocations(): void {
    this.spinnerService.loading();
    this.financialTransactionReallocateService.clearExistingAllocations(this.FinancialId)
      .pipe(
        takeUntil(this.unsubscribeAll$),
        finalize(() => this.spinnerService.end())
      )
      .subscribe({
        error: error => this.tranService.errorMessage(error)
      })
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
  }

  private getFinantialTransactionById(): void {
    this.spinnerService.loading();
    this.financialTransactionReallocateService.getFinantialTransactionById(this.FinancialId)
      .pipe(
        takeUntil(this.unsubscribeAll$),
        switchMap((result) => {
          this.totalPrice = result.OpenAmount;
          this.totalPriceString = this.globService.getCurrencyConfiguration(this.totalPrice);
          return this.financialTransactionReallocateService.getAllocationList(this.ContactCode);
        }),
        finalize(() => this.spinnerService.end()),
      )
      .subscribe({
        next: result =>{
          if (result?.length === 0) {
            this.tranService.errorMessage('NoFinancialAllocations');
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
        error: error => this.tranService.errorMessage(error)
      });    
  }

}
