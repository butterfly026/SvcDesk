import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Paging } from 'src/app/model';
import { TranService } from 'src/services';
import { SpinnerService } from 'src/app/Shared/services';
import { GlobalService } from 'src/services/global-service.service';
import { DatatableAction, Permission, PermissionType } from 'src/app/Shared/models';
import { ServiceAddressService } from '../../services';
import { ServiceAddressUsageHistoryItem } from '../../models';

@Component({
  selector: 'app-service-address-history',
  templateUrl: './service-address-history.component.html',
  styleUrls: ['./service-address-history.component.scss'],
})
export class ServiceAddressHistoryComponent implements OnInit, OnDestroy {

  totalCount: number = 0;
  dataSource: ServiceAddressUsageHistoryItem[] = [];
  dataTableAction: DatatableAction = { row: [], toolBar: [ 'Refresh', 'ExportExcel'] };
  csvFileName: string;
  permissions: PermissionType[] = [];
  columns: string[] = [ 
    'Id',
    'AddressId',
    'AddressTypeCode',
    'AddressType',
    'AddressLine1',
    'AddressLine2',
    'Suburb',
    'City',
    'State',
    'PostCode',
    'CountryCode',
    'Country',
    'FromDateTime',
    'ToDateTime',
    'LastUpdated',
    'UpdatedBy'
  ];
  
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    public globService: GlobalService,
    private spinnerService: SpinnerService,
    private serviceAddressService: ServiceAddressService,
    private tranService: TranService,
    private dialogRef: MatDialogRef<ServiceAddressHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { serviceReference: number }
  ) {}

  ngOnInit(): void {
    if (this.data.serviceReference) {
      this.csvFileName = this.tranService.instant('AddressHistory') + ' ' + this.data.serviceReference;
      this.spinnerService.loading();
      this.getPermission();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  fetchData(event: Paging): void {
    this.spinnerService.loading();
    this.getContactNames();
  }

  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/Services/Addresses/History', "").replace('/', "") as PermissionType);
  }

  private getContactNames(): void {
    this.serviceAddressService.getServiceAddressUsageHistory(this.data.serviceReference)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: (result) => {
          this.spinnerService.end();
          if (result === null) {
            this.tranService.errorMessage('NoAddressHistory');
          } else {
            this.totalCount = result.length;
            this.dataSource = result;
          }
        },
        error: (error: any) => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      })
  }

  private getPermission(): void {
    this.globService.getAuthorization('/Services/Addresses/History', true)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: (result: Permission[]) => {
          this.formatPermissions(result);
          if (this.permissions.includes('')) {
            this.getContactNames();
          } else {
            this.spinnerService.end();
            this.tranService.errorMessage('resource_forbidden');
            setTimeout(() => this.dialogRef.close(), 1000);
          }
        },
        error: (error) => {
          this.spinnerService.end();
          const errResult = this.globService.ConvertKeysToLowerCase(error);
          this.tranService.errorMessage('resource_forbidden');

          if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
            setTimeout(() => this.dialogRef.close(), 1000);
          }
        }
      });
  }

}
