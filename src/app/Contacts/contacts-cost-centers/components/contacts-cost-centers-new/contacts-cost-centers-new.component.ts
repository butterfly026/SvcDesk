import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranService } from 'src/services';
import { ContactsCostCentersService } from '../../services';
import { GlobalService } from 'src/services/global-service.service';
import { Account, CostCenterConfiguration } from '../../models';
import { SpinnerService } from 'src/app/Shared/services';
import { AlertService } from 'src/services/alert-service.service';

@Component({
  selector: 'app-contacts-cost-centers-new',
  templateUrl: './contacts-cost-centers-new.component.html',
  styleUrls: ['./contacts-cost-centers-new.component.scss'],
})
export class ContactsCostCentersNewComponent implements OnInit, OnDestroy {

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
    private dialogRef: MatDialogRef<ContactsCostCentersNewComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { configuration: CostCenterConfiguration, contactCode: string }
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
      AllocationType: ['Date']
    });
  }

  ngOnInit(): void {
    this.configuration = this.data.configuration;
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

  submitCreateCostCenter(): void {
    document.getElementById('createCostCenterButton').click();
  }
  
  createDocument(): void {
    this.spinnerService.loading();
    this.costCenterService.createCostCenter(this.form.value, this.data.contactCode)
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
