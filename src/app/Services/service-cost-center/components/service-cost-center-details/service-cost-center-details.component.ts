import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SpinnerService } from 'src/app/Shared/services';
import { TranService } from 'src/services';
import { AlertService } from 'src/services/alert-service.service';
import { GlobalService } from 'src/services/global-service.service';
import { ServiceCostCenterEditComponent } from '..';
import { ServiceCostCentersService } from '../../services';
import { GeneralLedgerAccount, CostCenter, CostCenterConfiguration } from '../../models';



@Component({
  selector: 'app-service-cost-center-details',
  templateUrl: './service-cost-center-details.component.html',
  styleUrls: ['./service-cost-center-details.component.scss'],
})
export class ServiceCostCenterDetailsComponent implements OnInit {

  configuration: CostCenterConfiguration;
  form: FormGroup;
  statusList: string[] = [ 'Open', 'Closed', 'Cancelled', 'OnHold' ];
  showSpinner: boolean = false;
  allocationTypes: string[] = [ 'Bill', 'Date' ];
  generalLedgerAccounts: GeneralLedgerAccount[] = [];
  
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private alertService: AlertService,
    private costCenterService: ServiceCostCentersService,
    private tranService: TranService,
    private formBuilder: FormBuilder,
    public globService: GlobalService,
    private spinnerService: SpinnerService,
    private dialogRef: MatDialogRef<ServiceCostCenterEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { configuration: CostCenterConfiguration, costCenterData: CostCenter }
  ) {    
  }

  ngOnInit(): void {    
    this.configuration = this.data.configuration;
    this.getCostCenterDetail();
  }

  ngOnDestroy(): void {
    this.alertService.closeAllAlerts();
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  close(val?: 'ok'): void {
    this.dialogRef.close(val);
  }

  private getCostCenterDetail(): void {
    this.spinnerService.loading();
    this.costCenterService.getCostCenter(this.data.costCenterData.Id)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => {
          this.spinnerService.end();
          this.form = this.formBuilder.group(result);
          this.form.disable();
        },
        error: error => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      })
  }

}
