import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

import { CostCenterConfiguration, GeneralLedgerAccount } from '../../models';
import { SpinnerService } from 'src/app/Shared/services';
import { TranService } from 'src/services';
import { AlertService } from 'src/services/alert-service.service';
import { GlobalService } from 'src/services/global-service.service';
import { ServiceCostCentersService } from '../../services';



@Component({
  selector: 'app-service-cost-center-new',
  templateUrl: './service-cost-center-new.component.html',
  styleUrls: ['./service-cost-center-new.component.scss'],
})
export class ServiceCostCenterNewComponent implements OnInit {

  configuration: CostCenterConfiguration;
  form: FormGroup;
  statusList: string[] = [ 'Open', 'Closed', 'Cancelled', 'OnHold' ];
  showSpinner: boolean = false;
  allocationTypes: string[] = [ 'Bill', 'Date' ];
  generalLedgerAccounts: GeneralLedgerAccount[] = [];
  isInfinity: boolean;
  minToDate: Date;
  
  private availableGeneralLedgerAccountCodeField: boolean = false;
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private alertService: AlertService,
    private tranService: TranService,
    private costCenterService: ServiceCostCentersService,
    private formBuilder: FormBuilder,
    public globService: GlobalService,
    private spinnerService: SpinnerService,
    private dialogRef: MatDialogRef<ServiceCostCenterNewComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { configuration: CostCenterConfiguration, serviceReference: string }
  ) {
    this.form = this.formBuilder.group({
      Name: ['', Validators.required],
      CustomerReference: [''],
      AdditionalInformation1: [''],
      AdditionalInformation2: [''],
      AdditionalInformation3: [''],
      GeneralLedgerAccountCode: [''],
      AggregationPoint: false,
      Status: ['Open'],
      Email: ['', Validators.email],
      EFXId: [''],
      AllocationType: ['Date'],
      FromDateTime: ['', Validators.required],
      ToDateTime: [{value: '', disabled: true}, Validators.required],
      Percentage: [100, [Validators.min(0), Validators.max(100)]]
    });
  }

  ngOnInit(): void {
    this.isInfinity = true;
    this.configuration = this.data.configuration;
    this.form.get('FromDateTime').valueChanges
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe(()=>this.minToDate = this.form.get('FromDateTime').value);
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

    this.form.get('FromDateTime').setValue(new Date());
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

  submitCreateCostCenter(): void {
    document.getElementById('createCostCenterButton').click();
  }
  
  createCostCenter(): void {
    this.spinnerService.loading();
    this.costCenterService.createCostCenter(this.form.value, this.data.serviceReference)
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

  onChangeInfinity() {
    !this.isInfinity
      ? this.form.get('ToDateTime').enable()
      : this.form.get('ToDateTime').disable()
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
