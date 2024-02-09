import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ComponentOutValue, Paging } from 'src/app/model';
import { TranService, LoadingService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { AlertService } from 'src/services/alert-service.service';
import { DatatableAction, Permission, PermissionType, SearchOption } from 'src/app/Shared/models';
import { ChargeNewComponent } from '../charge-new/charge-new.component';
import { ChargeListService } from './services/charge-list.service';
import { ChargeInstance } from '../../financial-charges/charge-list/charge-list.component.type';

@Component({
  selector: 'app-charge-list',
  templateUrl: './charge-list.component.html',
  styleUrls: ['./charge-list.component.scss'],
})
export class ChargeListComponent implements OnChanges, OnDestroy {
  @Input() FinancialId: string = '';
  @Input() ContactCode: string = '';
  @Input() ComponentType: string = '';
  @Output('ChargeListComponent') ChargeListComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  totalCount: number = 0;
  dataSource: ChargeInstance[] = [];
  dataTableAction: DatatableAction = { row: ['Details', 'Update', 'Delete'], toolBar: ['Create', 'Refresh', 'ExportExcel'] };
  permissions: PermissionType[] = [];
  csvFileName: string;
  searchOptions: SearchOption[] = ['Text'];
  columns: string[] = [
    'Id',
    'ProfileId',
    'Code',
    'Description',
    'From',
    'To',
    'PriceTaxEx',
    'PriceTaxInc',
    'UndiscountedPriceTaxEx',
    'UndiscountedPriceTaxInc',
    'Frequency',
    'FrequencyId',
    'DefinitionFrequencyId',
    'Prorated',
    'ChargeInAdvance',
    'AdvancePeriods',
    'Cost',
  ];
  
  private eventParam = new Paging();
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private tranService: TranService,
    private globService: GlobalService,
    private loading: LoadingService,
    private chargeService: ChargeListService,
    private dialog: MatDialog,
    private alertService: AlertService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.FinancialId?.currentValue) {
      this.csvFileName = this.tranService.instant('FinantialCharges') + ' ' + this.FinancialId;
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
    this.getEventList();
  }

  async deleteSelectedRow(data: any): Promise<void> {
    // await this.loading.present();
    // this.ChargeListComponentService.deleteEvent(data.Id)
    //   .pipe(takeUntil(this.unsubscribeAll$))
    //   .subscribe({
    //     next: async (_result) => {
    //       this.getEventList();
    //     },
    //     error: async (err) => {
    //       await this.loading.dismiss();
    //       this.tranService.errorMessage(err);
    //     }
    //   });
  }

  async addNew(): Promise<void> { 
    const dialogRef = this.dialog.open(ChargeNewComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '600px',
      maxHeight: '600px',
      data: {
        ContactCode: this.ContactCode
      }
    });

    dialogRef.afterClosed().subscribe(async (res) => {
      if (res === 'ok') {
        await this.loading.present();
        this.getEventList()
      }
    })
  }

  async editOne(event: ChargeInstance): Promise<void> {
    const dialogRef = this.dialog.open(ChargeNewComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '600px',
      maxHeight: '600px',
      autoFocus: false,
      data: {
        ContactCode: this.ContactCode,
        ChargeId: event.Id,
        ChargeType: 'update',
        ChargeData: event
      }
    });

    dialogRef.afterClosed().subscribe(async (res) => {
      if (res === 'ok') {
        await this.loading.present();
        this.getEventList()
      }
    })
  }

  viewDetail(event: any): void {}

  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/FinancialTransactions/Invoices/Charges', "").replace('/', "") as PermissionType);
  }

  private async getEventList(): Promise<void> {
    this.chargeService.getChargeList(this.FinancialId, this.eventParam)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result) =>{
          await this.loading.dismiss();
          if (result === null) {
            this.tranService.errorMessage('no_charges');
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
    this.globService.getAuthorization('/FinancialTransactions/Invoices/Charges', true)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (_result: Permission[]) => {
          this.formatPermissions(_result);
          if (this.permissions.includes('')) {
            this.getEventList();
          } else {
            await this.loading.dismiss();
            this.tranService.errorMessage('resource_forbidden');
            this.alertService.closeAllAlerts();
            setTimeout(() => {
              // this.ChargeListComponent.emit('');
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
              // this.ChargeListComponent.emit('go-back');
            }, 1000);
          }
        }
      });
  }
}
