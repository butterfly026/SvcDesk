import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { debounceTime, takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Paging } from 'src/app/model';
import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { SpinnerService } from 'src/app/Shared/services';
import { DialogComponent } from 'src/app/Shared/components';
import { ServiceNewPlanDetailComponent } from '..';
import { ServiceNewService, ServicePlanService } from '../../services';
import { AvailablePlan, AvailablePlanOption, ServiceConfiguration, ServiceStatus, SecondFormGroup, ThirdFormGroup } from '../../models';

@Component({
  selector: 'app-service-new-plan',
  templateUrl: './service-new-plan.component.html',
  styleUrls: ['./service-new-plan.component.scss']
})
export class ServiceNewPlanComponent implements OnInit, OnDestroy {

  @Input() isOpened: boolean;
  @Input() isPorting: boolean;
  @Input() formGroup: FormGroup<ThirdFormGroup>;
  @Input() ServiceReferenceId: string = '';
  @Input() ContactCode: string = '';
  @Input() serviceConfiguration: ServiceConfiguration;
  @Input() ServiceTypeId: string = '';

  @Output('ServiceNewPlanComponent') ServiceNewPlanComponent: EventEmitter<any> = new EventEmitter<any>();

  statusList: ServiceStatus[] = [];
  planOptionList: AvailablePlanOption[] = [];
  filteredPlanList: AvailablePlan[] = [];
  showSpinner: boolean = false;
  availableCallPlan: boolean = true;
  currentPlan: AvailablePlan;
  eventParam = { ...new Paging(), TakeRecords: 20 };
  minConnectionDate: Date;
  maxConnectionDate: Date;

  timeList = [
    { value: 'startOfDay', label: 'start_of_day' },
    { value: 'now', label: 'now' },
    { value: 'endOfDay', label: 'end_of_day' },
  ];

  private planList: AvailablePlan[] = [];
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    public globService: GlobalService,
    private tranService: TranService,
    private servicePlanService: ServicePlanService,
    private serviceNewService: ServiceNewService,
    private spinnerService: SpinnerService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.formGroup.controls.Plan.valueChanges
      .pipe(
        takeUntil(this.unsubscribeAll$),
        debounceTime(1000)
      )
      .subscribe(result => {
        result === ''
          ? delete this.eventParam.SearchString
          : this.eventParam.SearchString = result;
        if(result){
          this.availableCallPlan
            ? this.getPlans()
            : this.availableCallPlan = true;
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.serviceConfiguration?.currentValue) {
      this.minConnectionDate = this.serviceConfiguration?.ConnectionDate?.AllowPast ? undefined : new Date();
      this.maxConnectionDate = this.serviceConfiguration?.ConnectionDate?.AllowScheduled ? undefined : new Date();

      this.configFormFieldByConfiguration();
    }

    if (!!changes.isOpened?.currentValue) {
      this.configServiceId();
    }

    if (changes.isPorting !== undefined && this.serviceConfiguration?.Status?.Enabled) {
      this.getStatuses();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  showDetail(): void {
    this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '650px',
      maxHeight: '720px',
      panelClass: 'dialog',
      data: {
        component: ServiceNewPlanDetailComponent,
        planId: this.currentPlan.PlanId
      }
    });
  }

  selectPlan(event: MatAutocompleteSelectedEvent): void {
    this.currentPlan = this.planList.find(s => s.PlanId === event.option.value);

    if (this.currentPlan) {
      this.formGroup.get('PlanOptionId').reset();
      this.formGroup.get('Plan').setValue(this.currentPlan.DisplayName);
      this.formGroup.controls.PlanId.setValue(this.currentPlan.PlanId);
      this.planOptionList = this.currentPlan.Options;
      this.formGroup.get('PlanOptionId').setValue(
        this.planOptionList.find(s => s.Default)
          ? this.planOptionList.find(s => s.Default).Id
          : this.planOptionList[0].Id
      );
      this.availableCallPlan = false;
    }
  }

  private configFormFieldByConfiguration(): void {  
    if (!this.serviceConfiguration?.Status?.Enabled) {
      this.formGroup.controls.Status.disable();
    }

    if (!this.serviceConfiguration?.ServiceEnquiryPassword) {
      this.formGroup.controls.EnquiryPassword.disable();
    }

    if (!this.serviceConfiguration?.ConnectionDate?.Enabled) {
      this.formGroup.controls.ConnectionDate.disable();
      this.formGroup.controls.EndDate.disable();
    } 
    else if (this.serviceConfiguration?.ConnectionDate?.DefaultTimeOfDay == 'Current') {
      this.formGroup.controls.ConnectionDate.setValue(this.globService.getDateTimeWithString('YYYY-MM-DD', new Date()));
      this.formGroup.controls.EndDate.setValue('now');
    }
  }

  private configServiceId(): void {
    if (!!this.formGroup.controls.ServiceId.value) {
      this.formGroup.controls.ServiceId.disable();
    }
    else {
      if (
        this.serviceConfiguration?.ServiceIds?.Method === 'AutomaticPreAllocated' || 
        this.serviceConfiguration?.ServiceIds?.Method === 'AutomaticPostAllocated'
      ) {
        this.formGroup.controls.ServiceId.disable();
      }
      if (
        this.serviceConfiguration?.ServiceIds?.Method === 'AutomaticPreAllocated' || 
        this.serviceConfiguration?.ServiceIds?.Method === 'AutomaticPreAllocatedManual'
      ) {
        this.getNextServiceId(this.ServiceTypeId);
      }
      if (this.serviceConfiguration?.ServiceIds?.Method === 'AutomaticPostAllocated') {
        this.formGroup.controls.ServiceId.setValue('TBA');
        this.formGroup.controls.ServiceId.disable();
      }
    }
  }

  private getPlans(): void {
    this.showSpinner = true;
    this.servicePlanService.getAvailableServicePlans(this.ServiceTypeId, this.ContactCode, this.eventParam)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => {
          this.showSpinner = false;
          this.planList = result.Plans;
          this.filteredPlanList = this.planList.filter(s => (s.Plan as string).toLowerCase().includes(this.eventParam.SearchString));
          this.formGroup.controls.PlanOptionId.reset();
        },
        error: error => {
          this.showSpinner = false;
          this.tranService.errorMessage(error);
        }
      });
  }

  private getStatuses(): void {
    this.spinnerService.loading();
    this.servicePlanService.getStatuses(this.ServiceTypeId, this.isPorting ? 'PortIn' : 'Order')
      .pipe(
        takeUntil(this.unsubscribeAll$),
        finalize(() => this.spinnerService.end())
      )
      .subscribe({
        next: result => {
          if(result && result.length > 0) {
            this.statusList = result;
            const defaultStatus = this.statusList.find(s => s.Id == this.serviceConfiguration.Status.Default);
            if(defaultStatus){
              this.formGroup.get('Status').setValue(defaultStatus.Id);
            }
          }
        },
        error: error => this.tranService.errorMessage(error)
      });
  }

  private getNextServiceId(ServiceTypeId: string): void {
    this.spinnerService.loading();
    this.serviceNewService.getServiceId(ServiceTypeId)
      .pipe(
        takeUntil(this.unsubscribeAll$),
        finalize(() => this.spinnerService.end())
      )
      .subscribe({
        next: response => this.formGroup.controls.ServiceId.setValue(response?.ServiceId), 
        error: error => this.tranService.errorMessage(error)
      });
  }

}
