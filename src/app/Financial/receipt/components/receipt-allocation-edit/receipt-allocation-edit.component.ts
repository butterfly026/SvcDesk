import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { ReceiptAllocationItem } from '../../models';

@Component({
  selector: 'app-receipt-allocation-edit',
  templateUrl: './receipt-allocation-edit.component.html',
  styleUrls: ['./receipt-allocation-edit.component.scss'],
})
export class ReceiptAllocationEditComponent implements OnInit, OnDestroy {

  formGroup: FormGroup;
  errorMessage: string;
  
  private sumPrice: number = 0;
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    public globService: GlobalService,
    private tranService: TranService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ReceiptAllocationEditComponent>,
    @Inject(MAT_DIALOG_DATA) private data: {
      allocationData: ReceiptAllocationItem; 
      dataSource: ReceiptAllocationItem[]; 
      totalPrice: number;
    }
  ) { }

  ngOnInit(): void {
    for (const list of this.data.dataSource) {
      if (list.Id !== this.data.allocationData.Id) {
        this.sumPrice += list.AmountToAllocate;
      }
    }

    const defaultAmount = (this.data.totalPrice - this.sumPrice) > this.data.allocationData.OpenAmount 
      ? this.data.allocationData.OpenAmount 
      : this.data.totalPrice - this.sumPrice;

    this.formGroup = this.formBuilder.group({
      AmountToAllocate: defaultAmount
    });

    this.formGroup.get('AmountToAllocate').valueChanges
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe(res => {
        if ((this.data.totalPrice === this.sumPrice) && res !== 0) {
          this.errorMessage = this.tranService.instant('not_allowed_add');
        } else if (res > defaultAmount) {
          this.errorMessage = this.tranService.instant('it_should_be') + ' 0 < ' + defaultAmount;
        } else if (res < 0) {
          this.errorMessage = this.tranService.instant('it_should_be') + ' >= 0';
        } else {
          this.errorMessage = null;
        }

        if (!!this.errorMessage) {
          this.formGroup.get('AmountToAllocate').setErrors({
            invalidNumber: this.errorMessage
          });
        }
      })
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  submitTrigger(): void {
    document.getElementById('submitButton').click();
  }

  onSubmit(): void {
    this.dialogRef.close({...this.formGroup.value});
  }

}
