import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

import { CostCenterConfiguration, GeneralLedgerAccount, CostCenter } from '../../models';
import { SpinnerService } from 'src/app/Shared/services';
import { TranService } from 'src/services';
import { AlertService } from 'src/services/alert-service.service';
import { GlobalService } from 'src/services/global-service.service';
import { ServiceCostCentersService } from '../../services';



@Component({
  selector: 'app-service-cost-center-edit',
  templateUrl: './service-cost-center-edit.component.html',
  styleUrls: ['./service-cost-center-edit.component.scss'],
})
export class ServiceCostCenterEditComponent implements OnInit {

  configuration: CostCenterConfiguration;
  form: FormGroup;
  statusList: string[] = [ 'Open', 'Closed', 'Cancelled', 'OnHold' ];
  showSpinner: boolean = false;
  allocationTypes: string[] = [ 'Bill', 'Date' ];
  generalLedgerAccounts: GeneralLedgerAccount[] = [];
  
  private availableGeneralLedgerAccountCodeField: boolean = false;
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private alertService: AlertService,
    private tranService: TranService,
    private costCenterService: ServiceCostCentersService,
    private formBuilder: FormBuilder,
    public globService: GlobalService,
    private spinnerService: SpinnerService,
    private dialogRef: MatDialogRef<ServiceCostCenterEditComponent>,
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
      ).subscribe(result => {
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

    this.costCenterService.getGeneralLedger({
      BusinessUnitCode: '',
      TypeId: 'Revenue', 
      SearchString,
    })
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => {
          this.generalLedgerAccounts = result;
          this.showSpinner = false;
        },
        error: error => {
          this.showSpinner = false;
          this.tranService.errorMessage(error);
        }
      });
  }

}
