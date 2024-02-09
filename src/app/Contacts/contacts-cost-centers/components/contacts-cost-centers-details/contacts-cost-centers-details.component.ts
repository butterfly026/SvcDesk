import { Component, OnInit, Inject } from '@angular/core';
import { Account, CostCenter, CostCenterConfiguration } from '../../models';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { AlertService } from 'src/services/alert-service.service';
import { TranService } from 'src/services';
import { ContactsCostCentersService } from '../../services';
import { SpinnerService } from 'src/app/Shared/services';
import { GlobalService } from 'src/services/global-service.service';
import { ContactsCostCentersEditComponent } from '../contacts-cost-centers-edit/contacts-cost-centers-edit.component';

@Component({
  selector: 'app-contacts-cost-centers-details',
  templateUrl: './contacts-cost-centers-details.component.html',
  styleUrls: ['./contacts-cost-centers-details.component.scss'],
})
export class ContactsCostCentersDetailsComponent implements OnInit {

  configuration: CostCenterConfiguration;
  form: FormGroup;
  statusList: string[] = [ 'Open', 'Closed', 'Cancelled', 'OnHold' ];
  showSpinner: boolean = false;
  allocationTypes: string[] = [ 'Bill', 'Date' ];
  generalLedgerAccounts: Account[] = [];
  
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private alertService: AlertService,
    private costCenterService: ContactsCostCentersService,
    private tranService: TranService,
    private formBuilder: FormBuilder,
    public globService: GlobalService,
    private spinnerService: SpinnerService,
    private dialogRef: MatDialogRef<ContactsCostCentersEditComponent>,
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
