import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil, filter, switchMap } from 'rxjs/operators';

import { TranService } from 'src/services';
import { Paging } from 'src/app/model';
import { ConvertDateFormatService } from 'src/services/convert-dateformat.service';
import { GlobalService } from 'src/services/global-service.service';
import { AlertService } from 'src/services/alert-service.service';
import { SpinnerService } from 'src/app/Shared/services';
import { ServicePlanService } from '../../services';
import { AvailablePlan, AvailablePlanOption, BulkApplyOption, PlanChangeConfiguration, PlanChangeConfigurationPropertyName, PlanChangePeriod, ScheduledPlan } from '../../models';
import { Permission, PermissionType } from 'src/app/Shared/models';
import { ServicePlanDetailComponent } from '..';

@Component({
  selector: 'app-service-plan-new',
  templateUrl: './plan-new.component.html',
  styleUrls: ['./plan-new.component.scss'],
})
export class PlanNewComponent implements OnInit {
  @Input() ServiceReferenceId: number;

  @Output('PlanNewComponent') PlanNewComponent: EventEmitter<string> = new EventEmitter<string>();

  planForm: UntypedFormGroup;
  optionList: AvailablePlanOption[] = [];
  filterPlanList: AvailablePlan[] = [];
  showSpinner: boolean = false;
  availableCallPlan: boolean = true;
  currentPlan: AvailablePlan;
  dateType: 1 | 2 = 1;
  eventParam = new Paging();
  nextBillPeriodValue: PlanChangePeriod;
  schedulePlans: ScheduledPlan[] = [];
  currentScheduledPlan: any;
  showForm: boolean = false;

  timeList = [
    { value: 'startOfDay', label: 'start_of_day' },
    { value: 'now', label: 'now' },
    { value: 'endOfDay', label: 'end_of_day' },
  ];
  cancelFuturePlanChangesOptions = [
    { value: 'No', label: 'no' },
    { value: 'All', label: 'all' },
    { value: 'Future', label: 'future' }
  ];
  bulkApplyOptions: { value: BulkApplyOption; label: string; configurationNames: PlanChangeConfigurationPropertyName[] }[] = [
    { value: 'No', label: 'no', configurationNames: [] },
    { value: 'Account', label: 'account', configurationNames: ['BulkApplyOptions', 'ApplyAccount'] },
    { value: 'Type', label: 'type', configurationNames: ['BulkApplyOptions', 'ApplySameServiceType'] },
    { value: 'Child', label: 'children', configurationNames: ['BulkApplyOptions', 'ApplyChildren'] },
    { value: 'Sibling', label: 'siblings', configurationNames: ['BulkApplyOptions', 'ApplySiblings'] },
    { value: 'Group', label: 'group', configurationNames: ['BulkApplyOptions', 'ApplyGroup'] },
  ];
  networkOptions: { formControlName: string; label: string; configurationNames: PlanChangeConfigurationPropertyName[] }[] = [
    { formControlName: 'SetPlanChange', label: 'set_plan_change_now', configurationNames: ['NetworkOptions', 'SetPlanChange'] },
    { formControlName: 'ForceChange', label: 'force_change', configurationNames: ['NetworkOptions', 'ForceChange'] },
  ];
  chargeOptions:  { formControlName: string; label: string; configurationNames: PlanChangeConfigurationPropertyName[] }[] = [
    { formControlName: 'ReprocessUsage', label: 'reprocess_usage', configurationNames: ['ChargeOptions', 'ReprocessUsage'] },
    { formControlName: 'ProcessSAE', label: 'process_sae', configurationNames: ['ChargeOptions', 'ReprocessSAE'] },
    { formControlName: 'ApplyOneOffCharges', label: 'apply_oneoff_charge', configurationNames: ['ChargeOptions', 'ApplyOneOffCharges'] }
  ];

