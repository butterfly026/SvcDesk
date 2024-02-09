import { Component, EventEmitter, Inject, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { AlertService } from 'src/services/alert-service.service';
import { SpinnerService } from 'src/app/Shared/services';
import { ServicePlanService } from '../../../services/service-plan.service';



@Component({
  selector: 'app-service-new-plan-detail',
  templateUrl: './service-new-plan-detail.component.html',
  styleUrls: ['./service-new-plan-detail.component.scss']
})
export class ServiceNewPlanDetailComponent implements OnInit, OnDestroy {

  PlanId: number;  
  selectedIndex = 0;
  planDefinitions: any;

  private unsubscribeAll$: Subject<any> = new Subject<any>();
  constructor(
    public globService: GlobalService,
    private tranService: TranService,
    private spinnerService: SpinnerService,
    private servicePlanService: ServicePlanService,
    private dialogRef: MatDialogRef<ServiceNewPlanDetailComponent>,
    @Inject(MAT_DIALOG_DATA) private data: {planId: number }
  ) {

  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }
  
  ngOnInit(): void {
    if (this.data?.planId) {
      this.PlanId = this.data.planId;
      this.getPlanDetails();
    }
  }


  selectTabs(tab): void {
    this.selectedIndex = tab.index;
  }

  close(): void {
    this.dialogRef.close();
  }

  private async getPlanDetails(): Promise<void> {
    this.spinnerService.loading();
    this.servicePlanService.getPlan(this.PlanId)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: (result) => {
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
