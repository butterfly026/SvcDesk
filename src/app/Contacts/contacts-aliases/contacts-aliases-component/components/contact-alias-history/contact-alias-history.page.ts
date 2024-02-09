import { Component, OnChanges, OnDestroy, Output, EventEmitter, Input, SimpleChanges, Inject, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Paging } from 'src/app/model';
import { TranService } from 'src/services';
import { SpinnerService } from 'src/app/Shared/services';
import { DatatableAction, Permission, PermissionType, SearchOption } from 'src/app/Shared/models';
import { GlobalService } from 'src/services/global-service.service';
import { ContactsAliasesService } from '../../services/contacts-aliases.service';
import { ContactAliasHistory } from '../../models';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-contact-alias-history',
  templateUrl: './contact-alias-history.page.html',
  styleUrls: ['./contact-alias-history.page.scss'],
})
export class ContactAliasHistoryPage implements OnInit, OnDestroy {

  @Output('ContactsAliasesHistoryComponent') ContactsAliasesHistoryComponent: EventEmitter<string> = new EventEmitter<string>();

  totalCount: number = 0;
  dataSource: ContactAliasHistory[] = [];
  dataTableAction: DatatableAction = { row: [], toolBar: ['Refresh', 'ExportExcel'] };
  csvFileName: string;
  permissions: PermissionType[] = [];
  searchOptions: SearchOption[] = [];
  columns: string[] = ['Id', 'TypeCode', 'Type', 'Alias', 'FromDateTime', 'ToDateTime', 'CreatedBy', 'Created'];

  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    public globService: GlobalService,
    private tranService: TranService,
    private contactsAliasesService: ContactsAliasesService,
    private spinnerService: SpinnerService,
    private dialogRef: MatDialogRef<ContactAliasHistoryPage>,
    @Inject(MAT_DIALOG_DATA) private data: { ContactCode: string }
  ) {}

  ngOnInit(): void {
    if (this.data.ContactCode) {
      this.csvFileName = this.tranService.instant('AliasHistory') + ' ' + this.data.ContactCode;
      this.spinnerService.loading();
      this.getPermission();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  goBack(): void {
    this.dialogRef.close();
  }  

  fetchData(event: Paging): void {
    this.spinnerService.loading();
    this.getContactAliasHistory();
  }

  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/Contacts/Names/Aliases/History', "").replace('/', "") as PermissionType);
  }

  private getContactAliasHistory(): void {
    this.contactsAliasesService.ContactAliasesHistory(this.data.ContactCode)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: (result) => {
          this.spinnerService.end();
          if (result === null) {
            this.tranService.errorMessage('NoContactsAliasHistory');
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
    this.globService.getAuthorization('/Contacts/Names/Aliases/History', true)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: (result: Permission[]) => {
          this.formatPermissions(result);
          if (this.permissions.includes('')) {
            this.getContactAliasHistory();
          } else {
            this.spinnerService.end();
            this.tranService.errorMessage('resource_forbidden');
            setTimeout(() => this.goBack(), 1000);
          }
        },
        error: (error) => {
          this.spinnerService.end();
          const errResult = this.globService.ConvertKeysToLowerCase(error);
          this.tranService.errorMessage('resource_forbidden');

          if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
            setTimeout(() => this.goBack(), 1000);
          }
        }
      });
  }
}
