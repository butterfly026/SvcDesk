import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DatatableAction, Permission, PermissionType } from 'src/app/Shared/models';
import { ComponentOutValue, Paging } from 'src/app/model';
import { Subject } from 'rxjs';
import { LoadingService, TranService } from 'src/services';
import { AlertService } from 'src/services/alert-service.service';
import { GlobalService } from 'src/services/global-service.service';
import { takeUntil } from 'rxjs/operators';

import { PenaltyItemDetail } from '../../models/penalties.types';
import { PenaltiesService } from '../../services/penalties.service';

@Component({
  selector: 'app-penalties-lists',
  templateUrl: './penalties-lists.component.html',
  styleUrls: ['./penalties-lists.component.scss'],
})
export class PenaltiesListsComponent implements OnInit {
  @Output('PenaltiesListsComponent') PenaltiesListsComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  dataSource: PenaltyItemDetail[] = [];
  dataTableAction: DatatableAction = { row: [ ], toolBar: ['Refresh'] };  
  permissions: PermissionType[] = [];
  columns: string[] = [
    'Id',
    'Name',
    'Length',
    'CreatedBy',
    'Created',
    'UpdatedBy',
    'LastUpdated',
  ];
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private loading: LoadingService,
    private penaltiesService: PenaltiesService,
    private tranService: TranService,
    private alertService: AlertService,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
  }

  ngOnInit(): void {
    this.getPermission();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  async fetchData(event: Paging): Promise<void> {
    this.getPenaltiesList();
  }

  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/Contracts/Penalties', "").replace('/', "") as PermissionType);
  }

  private async getPermission(): Promise<void> {
    await this.loading.present();
    this.globService.getAuthorization('/Contracts/Penalties', true)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (_result: Permission[]) => {
          this.formatPermissions(_result);
          await this.loading.dismiss();
          if (this.permissions.includes('')) {
            this.getPenaltiesList();
          } else {
            await this.loading.dismiss();
            this.tranService.errorMessage('resource_forbidden');
            this.alertService.closeAllAlerts();
            setTimeout(() => {
              this.PenaltiesListsComponent.emit({ type: 'close' });
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
              this.PenaltiesListsComponent.emit({ type: 'close' });
            }, 1000);
          }
        }
      });
  }
  
  private async getPenaltiesList(): Promise<void> {
    this.loading.present();
    this.penaltiesService.getPenaltiesList()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result: PenaltyItemDetail[]) => {
          await this.loading.dismiss();
          if (result === null) {
            this.tranService.errorMessage('no_penalties');
          } else {
            this.dataSource = result;
          }
        },
        error: async (error: any) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      });
  }

  goBack(): void {
    this.PenaltiesListsComponent.emit({ type: 'close' });
  }
}
