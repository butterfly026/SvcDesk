import { Component, Output, EventEmitter, OnDestroy, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TranService } from 'src/services';
import { ContactNameHistory, Paging } from 'src/app/model';
import { DatatableAction, Permission, PermissionType } from 'src/app/Shared/models';
import { SpinnerService } from 'src/app/Shared/services';
import { GlobalService } from 'src/services/global-service.service';
import { ContactsAliasesService } from '../../services/contacts-aliases.service';

@Component({
  selector: 'app-contact-name-history',
  templateUrl: './contact-name-history.page.html',
  styleUrls: ['./contact-name-history.page.scss'],
})
export class ContactNameHistoryPage implements OnInit, OnDestroy {

  @Output('ContactsNamesHistoryComponent') ContactsNamesHistoryComponent: EventEmitter<string> = new EventEmitter<string>();

  totalCount: number = 0;
  dataSource: ContactNameHistory[] = [];
  dataTableAction: DatatableAction = { row: [], toolBar: [ 'Refresh', 'ExportExcel'] };
  csvFileName: string;
  permissions: PermissionType[] = [];
  columns: string[] = ['Id', 'OldDetails', 'CreatedBy', 'Created'];
  
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    public globService: GlobalService,
    private spinnerService: SpinnerService,
    private contactsAliasesService: ContactsAliasesService,
    private tranService: TranService,
    private dialogRef: MatDialogRef<ContactNameHistoryPage>,
    @Inject(MAT_DIALOG_DATA) private data: { ContactCode: string }
  ) {}

  ngOnInit(): void {
    if (this.data.ContactCode) {
      this.csvFileName = this.tranService.instant('NamesHistory') + ' ' + this.data.ContactCode;
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

  goBack(): void {
    this.dialogRef.close();
  }

  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/Contacts/Names/History', "").replace('/', "") as PermissionType);
  }

  private getContactNames(): void {
    this.contactsAliasesService.ContactNameHistory(this.data.ContactCode)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: (result) => {
          this.spinnerService.end();
          if (result === null) {
            this.tranService.errorMessage('NoNamesHistory');
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
    this.globService.getAuthorization('/Contacts/Names/History', true)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: (result: Permission[]) => {
          this.formatPermissions(result);
          if (this.permissions.includes('')) {
            this.getContactNames();
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
