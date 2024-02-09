import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthorisedAccountItemDetail, AuthorisedAccountsResponse } from '../../models/authorised-accounts.types';
import { DatatableAction, Permission, PermissionType, SearchOption } from 'src/app/Shared/models';
import { Subject } from 'rxjs';
import { LoadingService, TranService } from 'src/services';
import { AlertService } from 'src/services/alert-service.service';
import { GlobalService } from 'src/services/global-service.service';
import { AuthorisedAccountsService } from '../../services/authorised-accounts.services';
import { takeUntil } from 'rxjs/operators';
import { Paging } from 'src/app/model';
import { DialogComponent } from 'src/app/Shared/components';
import { AuthorisedAccountsFormComponent } from '../authorised-accounts-form/authorised-accounts-form.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-authorised-accounts-lists',
  templateUrl: './authorised-accounts-lists.component.html',
  styleUrls: ['./authorised-accounts-lists.component.scss'],
})
export class AuthorisedAccountsListsComponent implements OnInit {
  @Input() ContactCode: string;
  @Output() AuthorisedAccountsListsComponent: EventEmitter<string> = new EventEmitter<string>();

  totalCount: number = 0;
  dataSource: AuthorisedAccountItemDetail[] = [];
  tblPageSizeOptions: number[] = [10, 20, 50];
  dataTableAction: DatatableAction = { row: ['Details', 'Update', 'Delete'], toolBar: ['Create', 'Refresh'] };  
  eventParam = new Paging();
  permissions: PermissionType[] = [];
  searchOptions: SearchOption[] = ['Text'];
  columns: string[] = [
    'Id',
    'AccountId',
    'Name',
    'From',
    'To',
    'CreatedBy',
    'Created',
    'UpdatedBy',
    'LastUpdated',
  ];
  private unsubscribeAll$: Subject<any> = new Subject<any>();
  
  constructor(
    private loading: LoadingService,
    private authorisedAccountsService: AuthorisedAccountsService,
    private tranService: TranService,
    private alertService: AlertService,
    public globService: GlobalService,
    public dialog: MatDialog,
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
    this.eventParam = event;
    this.getAuthorisedAccountsList();
  }

  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/Contacts/AuthorisedAccounts', "").replace('/', "") as PermissionType);
  }

  private async getPermission(): Promise<void> {
    await this.loading.present();
    this.globService.getAuthorization('/Contacts/AuthorisedAccounts', true)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (_result: Permission[]) => {
          this.formatPermissions(_result);
          await this.loading.dismiss();
          if (this.permissions.includes('')) {
            this.getAuthorisedAccountsList();
          } else {
            await this.loading.dismiss();
            this.tranService.errorMessage('resource_forbidden');
            this.alertService.closeAllAlerts();
            setTimeout(() => {
              this.AuthorisedAccountsListsComponent.emit('go-back');
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
              this.AuthorisedAccountsListsComponent.emit('go-back');
            }, 1000);
          }
        }
      });
  }

  private async getAuthorisedAccountsList(): Promise<void> {
    await this.loading.present();
    this.authorisedAccountsService.getAuthorisedAccountsList(this.eventParam, this.ContactCode)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result: AuthorisedAccountsResponse) => {
          await this.loading.dismiss();
          if (result === null) {
            this.tranService.errorMessage('no_authorised_accounts');
          } else {
            this.totalCount = result.Count;
            this.dataSource = result.Items;
          }
        },
        error: async (error: any) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      });
  }

  goBack(): void {
    this.AuthorisedAccountsListsComponent.emit('go-back');
  }

  async addNew(): Promise<void> {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '650px',
      maxHeight: '400px',
      panelClass: 'dialog',
      data: {
        component: AuthorisedAccountsFormComponent,
        EditMode: 'New',
        ContactCode: this.ContactCode,
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === 'ok') {
        this.getAuthorisedAccountsList();
      }
    });
  }

  async editOne(event: AuthorisedAccountItemDetail): Promise<void> {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '750px',
      maxHeight: '400px',
      panelClass: 'dialog',
      data: {
        component: AuthorisedAccountsFormComponent,
        EditMode: 'Update',
        AuthorisedAccountId: event.Id,
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === 'ok') {
        this.getAuthorisedAccountsList();
      }
    });
  }

  async viewDetail(event: AuthorisedAccountItemDetail): Promise<void> {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '750px',
      maxHeight: '400px',
      panelClass: 'dialog',
      data: {
        component: AuthorisedAccountsFormComponent,
        EditMode: 'View',
        AuthorisedAccountId: event.Id,
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === 'ok') {
        this.getAuthorisedAccountsList();
      }
    });
  }

  async deleteItem(event: AuthorisedAccountItemDetail): Promise<void> {
    await this.loading.present();
    this.authorisedAccountsService.deleteAuthorisedAccount(this.ContactCode, event.Id)
      .subscribe({
        next: async (result) =>{
          await this.loading.dismiss();
          this.getAuthorisedAccountsList();
        },
        error: async (error: any) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      });
  }
}
