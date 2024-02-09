import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject, timer } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { Paging } from 'src/app/model';
import { AvailablePlan, AvailablePlanOption } from 'src/app/Plan/History/Service/models';
import { ServicePlanService } from 'src/app/Plan/History/Service/services';
import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { SpinnerService } from 'src/app/Shared/services';
import { ServiceNovationsService } from '../../services';
import { NovationContact } from '../../models';
import { ServicePlanDetailComponent } from 'src/app/Plan/History/Service/components';

@Component({
  selector: 'app-service-novations-new',
  templateUrl: './service-novations-new.component.html',
  styleUrls: ['./service-novations-new.component.scss'],
})
export class ServiceNovationsNewComponent implements OnInit, OnDestroy {

  formGroup: FormGroup;
  eventParam = new Paging();
  currentDate = new Date();
  
  showSpinnerForPlan: boolean = false;
  availableCallPlan: boolean = true;
  currentPlan: AvailablePlan;
  optionList: AvailablePlanOption[] = [];
  
  currentNovationContact: NovationContact;
  showSpinnerForNovationContact: boolean = false;
  availableCallNovationContact: boolean = true;

  novationContactList: NovationContact[] = [];
  planList: AvailablePlan[] = [];
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    public globService: GlobalService,
    private spinnerService: SpinnerService,
    private serviceNovationsService: ServiceNovationsService,
    private tranService: TranService,
    private servicePlanService: ServicePlanService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ServiceNovationsNewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { serviceReferenceId: number }
  ) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      Account: ['', Validators.required],
      Plan: [{value: '', disabled: true}],
      PlanOptionId: [{value: '', disabled: true}],
      Scheduled: [this.currentDate, Validators.required],
      Note: ['']
    });

    this.formGroup.get('Plan').valueChanges
      .pipe(
        takeUntil(this.unsubscribeAll$),
        debounceTime(1000)
      )
      .subscribe(result => {
        console.warn("dadas =>", result)
        result === ''
          ? delete this.eventParam.SearchString
          : this.eventParam.SearchString = result;

        this.availableCallPlan 
          ? this.getPlans() 
          : this.availableCallPlan = true;
      });

    this.formGroup.get('Account').valueChanges
      .pipe(
        takeUntil(this.unsubscribeAll$),
        debounceTime(1000)
      )
      .subscribe(result => {
        result === ''
          ? delete this.eventParam.SearchString
          : this.eventParam.SearchString = result;

        this.availableCallNovationContact 
          ? this.getNovationContacts() 
          : this.availableCallNovationContact = true;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  submitTrigger(): void {
    document.getElementById('submitButton').click();
  }

  submitForm(): void {
    if (this.formGroup.valid) {
      const payload = {
        AccountCode: this.currentNovationContact.ContactCode,
        PlanId: this.currentPlan?.PlanId || null,
        PlanOptionId: this.formGroup.get('PlanOptionId').value || null,
        Scheduled: this.formGroup.get('Scheduled').value || null,
        Note: this.formGroup.get('Note').value || null,
      };
  
      this.spinnerService.loading();
      this.serviceNovationsService.novateService(payload, this.data.serviceReferenceId)
        .pipe(takeUntil(this.unsubscribeAll$))
        .subscribe({
          next: () => {
            this.spinnerService.end();
            this.tranService.errorToastOnly('ServiceNovatedSuccessfully');
            timer(500).pipe(takeUntil(this.unsubscribeAll$)).subscribe(() => this.dialogRef.close('ok'));
          },
          error: error => {
            this.spinnerService.end();
            this.tranService.errorMessage(error);
          }
        })
    }
  }

  selectPlan(event: MatAutocompleteSelectedEvent): void {
    this.formGroup.get('PlanOptionId').reset();
    this.currentPlan = this.planList.find(s => s.PlanId === event.option.value);

    if (this.currentPlan) {
      this.formGroup.get('Plan').setValue(this.currentPlan.DisplayName);
      this.optionList = this.currentPlan.Options;
      this.formGroup.get('PlanOptionId').setValue(
        this.optionList.find(s => s.Default)
          ? this.optionList.find(s => s.Default).Id 
          : this.optionList[0].Id
      )

      this.availableCallPlan = false;
    }
  }

  selectNovationContact(event: MatAutocompleteSelectedEvent): void {
    this.currentNovationContact = this.novationContactList.find(s => s.ContactCode === event.option.value);
    if (this.currentNovationContact) {
      this.formGroup.get('Plan').enable({emitEvent: false});
      this.formGroup.get('PlanOptionId').enable({emitEvent: false});
      this.formGroup.get('Account').setValue(this.currentNovationContact.Name);
      this.availableCallNovationContact = false;
    }
  }

  showPlanDetail(): void {
    this.dialog.open(ServicePlanDetailComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '650px',
      maxHeight: '840px',
      data: {
        serviceReferenceId: this.data.serviceReferenceId,
        planId: this.currentPlan.PlanId
      },
    });
  }

  private getPlans(): void {
    this.showSpinnerForPlan = true;
    this.servicePlanService.getAvailableServicePlans(this.data.serviceReferenceId, this.eventParam)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => {
          this.showSpinnerForPlan = false;
          this.planList = result.Plans;
          this.formGroup.get('PlanOptionId').reset();
        },
        error: error => {
          this.showSpinnerForPlan = false;
          this.tranService.errorMessage(error);
        }
      });
  }

  private getNovationContacts(): void {
    this.formGroup.get('Plan').disable({emitEvent: false});
    this.formGroup.get('PlanOptionId').disable({emitEvent: false});
    this.showSpinnerForNovationContact = true;
    this.serviceNovationsService.searchServiceNovationAccounts(this.data.serviceReferenceId, this.eventParam)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => {
          this.showSpinnerForNovationContact = false;
          this.novationContactList = result;
        },
        error: error => {
          this.showSpinnerForNovationContact = false;
          this.tranService.errorMessage(error);
        }
      })
  }

}
