import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { async } from '@angular/core/testing';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { ComponentOutValue, Paging } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { DelegationListService } from './services/deligation-list.service';
import { DatatableAction, MessageForRowDeletion, Permission, PermissionType, SearchOption } from 'src/app/Shared/models';
import { BillDelegation } from '../../bilil-delegation.types';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from 'src/services/alert-service.service';
import { RelatedContact } from 'src/app/Contacts/related-contacts/related-contacts.types';
import { DialogComponent } from 'src/app/Shared/components';
import { DelegationFormComponent } from '../delegation-form/delegation-form.component';

@Component({
  selector: 'app-delegation-list',
  templateUrl: './delegation-list.component.html',
  styleUrls: ['./delegation-list.component.scss'],
})
export class DelegationListComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Output('DelegationListComponent') DelegationListComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  @ViewChild('DelegationListGrid') DelegationListGrid: jqxGridComponent;
  @Input() Refresh: Boolean = true;

  permissions: PermissionType[] = [];
  dataSource: BillDelegation[] = [];
  totalCount: number;
  expandServiceList = [];
  columns: string[] = [];
  dataTableAction: DatatableAction = { row: ['Update', 'Delete'], toolBar: ['Create', 'Refresh', 'ExportExcel'] };
  _showSearchOption: boolean = false;
  searchOptions: SearchOption[] = [];

  eventParam = new Paging();


  private unsubscribeAll$: Subject<any> = new Subject<any>();
  private Refresh_: Boolean = true;
  csvFileName: string = '';

  areSure: string = '';
  warning: string = '';

  deletionMsg: MessageForRowDeletion = {
    header: '',
    message: ''
  }


  gridRecords: any = {};

  reqParam = {
    SearchString: '',
    SkipRecords: 0,
    TakeRecords: 10,
    CountRecords: 'Y',
  };

  totalLength: any;
  pageRowNumber: number = 1;
  rowStep: string = '10';
  SkipRecords: number = 0;



  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private alertService: AlertService,
    public globService: GlobalService,
    private delegationService: DelegationListService,
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('are_you_sure').subscribe(value => {
      this.deletionMsg.header = value;
    });
    this.tranService.convertText('delete_confirm_related_contact').subscribe(value => {
      this.deletionMsg.message = value;
    });
    this.configInitialValues();
  }
  private configInitialValues(): void {
    this.columns = [
      'Id',
      'DelegatorAccount',
      'DelegatorName',
      'DelegateeAccount',
      'DelegateeName',
      'From',
      'To',
      'Reason',
      'Note',
      'CreatedBy',
      'Created',
      'UpdatedBy',
      'LastUpdated',
    ];
  }
  ngOnInit() {
    this.csvFileName = 'Billing Delegations - ' + this.ContactCode;
    this.getPermission();
  }

  ngOnChanges(): void {
    if (this.Refresh !== undefined && this.Refresh !== this.Refresh_) {
      this.getDelegationList()
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  fetchData(event: Paging): void {
    this.eventParam = {
      CountRecords: 'Y',
      ...event
    }
    this.getDelegationList();
  }

  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/Accounts/Bills/Delegations', "").replace('/', "") as PermissionType);
  }
  private async getPermission(): Promise<void> {
    await this.loading.present();
    this.globService.getAuthorization('/Accounts/Bills/Delegations', true)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (_result) => {
          await this.loading.dismiss();
          this.formatPermissions(_result);
          if (this.permissions.includes('')) {
            this.getDelegationList();
          } else {
            await this.loading.dismiss();
            this.tranService.errorMessage('resource_forbidden');
            this.alertService.closeAllAlerts();
            setTimeout(() => {
              this.goBack();
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
              this.goBack();
            }, 1000);
          }
        }
      });
  }
  private async getDelegationList() {
    await this.loading.present();
    this.delegationService.getBillDelegations(this.ContactCode)
      .subscribe({
        next: async (_result: BillDelegation[]) => {
          if (_result) {
            this.dataSource = _result.map((map: BillDelegation) => {
              map.DelegateeName = map.DelegateeAccount;
              map.DelegatorName = map.DelegatorAccount;
              map.DelegatorAccount = map.DelegatorAccountId;
              map.DelegateeAccount = map.DelegateeAccountId;
              return map as BillDelegation;
            });
          }
          await this.loading.dismiss();
        },
        error: async (err) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(err);
        }
      });
  }


  async deleteDelegation(selectedData: BillDelegation) {
    await this.loading.present();
    this.delegationService.deleteBillDelegations(selectedData.Id).subscribe(async (result: any) => {
      await this.loading.dismiss();
      await this.getDelegationList();
    }, async (error) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  onNewDelegation() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '650px',
      maxHeight: '550px',
      panelClass: 'dialog',
      data: {
        component: DelegationFormComponent,
        ContactCode: this.ContactCode,
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === 'ok') {
        this.getDelegationList();
      }
    });
  }

  goToDelegationDetail(selectedData: BillDelegation) {
    if (selectedData) {

      const dialogRef = this.dialog.open(DialogComponent, {
        width: '100%',
        height: '100%',
        maxWidth: '650px',
        maxHeight: '550px',
        panelClass: 'dialog',
        data: {
          component: DelegationFormComponent,
          ContactCode: this.ContactCode,
          DelegationId: selectedData.Id,
          EditMode: 'Update',
        }
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res === 'ok') {
          this.getDelegationList();
        }
      });
    }
  }

  goBack() {
    this.DelegationListComponent.emit({ type: 'go-back' });
  }

}
