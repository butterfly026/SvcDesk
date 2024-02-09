import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { Paging } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { AlertService } from 'src/services/alert-service.service';
import { DiscountListService } from './services/discount-list-service';
import { DatatableAction, Permission, PermissionType, SearchOption } from 'src/app/Shared/models';
import { DiscountInstance } from './discount-list.component.type';
import { DiscountNewComponent } from '../discount-new/discount-new.component';
import { DiscountEditComponent } from '../discount-edit/discount-edit.component';
import { DiscountDetailsComponent } from '../discount-details/discount-details.component';

@Component({
  selector: 'app-discount-list',
  templateUrl: './discount-list.component.html',
  styleUrls: ['./discount-list.component.scss'],
})
export class DiscountListComponent implements OnChanges, OnDestroy {
  @Input() ServiceReferenceId: number;
  @Output('DiscountListComponent') DiscountListComponent: EventEmitter<string> = new EventEmitter<string>();

  totalCount: number = 0;
  dataSource: DiscountInstance[] = [];
  columns: string[] = ['Id', 'DiscountDefinitionId', 'Discount', 'From', 'To', 'PreviousTo', 'AutoApply', 'PlanInstanceId', 'Plan', 'AggregationId', 'ParentDiscountInstanceId', 'CreatedBy', 'Created', 'LastUpdated', 'UpdatedBy', 'ChildDiscounts'];
  dataTableAction: DatatableAction = { row: ['Details', 'Update', 'Delete'], toolBar: ['Create', 'Refresh', 'ExportExcel'] };
  eventParam = new Paging();
  permissions: PermissionType[] = ['Details', 'Update', 'Delete', 'New'];
  csvFileName: string;
  searchOptions: SearchOption[] = ['Text'];

  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private loading: LoadingService,
    private discountService: DiscountListService,
    private tranService: TranService,
    private alertService: AlertService,
    private globService: GlobalService,
    private dialog: MatDialog,
  ) {
    this.tranService.translaterService();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.ServiceReferenceId?.currentValue) {
      this.csvFileName = this.tranService.instant('ServiceDiscountList') + ' ' + this.ServiceReferenceId;

      this.getPermission();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  async fetchData(event: Paging): Promise<void> {
    this.eventParam = {
      CountRecords: 'Y',
      ...event
    }
    await this.loading.present();
    this.getDiscountList();
  }

  async deleteSelectedRow(data: DiscountInstance): Promise<void> {
    await this.loading.present();
    this.discountService.deleteDiscount(data.Id)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (_result) => {
          this.getDiscountList();
        },
        error: async (err) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(err);
        }
      });
  }

  async addNew(): Promise<void> { 
    const dialogRef = this.dialog.open(DiscountNewComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '600px',
      maxHeight: '565px',
      data: {
        ServiceReferenceId: this.ServiceReferenceId
      }
    });

    dialogRef.afterClosed().subscribe(async (res) => {
      if (res === 'ok') {
        await this.loading.present();
        this.getDiscountList()
      }
    })
  }

  async editOne(event: DiscountInstance): Promise<void> {
    const dialogRef = this.dialog.open(DiscountEditComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '600px',
      maxHeight: '765px',
      autoFocus: false,
      data: {
        serviceReferenceId: this.ServiceReferenceId,
        eventInstance: event
      }
    });

    dialogRef.afterClosed().subscribe(async (res) => {
      if (res === 'ok') {
        await this.loading.present();
        this.getDiscountList()
      }
    })
  }

  viewDetail(event: DiscountInstance): void {
    this.dialog.open(DiscountDetailsComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '600px',
      maxHeight: '765px',
      data: event
    });
  }

  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/Services/Discounts', "").replace('/', "") as PermissionType);
  }

  private async getDiscountList(): Promise<void> {
    this.discountService.getDiscountList(this.ServiceReferenceId, this.eventParam)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result) =>{
          await this.loading.dismiss();
          if (result === null) {
            this.tranService.errorMessage('no_discounts');
          } else {
            this.totalCount = result.Count;
            this.dataSource = result.Items;
          }
        },
        error: async (error: any) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      })
  }

  private async getPermission(): Promise<void> {
    await this.loading.present();
    this.globService.getAuthorization('/Services/Discounts', true)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (_result: Permission[]) => {
          this.formatPermissions(_result);
          if (this.permissions.includes('')) {
            this.getDiscountList();
          } else {
            await this.loading.dismiss();
            this.tranService.errorMessage('resource_forbidden');
            this.alertService.closeAllAlerts();
            setTimeout(() => {
              this.DiscountListComponent.emit('go-back');
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
              this.DiscountListComponent.emit('go-back');
            }, 1000);
          }
        }
      });
  }
}
