import { FormGroup } from '@angular/forms';
import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { SpinnerService } from 'src/app/Shared/services';
import { TranService } from 'src/services';
import { NewAccountService } from '../../services';
import { AccountConfiguration, AccountTypeElement, AccountTypeFormGroup } from '../../models';

@Component({
  selector: 'app-new-account-type',
  templateUrl: './new-account-type.component.html',
  styleUrls: ['./new-account-type.component.scss'],
})
export class NewAccountTypeComponent implements OnInit, OnDestroy {

  @Input() formGroup: FormGroup<AccountTypeFormGroup>;
  @Input() accountConfiguration: AccountConfiguration;
  @Output() onUpdateAccountConfiguration = new EventEmitter<AccountConfiguration>();

  accountTypes: AccountTypeElement[] = [
    { Value: 'corporation', Label: 'Corporate' },
    { Value: 'person', Label: 'Person' }
  ];

  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private spinnerService: SpinnerService,
    private newAccountService: NewAccountService,
    private tranService: TranService
  ) {}

  ngOnInit(): void {
    this.formGroup.controls.AccountType.valueChanges
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe(() => this.getConfiguration());
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  private getConfiguration(): void {
    this.spinnerService.loading();
    (
      this.formGroup.controls.AccountType.value === 'person'
        ? this.newAccountService.getConfigrationForPerson() 
        : this.newAccountService.getConfigrationForCorporate()
    )
      .pipe(
        takeUntil(this.unsubscribeAll$),
        finalize(() => this.spinnerService.end())
      )
      .subscribe({
        next: result => this.onUpdateAccountConfiguration.emit(result),
        error: error => this.tranService.errorMessage(error)
      });
  }

}
