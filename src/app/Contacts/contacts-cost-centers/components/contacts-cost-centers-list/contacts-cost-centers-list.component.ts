import { Component, EventEmitter, Input, Output, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Subject, of } from 'rxjs';

import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { AlertService } from 'src/services/alert-service.service';
import { DatatableAction, Permission, PermissionType, SearchOption } from 'src/app/Shared/models';
import { Paging } from 'src/app/model';
import { ContactsCostCentersService } from '../../services';
import { CostCenter, CostCenterConfiguration } from '../../models';
import { ContactsCostCentersDetailsComponent, ContactsCostCentersEditComponent, ContactsCostCentersNewComponent } from '..';
import { SpinnerService } from 'src/app/Shared/services';


@Component({
  selector: 'app-contacts-cost-centers-list',
  templateUrl: './contacts-cost-centers-list.component.html',
  styleUrls: ['./contacts-cost-centers-list.component.scss'],
})
export class ContactsCostCentersListComponent implements OnChanges, OnDestroy {

  @Input() ContactCode: string = '';
  @Output('CostCenterComponent') CostCenterComponent: EventEmitter<string> = new EventEmitter<string>();

  totalCount: number = 0;
  dataSource: CostCenter[] = [];
  dataTableAction: DatatableAction = { row: ['Details', 'Update', 'Delete'], toolBar: ['Create', 'Refresh', 'ExportExcel'] };
  permissions: PermissionType[] = [];
  csvFileName: string;
  searchOptions: SearchOption[] = [];
  columns: string[] = [
    'Id',
    'Name',
    'StatusUpdated',
    'EFXId',
    'Email',
    'Status',
    'AllocationType',
    'AggregationPoint',
    'GeneralLedgerAccountCode',
    'AdditionalInformation1',
    'AdditionalInformation2',
    'AdditionalInformation3',
    'CustomerReference',
    'ParentId',
    'LastUpdated',
    'UpdatedBy',
    'Created',
    'CreatedBy',
  ];
  
  private costCenterConfiguration: CostCenterConfiguration;
  private eventParam = new Paging();
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private costCenterService: ContactsCostCentersService,
    private tranService: TranService,
    private alertService: AlertService,
    private globService: GlobalService,
    private dialog: MatDialog,
    private spinnerService: SpinnerService,
  ) {
    this.tranService.translaterService();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ContactCode?.currentValue) {
      this.csvFileName = this.tranService.instant('ContactsCostCenters') + ' ' + this.ContactCode;
      this.getPermission();
    }
  }

  ngOnDestroy(): void {
    this.alertService.closeAllAlerts();
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  viewDetail(event: CostCenter): void {
    this.dialog.open(ContactsCostCentersDetailsComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '600px',
      maxHeight: '600px',
      data: {
        configuration: this.costCenterConfiguration,
        costCenterData: event
      }
    });
  }

  addNew(): void {
    const dialogRef = this.dialog.open(ContactsCostCentersNewComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '600px',
      maxHeight: '600px',
      data: {
        contactCode: this.ContactCode,
        configuration: this.costCenterConfiguration
      }
    });

    dialogRef.afterClosed().subscribe(async (res) => {
      if (res === 'ok') {
        this.spinnerService.loading();
        this.getContactsCostCenters();
      }
    });
  }

  editOne(event: CostCenter): void {
    const dialogRef = this.dialog.open(ContactsCostCentersEditComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '600px',
      maxHeight: '600px',
      data: {
        configuration: this.costCenterConfiguration,
        costCenterData: event
      }
    });

    dialogRef.afterClosed().subscribe(async (res) => {
      if (res === 'ok') {
        this.spinnerService.loading();
        this.getContactsCostCenters();
      }
    });
  }

  deleteSelectedRow(data: CostCenter): void {
    this.spinnerService.loading();
    this.costCenterService.deleteCostCenter(data.Id)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (_result) => {
          this.getContactsCostCenters();
        },
        error: async (err) => {
          this.spinnerService.end();
          this.tranService.errorMessage(err);
        }
      });
  }

  fetchData(event: Paging): void {
    this.eventParam = {
      CountRecords: 'Y',
      ...event
    }
    this.spinnerService.loading();
    this.getContactsCostCenters();
  }

  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/Contacts/CostCenters', "").replace('/', "") as PermissionType);
  }

  private getContactsCostCenters(): void {
    this.costCenterService.getAllCostCenters(this.eventParam, this.ContactCode)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result =>{
          this.spinnerService.end();
          if (result === null) {
            this.tranService.errorMessage('no_cost_centres');
          } else {
            this.totalCount = result[0].Count;
            this.dataSource = result[0].Items;
          }
        },
        error: error => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      })
  }

  private getPermission(): void {
    this.spinnerService.loading();
    this.globService.getAuthorization('/Contacts/CostCenters', true)
      .pipe(
        takeUntil(this.unsubscribeAll$),
        switchMap((result: Permission[]) => {
          this.formatPermissions(result);
          return this.permissions.includes('') 
            ? this.costCenterService.getCostCenterConfiguration() 
            : of(null);
        })
      )
      .subscribe({
        next: result => {
          if (result) {
            this.costCenterConfiguration = result;
            this.getContactsCostCenters();
          } else {
            this.spinnerService.end();
            this.tranService.errorMessage('resource_forbidden');
            setTimeout(() => this.CostCenterComponent.emit('close'), 1000);
          }
        },
        error: error => {
          this.spinnerService.end();
          const errResult = this.globService.ConvertKeysToLowerCase(error);
          this.tranService.errorMessage('resource_forbidden');

          if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
            setTimeout(() => this.CostCenterComponent.emit('close'), 1000);
          }
        }
      });
  }

}