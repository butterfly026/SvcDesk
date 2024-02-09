import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { DiscountEditService } from './services/discount-edit-service';
import { Subject } from 'rxjs';
import { DiscountDetailsService } from '../discount-details/services/discount-details.service';
import { SpinnerService } from 'src/app/Shared/services';
import { DiscountInstance } from '../discount-list/discount-list.component.type';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { AlertService } from 'src/services/alert-service.service';

@Component({
  selector: 'app-discount-edit',
  templateUrl: './discount-edit.component.html',
  styleUrls: ['./discount-edit.component.scss'],
})
export class DiscountEditComponent implements OnInit {
  @Input() discountId: string = '';
  @Output('DiscountEditComponent') DiscountEditComponent: EventEmitter<string> = new EventEmitter<string>();

  discountForm: FormGroup;

  private unsubsscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private alertService: AlertService,
    public globService: GlobalService,
    private tranService: TranService,
    private formBuilder: FormBuilder,
    private discountEditService: DiscountEditService,
    private discountDetailsService: DiscountDetailsService,
    private spinnerService: SpinnerService,
    private dialogRef: MatDialogRef<DiscountEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { serviceReferenceId: number; eventInstance: DiscountInstance }
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

    if (this.data.eventInstance.Id) {
      this.spinnerService.loading();
      this.discountDetailsService.getDiscountDetail(this.data.eventInstance.Id)
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
            this.discountForm.get('To').enable();
          },
          error: err => {
            this.spinnerService.end();
            this.tranService.errorMessage(err);
          }
        })
    }
  }

  ngOnDestroy(): void {
    this.alertService.closeAllAlerts();
    this.unsubsscribeAll$.next(null);
    this.unsubsscribeAll$.complete();
  }

  close(): void {
    this.dialogRef.close();
  }

  submitTrigger(): void {
    document.getElementById('submitButton').click();
  }

  eventSubmit(): void {
    this.spinnerService.loading();

    this.discountEditService.updateDiscount(this.data.eventInstance.Id, this.discountForm.get('To').value)
      .pipe(takeUntil(this.unsubsscribeAll$))
      .subscribe({
        next: () => this.spinnerService.end(),
        error: (err) => {
          this.spinnerService.end();
          this.tranService.errorMessage(err);
        }
      })
  }

  private checkDate(value: Date): string {
    return moment(value).format('YYYY-MM-DD hh:mm:ss') === 'Invalid date' 
      ? '' 
      : moment(value).format('YYYY-MM-DD hh:mm:ss');
  }

}
