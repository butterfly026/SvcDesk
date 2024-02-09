import { FormGroup } from '@angular/forms';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { TranService } from 'src/services';
import { SpinnerService } from 'src/app/Shared/services';
import { GlobalService } from 'src/services/global-service.service';
import { NewAccountService } from '../../services';
import { AccountConfiguration, AccountStatus, AccountDetailsFormGroup } from '../../models';

@Component({
  selector: 'app-new-account-details',
  templateUrl: './new-account-details.component.html',
  styleUrls: ['./new-account-details.component.scss'],
})
export class NewAccountDetailsComponent implements OnInit {

  @Input() formGroup: FormGroup<AccountDetailsFormGroup>;
  @Input() accountConfiguration: AccountConfiguration;
  @Input() accountType: 'person' | 'corporation';

  accountStatuses: AccountStatus[] = [];
  businessUnits: { Id: string; Name: string; }[] = [];
  titleListForPerson: { Id: string; Name: string; }[] = [
    { Name: 'Mr', Id: 'Mr' },
    { Name: 'Mrs', Id: 'Mrs' },
    { Name: 'Miss', Id: 'Miss' },
    { Name: 'Ms', Id: 'Ms' },
    { Name: 'Dr', Id: 'Dr' },
    { Name: 'Mr/s', Id: 'Mr/s' },
    { Name: 'Count', Id: 'Count' },
    { Name: 'Fr', Id: 'Fr' },
    { Name: 'Judge', Id: 'Judge' },
    { Name: 'Lady', Id: 'Lady' },
    { Name: 'Lord', Id: 'Lord' },
    { Name: 'Major', Id: 'Major' },
    { Name: 'MP', Id: 'MP' },
    { Name: 'Prof', Id: 'Prof' },
    { Name: 'Rev', Id: 'Rev' },
    { Name: 'Sir', Id: 'Sir' },
  ];
  genderListForPerson: { Id: string; Name: string; }[] = [
    { Name: 'Male', Id: 'male' },
    { Name: 'Female', Id: 'female' },
    { Name: 'Undefined', Id: 'undefined' }
  ];

  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private newAccountService: NewAccountService,
    private tranService: TranService,
    private spinnerService: SpinnerService,
    private globaService: GlobalService
  ) { }

  ngOnInit() {
    this.getBusinessUnites();
    this.getAccountStatuses();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.accountConfiguration?.currentValue) {
      switch ((changes.accountConfiguration.currentValue as AccountConfiguration).Details.AccountId.Method) {
        case 'Manual':
          this.formGroup.controls.Id.enable();
          break;
        case 'Automatic':
          this.formGroup.controls.Id.disable();
          break;
        case 'AutomaticAndManual':
          this.formGroup.controls.Id.enable();
          break;
        default:
          break;
      }
    }

    if (changes.accountType?.currentValue) {
      this.toggleFormGroupsByAccountType()
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  private toggleFormGroupsByAccountType(): void {
    if (this.accountType === 'person') {
      this.formGroup.controls.Gender.enable();
      this.formGroup.controls.Title.enable();
      this.formGroup.controls.FirstName.enable();
      this.formGroup.controls.DateOfBirth.enable();
      this.formGroup.controls.TradingName.enable();
      this.formGroup.controls.SubTypeId.disable();
      this.formGroup.controls.Name.disable();
    } else {
      this.formGroup.controls.Gender.disable();
      this.formGroup.controls.Title.disable();
      this.formGroup.controls.FirstName.disable();
      this.formGroup.controls.DateOfBirth.disable();
      this.formGroup.controls.TradingName.disable();
      this.formGroup.controls.SubTypeId.enable();
      this.formGroup.controls.Name.enable();
    }
  }

  private getBusinessUnites(): void {
    this.globaService.getBusinessUnits()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => this.businessUnits = result,
        error: error => this.tranService.errorMessage(error)
      });
  }

  private getAccountStatuses(): void {
    this.newAccountService.getAccountStatuses()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => this.accountStatuses = result,
        error: error => this.tranService.errorMessage(error)
      });
  }

}
