import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TranService } from 'src/services';
import { AccountOptionsService } from '../../services';
import { AccountConfiguration, AccountOptionsFormGroup, BillingCycle, CreditStatus, Tax, TimeZone } from '../../models';

@Component({
  selector: 'app-new-account-options',
  templateUrl: './new-account-options.component.html',
  styleUrls: ['./new-account-options.component.scss'],
})
export class NewAccountOptionsComponent implements OnInit, OnChanges {

  @Input() formGroup: FormGroup<AccountOptionsFormGroup>;
  @Input() accountConfiguration: AccountConfiguration;
  @Input() businessUnitCode: string;

  billingCycles: BillingCycle[] = [];
  taxes: Tax[] = [];
  timeZones: TimeZone[] = [];
  creditStatuses: CreditStatus[] = [];

  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private accountOptionsService: AccountOptionsService,
    private tranService: TranService
  ) { }

  ngOnInit(): void {
    this.getTaxes();
    this.getDefaultTimeZones();
    this.getCreditStatuses();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.businessUnitCode?.currentValue) {
      this.getBillingCycles();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  private getBillingCycles(): void {
    this.accountOptionsService.getBillingCycles(this.businessUnitCode)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => this.billingCycles = result,
        error: error => this.tranService.errorMessage(error)
      });
  }

  private getTaxes(): void {
    this.accountOptionsService.getTaxes()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => this.taxes = result,
        error: error => this.tranService.errorMessage(error)
      });
  }

  private getDefaultTimeZones(): void {
    this.accountOptionsService.getDefaultTimeZones()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => this.timeZones = result,
        error: error => this.tranService.errorMessage(error)
      });
  }

  private getCreditStatuses(): void {
    this.accountOptionsService.getCreditStatuses()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => this.creditStatuses = result,
        error: error => this.tranService.errorMessage(error)
      });
  }

}
