import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Paging } from 'src/app/model';
import { TranService, LoadingService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { AlertService } from 'src/services/alert-service.service';
import { DatatableAction, Permission, PermissionType, PlanInstance } from 'src/app/Shared/models';
import { ServicePlanService } from '../../services';
import { PlanNewComponent, ServicePlanDetailComponent } from '..';


@Component({
  selector: 'app-service-plan-history',
  templateUrl: './service-plan-history.component.html',
  styleUrls: ['./service-plan-history.component.scss'],
})
export class PlanHistoryComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Input() ServiceReference: string = '';

  @Output('PlanHistoryComponent') public PlanHistoryComponent: EventEmitter<string> = new EventEmitter<string>();

  totalCount: number;
  dataSource: PlanInstance[] = [];
  dataTableAction: DatatableAction = { row: ['Details'], toolBar: ['Create', 'Refresh', 'ExportExcel'] };
  permissions: PermissionType[] = ['Details', 'New', 'Download'];
  csvFileName = '';
  columns = ['PlanType', 'Plan', 'Option', 'Status', 'From', 'To', 'LastUpdated', 'UpdatedBy'];

  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private tranService: TranService,
    private loading: LoadingService,
    private servicePlanService: ServicePlanService,
    private dialog: MatDialog,
    private alertService: AlertService,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
  }

  ngOnInit() {
    this.getPlanHistoryList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ServiceReference?.currentValue) {
      this.csvFileName = 'ServicesPlanHistory ' + this.ServiceReference;

      this.getPermission();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  fetchData(event: Paging): void {
    this.getPlanHistoryList();
  }

  
  viewDetail(event: PlanInstance): void {
    this.dialog.open(ServicePlanDetailComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '650px',
      maxHeight: '750px',
      data: {
        serviceReferenceId: this.ServiceReference,
        planId: event.Id
      }
    });
  }

  async addNew(): Promise<void> { 
    const dialogRef = this.dialog.open(PlanNewComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '600px',
      maxHeight: '780px',
      data: {
        serviceReferenceId: this.ServiceReference
      }
    });

    dialogRef.afterClosed().subscribe(async (res) => {
      if (res === 'ok') {
        await this.loading.present();
        this.getPlanHistoryList()
      }
    })
  }

  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/Accounts/Plans', "").replace('/', "") as PermissionType);
  }

  async getPlanHistoryList() {
    await this.loading.present();      
     this.servicePlanService.getPlanHistory(this.ServiceReference).subscribe(async (result: any) => {
      await this.loading.dismiss();
      if (result === null) {
      } else {       
        this.dataSource = result;
      }

    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  private async getPermission(): Promise<void> {
    await this.loading.present();
    this.globService.getAuthorization('/Accounts/Plans', true)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (_result: Permission[]) => {
          await this.loading.dismiss();
          this.formatPermissions(_result);
          if (this.permissions.includes('')) {
            this.getPlanHistoryList();
          } else {
            this.tranService.errorMessage('resource_forbidden');
            this.alertService.closeAllAlerts();
            setTimeout(() => {
              this.PlanHistoryComponent.emit('go-back');
            }, 1000);
          }
        },
        error: async (err) => {
          await this.loading.dismiss();
          const errResult = this.globService.ConvertKeysToLowerCase(err);
          this.tranService.errorMessage('resource_forbidden');

          if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
            this.alertService.closeAllAlerts();
            setTimeout(() => {
              this.PlanHistoryComponent.emit('go-back');
            }, 1000);
          }
        }
      });
  }
}
