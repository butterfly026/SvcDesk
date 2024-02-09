import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Account, CostCenter, CostCenterConfiguration } from '../../models';
import { TranService } from 'src/services';
import { AlertService } from 'src/services/alert-service.service';
import { GlobalService } from 'src/services/global-service.service';
import { SpinnerService } from 'src/app/Shared/services';
import { ContactsCostCentersService } from '../../services';

@Component({
  selector: 'app-contacts-cost-centers-edit',
  templateUrl: './contacts-cost-centers-edit.component.html',
  styleUrls: ['./contacts-cost-centers-edit.component.scss'],
})
export class ContactsCostCentersEditComponent implements OnInit {

  configuration: CostCenterConfiguration;
  form: FormGroup;
  statusList: string[] = [ 'Open', 'Closed', 'Cancelled', 'OnHold' ];
  showSpinner: boolean = false;
  allocationTypes: string[] = [ 'Bill', 'Date' ];
  generalLedgerAccounts: Account[] = [];
  
  private availableGeneralLedgerAccountCodeField: boolean = false;
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private alertService: AlertService,
    private tranService: TranService,
    private costCenterService: ContactsCostCentersService,
    private formBuilder: FormBuilder,
    public globService: GlobalService,
    private spinnerService: SpinnerService,
    private dialogRef: MatDialogRef<ContactsCostCentersEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { configuration: CostCenterConfiguration, costCenterData: CostCenter }
  ) {    
  }

  ngOnInit(): void {
    this.configuration = this.data.configuration;
    this.form = this.formBuilder.group(this.data.costCenterData);
    this.form.get('Name').addValidators(Validators.required);
    this.form.get('Email').addValidators(Validators.email);
    
    this.form.get('GeneralLedgerAccountCode').valueChanges
      .pipe(
        takeUntil(this.unsubscribeAll$),
        debounceTime(1000)
      ).subscribe((result: any) => {
        if (result && this.availableGeneralLedgerAccountCodeField) {
          this.getGeneralLedgerAccounts(result);
        }
        this.availableGeneralLedgerAccountCodeField = true;
      });
  }

  ngOnDestroy(): void {
    this.alertService.closeAllAlerts();
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  close(val?: 'ok'): void {
    this.dialogRef.close(val);
  }

  selectGLAccount(event: MatAutocompleteSelectedEvent): void {
    this.availableGeneralLedgerAccountCodeField = false;
  }

  submit(): void {
    document.getElementById('updateCostCenterButton').click();
  }
  
  updateCostCenter(): void {
    this.spinnerService.loading();
    this.costCenterService.updateCostCenter(this.form.value, this.data.costCenterData.Id)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => {
          this.spinnerService.end();
          this.tranService.errorToastMessage(result);
          this.close('ok');
        },
        error: error => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      })

  }

  private getGeneralLedgerAccounts(SearchString: string): void {
    this.showSpinner = true;

    this.costCenterService.getGeneralLedger({ TypeId: 'Revenue', SearchString })
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe(async (result: any) => {
        this.generalLedgerAccounts = result;
        this.showSpinner = false;
      }, async (error: any) => {
        this.showSpinner = false;
        this.tranService.errorMessage(error);
      });
  }

}
