import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { DiscountInstance } from '../discount-list/discount-list.component.type';
import { SpinnerService } from 'src/app/Shared/services';
import { DiscountDetailsService } from './services/discount-details.service';
import { TranService } from 'src/services';

@Component({
  selector: 'app-discount-details',
  templateUrl: './discount-details.component.html',
  styleUrls: ['./discount-details.component.scss'],
})
export class DiscountDetailsComponent implements OnInit {

  discountForm: FormGroup;

  private unsubsscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private tranService: TranService,
    private formBuilder: FormBuilder,
    private discountDetailsService: DiscountDetailsService,
    private spinnerService: SpinnerService,
    private dialogRef: MatDialogRef<DiscountDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DiscountInstance
  ) { }

  ngOnInit(): void {
    this.discountForm = this.formBuilder.group({
      Id: '',
      DiscountDefinitionId: '',
      Discount: '',
      From: '',
      To: '',
      PreviousTo: '',
      AutoApply: '',
      PlanInstanceId: '',
      Plan: '',
      AggregationId: '',
      ParentDiscountInstanceId: '',
      CreatedBy: '',
      Created: '',
      LastUpdated: '',
      UpdatedBy: '',
      ChildDiscounts: '',
    });

    if (this.data.Id) {
      this.spinnerService.loading();
      this.discountDetailsService.getDiscountDetail(this.data.Id)
        .pipe(takeUntil(this.unsubsscribeAll$))
        .subscribe({
          next: res => {
            this.discountForm.patchValue({
              ...res,
              From: this.checkDate(res.From),
              To: this.checkDate(res.To),
              PreviousTo: this.checkDate(res.PreviousTo),
              Created: this.checkDate(res.Created),
              LastUpdated: this.checkDate(res.LastUpdated)
            });
            this.spinnerService.end();
            this.discountForm.disable();
          },
          error: err => {
            this.spinnerService.end();
            this.tranService.errorMessage(err);
          }
        })
    }
  }

  ngOnDestroy(): void {
    this.unsubsscribeAll$.next(null);
    this.unsubsscribeAll$.complete();
  }

  close(): void {
    this.dialogRef.close();
  }

  private checkDate(value: Date): string {
    return moment(value).format('YYYY-MM-DD hh:mm:ss') === 'Invalid date' 
      ? '' 
      : moment(value).format('YYYY-MM-DD hh:mm:ss');
  }

}
