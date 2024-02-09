import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { TranService } from 'src/services';
import { Paging } from 'src/app/model';
import { SpinnerService } from 'src/app/Shared/services';
import { DatatableAction, Permission, PermissionType } from 'src/app/Shared/models';
import { GlobalService } from 'src/services/global-service.service';
import { ContactsAddressService } from '../../services';
import { ContactAddressUsageHistoryItem } from '../../models';

@Component({
  selector: 'app-contacts-address-history',
  templateUrl: './contacts-address-history.page.html',
  styleUrls: ['./contacts-address-history.page.scss'],
})
export class ContactsAddressHistoryPage implements OnInit, OnDestroy {

  totalCount: number = 0;
  dataSource: ContactAddressUsageHistoryItem[] = [];
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
    private contactsAddressService: ContactsAddressService,
    private tranService: TranService,
    private dialogRef: MatDialogRef<ContactsAddressHistoryPage>,
    @Inject(MAT_DIALOG_DATA) private data: { contactCode: string }
  ) {}

  ngOnInit(): void {
    if (this.data.contactCode) {
      this.csvFileName = this.tranService.instant('AddressHistory') + ' ' + this.data.contactCode;
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
    this.permissions = value.map(s => s.Resource.replace('/Contacts/Addresses/History', "").replace('/', "") as PermissionType);
  }

  private getContactNames(): void {
    this.contactsAddressService.getContactAddressUsageHistory(this.data.contactCode)
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
    this.globService.getAuthorization('/Contacts/Addresses/History', true)
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
