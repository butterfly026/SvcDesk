import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SpinnerService } from 'src/app/Shared/services';
import { Permission, PermissionType } from 'src/app/Shared/models';
import { GlobalService } from 'src/services/global-service.service';
import { TranService } from 'src/services';
import { FinancialTransactionReason } from './models';
import { FinancialAutoAllocateAllService } from './services';

@Component({
  selector: 'app-financial-auto-allocate-all',
  templateUrl: './financial-auto-allocate-all.component.html',
  styleUrls: ['./financial-auto-allocate-all.component.scss'],
})
export class FinancialAutoAllocateAllComponent implements OnInit, OnDestroy {

  @Output() FinancialAutoAllocateAllComponent: EventEmitter<string> = new EventEmitter<string>();

  formGroup: FormGroup;
  reasons: FinancialTransactionReason[] = [];
  permissions: PermissionType[] = [];

  private unsubscribeAll$: Subject<any> = new Subject<any>();
  
  constructor(
    public globService: GlobalService,
    private formBuilder: FormBuilder,
    private tranService: TranService,
    private spinnerService: SpinnerService,
    private financialAutoAllocateAllService: FinancialAutoAllocateAllService
  ) { }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      CreateEvent: true,
      Note: '',
      ReasonCode: ['', Validators.required],
      DeleteExisting: false,
      ZeroBalanceOnly: false,
      UseDates: false,
    })
    this.getPermission();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  goBack(): void {
    this.FinancialAutoAllocateAllComponent.emit('close');
  }

  submitTrigger(): void {
    document.getElementById('submitButton').click();
  }

  onSubmit(): void {
    this.spinnerService.loading();
    this.financialAutoAllocateAllService.allocateAllFinancialTransactionsAutomatically(this.formGroup.value)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: () => {
          this.spinnerService.end();
          this.tranService.errorToastOnly('AutoAllocatesAllFinancialTransactionsSuccess');
          setTimeout(() => this.goBack(), 1000);
        },
        error: error => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      })
  }

  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/FinancialTransactions/AutoAllocate/All', "").replace('/', "") as PermissionType);
  }

  private getFinancialTransactionReasons(): void {
    this.financialAutoAllocateAllService.getFinancialTransactionReasons()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => {
          this.spinnerService.end();
          result.length === 0
            ? this.tranService.errorMessage('NoReasons')
            : this.reasons = result;
        },
        error: error => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      })
  }

  private getPermission(): void {
    this.spinnerService.loading();
    this.globService.getAuthorization('/FinancialTransactions/AutoAllocate/All', true)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: (result: Permission[]) => {
          this.formatPermissions(result);
          if (this.permissions.includes('')) {
            this.getFinancialTransactionReasons();
          } else {   
            this.spinnerService.end();
            this.tranService.errorMessage('resource_forbidden');
            setTimeout(() => this.goBack(), 1000);
          }
        },
        error: (error) => {
          this.spinnerService.end();
          const errResult = this.globService.ConvertKeysToLowerCase(error);
          this.tranService.errorMessage('resource_forbidden');

          if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
            setTimeout(() => this.goBack(), 1000);
          }
        }
      });
  }

}