  private permissions: PermissionType[];
  private planConfiguration: PlanChangeConfiguration;
  private planList: AvailablePlan[] = [];
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    public globService: GlobalService,
    private tranService: TranService,
    private planNewService: ServicePlanService,
    private convertDateFormatService: ConvertDateFormatService,
    private formBuilder: UntypedFormBuilder,
    private alertCtrl: AlertController,
    private alertService: AlertService,
    private spinnerService: SpinnerService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<PlanNewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { serviceReferenceId: number }
  ) {
    this.planForm = this.formBuilder.group({
      plan: ['', Validators.required],
      PlanOptionId: ['', Validators.required],
      OverridePlanChangeFee: [0],
      BulkApply: ['No'],
      CancelFuturePlanChanges: ['No'],
      SetPlanChange: [false],
      ReprocessUsage: [false],
      ProcessSAE: [false],
      ApplyOneOffCharges: [false],
      ForceChange: [false],
      Note: [''],
    });    
    if(!!data) this.ServiceReferenceId = this.data.serviceReferenceId
  }

  ngOnInit(): void {
    this.eventParam.TakeRecords = 20;
    this.switchDateType();
    this.getPermission();

    this.planForm.get('plan').valueChanges
      .pipe(
        takeUntil(this.unsubscribeAll$),
        debounceTime(1000)
      )
      .subscribe(result => {
        result === ''
          ? delete this.eventParam.SearchString
          : this.eventParam.SearchString = result;

        this.availableCallPlan 
          ? this.getPlans() 
          : this.availableCallPlan = true;
      });
  }

  ngOnDestroy(): void {
    this.alertService.closeAllAlerts();
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  selectSchedulePlan(value): void {
    this.currentScheduledPlan = value;
  }

  submitTrigger(): void {
    document.getElementById('submitButton').click();
  }
   
  close(): void {
    if(this.data?.serviceReferenceId){
      this.dialogRef.close()
    }else{
      this.PlanNewComponent.emit('close');
    }
  }

  confirmVisibilityOfOption(value: PlanChangeConfigurationPropertyName[]): boolean {
    switch (value.length) {
      case 0:
        return true;
      case 1:
        return !!this.planConfiguration[value[0]].Enabled;
      case 2:
        return !!this.planConfiguration[value[0]]?.[value[1]]?.Enabled;
      default:
        return false;
    }
  }

  switchDateType(): void {
    if (this.dateType === 2) {
      this.planForm.removeControl('startDate');
      this.planForm.removeControl('endDate');
      this.nextBillPeriod();
    } else {
      this.addDateControl();
    }
  }

  showDetail(): void {
    this.dialog.open(ServicePlanDetailComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '650px',
      maxHeight: '840px',
      data: {
        serviceReferenceId: this.ServiceReferenceId,
        planId: this.currentPlan.PlanId
      },
    });
  }

  submitPlan(): void {
    let reqBody = { 
      ...this.planForm.value, 
      PlanId: this.currentPlan.PlanId,
      Due: this.planForm.get('startDate') && this.dateType === 1
        ? this.convertDateFormatService.newDateFormat(this.planForm.get('startDate').value) + ' ' + this.planForm.get('endDate').value
        : this.nextBillPeriodValue.From
    };

    delete reqBody.startDate;
    delete reqBody.endDate;

    this.spinnerService.loading();
    this.planNewService.createPlanChangeRequest(this.ServiceReferenceId, reqBody)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: () => {
          this.spinnerService.end();
          this.getScheduledPlan();
          this.tranService.errorToastOnly('service_plan_change_scheduled');
        },
        error: error => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      });
  }

  async showDeleteAlert(value): Promise<void> {
    const alert = await this.alertCtrl.create({
      subHeader: this.tranService.instant('delete_schedule_change'),
      message: this.tranService.instant('are_you_sure'),
      buttons: [
        {
          text: this.tranService.instant('delete'),
          handler: () => this.deleteScheduledPlanChange(value)
        },
        {
          text: this.tranService.instant('cancel'),
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

  async selectPlan(event: MatAutocompleteSelectedEvent): Promise<void> {
    this.planForm.get('PlanOptionId').reset();
    this.currentPlan = this.planList.find(s => s.PlanId === event.option.value);

    if (this.currentPlan) {
      this.planForm.get('plan').setValue(this.currentPlan.DisplayName);
      this.optionList = this.currentPlan.Options;
      this.planForm.get('PlanOptionId').setValue(
        this.optionList.find(s => s.Default)
          ? this.optionList.find(s => s.Default).Id 
          : this.optionList[0].Id
      )

      this.availableCallPlan = false;
      if (this.currentPlan.CycleLocked) {
        this.planForm.removeControl('startDate');
        this.planForm.removeControl('endDate');
        await this.nextBillPeriod();
      } else {
        this.switchDateType();
      }
    }
  }

  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/Services/Plans', "").replace('/', "") as PermissionType);
  }

  private addDateControl(): void {
    this.planForm.addControl('startDate', new UntypedFormControl(new Date(), Validators.required));
    this.planForm.addControl('endDate', new UntypedFormControl('now', Validators.required));

    this.planForm.get('startDate').valueChanges
      .pipe(
        takeUntil(this.unsubscribeAll$), 
        filter(s => !!s)
      )
      .subscribe((result: any) => {
        if (new Date(this.planForm.get('startDate').value).getTime() > new Date().getTime()) {
          this.planForm.get('endDate').setValue('startOfDay');
        }

        if (
          this.globService.getDateTimeWithString('YYYY-MM-DD', this.planForm.get('startDate').value) === 
          this.globService.getDateTimeWithString('YYYY-MM-DD', new Date())
        ) {
          this.planForm.get('endDate').setValue('now');
        }
      });
  }

  private deleteScheduledPlanChange(value): void {
    this.spinnerService.loading();
    this.planNewService.deleteScheduledPlanChange(value.id)
      .subscribe({
        next: () => {
          this.spinnerService.end();
          if (value.id === this.currentScheduledPlan.id) {
            this.currentScheduledPlan = null;
          }
        },
        error: error => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      });
  }

  private nextBillPeriod(): void {
    this.spinnerService.loading();
    this.planNewService.getServicePlanNextPeriod(this.ServiceReferenceId)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => {
          this.spinnerService.end();
          this.nextBillPeriodValue = result;
          this.nextBillPeriodValue.From = this.globService.getDateTimeWithString('YYYY-MM-DD', this.nextBillPeriodValue.From);
        },
        error: error => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      })
  }

  private getScheduledPlan(): void {
    this.spinnerService.loading();
    this.planNewService.getServicePlanChangeScheduled(this.ServiceReferenceId)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => {
          this.spinnerService.end();
          this.schedulePlans = result;
        },
        error: error => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      });
  }

  private getPlans(): void {
    this.showSpinner = true;
    this.planNewService.getAvailableServicePlans(this.ServiceReferenceId, this.eventParam)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => {
          this.showSpinner = false;
          this.planList = result.Plans;
          this.filterPlanList = this.planList.filter(s => (s.Plan as string).toLowerCase().includes(this.eventParam.SearchString.toLowerCase()));
          this.planForm.get('PlanOptionId').reset();
        },
        error: error => {
          this.showSpinner = false;
          this.tranService.errorMessage(error);
        }
      });
  }

  private getServiceDetail(): void {
    this.planNewService.getServiceDetail(this.ServiceReferenceId)
      .pipe(
        takeUntil(this.unsubscribeAll$),
        switchMap(res => this.planNewService.getPlanChangeConfiguration(res.ServiceTypeId))
      )
      .subscribe({
        next: result => {
          this.planConfiguration = result;
          this.showForm = true;
          this.spinnerService.end();
        },
        error: error => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      })
  }

  private getPermission(): void {
    this.spinnerService.loading();
    this.globService.getAuthorization('/Services/Plans', true)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: (result: Permission[]) => {
          this.formatPermissions(result);
          if (this.permissions.includes('New')) {
            this.getServiceDetail();
          } else {
            this.spinnerService.end();
            this.tranService.errorMessage('resource_forbidden');
            setTimeout(() => this.close(), 1000);
          }
        },
        error: error => {
          this.spinnerService.end();
          const errResult = this.globService.ConvertKeysToLowerCase(error);
          this.tranService.errorMessage('resource_forbidden');

          if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
            setTimeout(() => this.close(), 1000);
          }
        }
      });
  }
}
