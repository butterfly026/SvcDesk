import { Component, EventEmitter, Inject, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { AlertService } from 'src/services/alert-service.service';
import { SpinnerService } from 'src/app/Shared/services';
import { ServicePlanService } from '../../services';


@Component({
  selector: 'app-service-plan-detail',
  templateUrl: './service-plan-detail.component.html',
  styleUrls: ['./service-plan-detail.component.scss'],
})
export class ServicePlanDetailComponent implements OnInit, OnDestroy {

  
  @Output() servicePlanDetailComponent: EventEmitter<string> = new EventEmitter<string>();
  
  PlanId: number;
  serviceReferenceId: number;
  selectedIndex = 0;
  planDefinitions: any;

  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    public globService: GlobalService,
    private tranService: TranService,
    private alertService: AlertService,
    private spinnerService: SpinnerService,
    private servicePlanService: ServicePlanService,
    private dialogRef: MatDialogRef<ServicePlanDetailComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { serviceReferenceId: number, planId: number }
  ) {

  }

  ngOnInit(): void {
    if (this.data?.serviceReferenceId && this.data?.planId) {
      this.PlanId = this.data.planId;
      this.serviceReferenceId = this.data.serviceReferenceId;
      this.getPlanDetails();
    }
  }

  ngOnDestroy(): void {
    this.alertService.closeAllAlerts();
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  selectTabs(tab): void {
    this.selectedIndex = tab.index;
  }

  close(): void {
    this.servicePlanDetailComponent.emit('planHistory');
    this.dialogRef.close();
  }

  private getPlanDetails(): void {
    this.spinnerService.loading();
    this.servicePlanService.getPlan(this.serviceReferenceId, this.PlanId)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => {
          this.spinnerService.end();
          this.planDefinitions = result
        },
        error: error=> {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      });
  }
}
