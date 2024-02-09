import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { TranService } from 'src/services';
import { SpinnerService } from 'src/app/Shared/services';
import { Permission, PermissionType } from 'src/app/Shared/models';
import { GlobalService } from 'src/services/global-service.service';
import { FinancialDebitAdjustmentService } from './services';

@Component({
  selector: 'app-financial-debit-adjustment',
  templateUrl: './financial-debit-adjustment.component.html',
  styleUrls: ['./financial-debit-adjustment.component.scss'],
})
export class FinancialDebitAdjustmentComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Output('FinancialDebitAdjustmentComponent') FinancialDebitAdjustmentComponent: EventEmitter<string> = new EventEmitter<string>();

  formGroup: FormGroup;
  permissions: PermissionType[] = [];

  datepickerFilter: { min: Date; max: Date } = {
    min: new Date(),
    max: new Date(2100, 12, 31)
  };

  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    public globService: GlobalService,
    private financialDebitAdjustmentService: FinancialDebitAdjustmentService,
    private spinnerService: SpinnerService,
    private tranService: TranService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      Number: [{ value: '', disabled: true }],
      Amount: [0, [Validators.min(0.01)]],
      Date: [new Date(), [Validators.required]],
      ReasonCode: '',
      Note: '',
      OtherReference: '',
      SourceCode: 'MN',
      StatusCode: 'CR',
      CategoryCode: '',
    })

    this.getPermission();
  }

  get f() {
    return this.formGroup.controls;
  }

  goBack(): void {
    this.FinancialDebitAdjustmentComponent.emit('financials');
  }

  submitTrigger(): void {
    document.getElementById('submitFinancialDebitAdjustmentButton').click();
  }

  onSubmit(): void {
    if (this.formGroup.valid) {     
      this.spinnerService.loading();
      this.financialDebitAdjustmentService.createDebitAdjustment(this.ContactCode, this.formGroup.value)
        .subscribe({
          next: () => {
            this.spinnerService.end();
            this.tranService.errorMessage('saveFinancialDebitAdjustmentSuccess');
            setTimeout(() => this.goBack(), 1000);
          },
          error: error => {
            this.spinnerService.end();
            this.tranService.errorMessage(error);
          }
        });
    }
  }

  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/FinancialTransactions/DebitAdjustments/New', "").replace('/', "") as PermissionType);
  }

  private getInvoiceNumber() {
    this.spinnerService.loading();
    this.financialDebitAdjustmentService.getInvoiceNumber('R')
      .subscribe({
        next: result => {
          this.spinnerService.end();
          this.formGroup.get('Number').setValue(result.Number);
        },
        error: error => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      });
  }

  private getPermission(): void {
    this.spinnerService.loading();
    this.globService.getAuthorization('/FinancialTransactions/DebitAdjustments/New', true)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: (result: Permission[]) => {
          this.formatPermissions(result);
          if (this.permissions.includes('')) {
            this.getInvoiceNumber();
          } else {
            this.spinnerService.end();
            this.tranService.errorMessage('resource_forbidden');
            setTimeout(() => this.goBack(), 1000);
          }
        },
        error: err => {
          this.spinnerService.end();
          const errResult = this.globService.ConvertKeysToLowerCase(err);
          this.tranService.errorMessage('resource_forbidden');

          if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
            setTimeout(() => this.goBack(), 1000);
          }
        }
      });
  }

}
