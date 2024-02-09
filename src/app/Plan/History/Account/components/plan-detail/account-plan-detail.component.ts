import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, EventEmitter, Inject, OnInit, Output, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { PlanDetailService } from '../../services/account-plan-detail.service';
import { SpinnerService } from 'src/app/Shared/services';
import { Plan, PlanInstance } from 'src/app/Shared/models';


@Component({
  selector: 'app-account-plan-detail',
  templateUrl: './account-plan-detail.component.html',
  styleUrls: ['./account-plan-detail.component.scss'],
})
export class AccountPlanDetailComponent implements OnInit, OnDestroy {

  @Output('AccountPlanDetailComponent') AccountPlanDetailComponent: EventEmitter<string> = new EventEmitter<string>();

  selectedIndex = 0;
  planDefinitions: Plan;
  PlanId: number;

  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private spinnerService: SpinnerService,
    public globService: GlobalService,
    private tranService: TranService,    
    private planDetail: PlanDetailService,
    public dialogRef: MatDialogRef<AccountPlanDetailComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { planId: number }
  ) {

  }

  ngOnInit() {
    this.PlanId = this.data.planId;
    this.getPlanDetails();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
    this.spinnerService.end();
  }

  selectTabs(tab) {
    this.selectedIndex = tab.index;
  }

  close() {   
    this.dialogRef.close();
  }

  private getPlanDetails() {
    this.spinnerService.loading();
    this.planDetail.getPlan(this.data.planId)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => {
          this.spinnerService.end();
          this.planDefinitions = result;
        },
        error: error => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      });
  }
}
