import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { ComponentOutValue, Paging } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { DisputesListService } from './services/dispute-list.service';
import { BillDisputeItem } from '../bill-disputes.types';
import { DatatableAction, MessageForRowDeletion, Permission, PermissionType, SearchOption } from 'src/app/Shared/models';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert-service.service';
import { DialogComponent } from 'src/app/Shared/components';
import { DisputeFormComponent } from '../dispute-form/dispute-form.component';

@Component({
  selector: 'app-dispute-list',
  templateUrl: './dispute-list.component.html',
  styleUrls: ['./dispute-list.component.scss'],
})
export class DisputeListComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Input() Refresh: Boolean = true;
  @Output('DisputeListComponent') DisputeListComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  dataSource: BillDisputeItem[];
  totalCount: number;
  expandServiceList;
  columns: string[];
  permissions: PermissionType[];
  dataTableAction: DatatableAction = { row: ['Update', 'Delete'], toolBar: ['Create', 'Refresh', 'ExportExcel'] };
  _showSearchOption: boolean = false;
  searchOptions: SearchOption[] = [];
  columnsUsedForCurrency: string[] = ['DisputedAmount', 'SettlementAmount'];

  eventParam = new Paging();
  deletionMsg: MessageForRowDeletion = {
    header: '',
    message: ''
  }

  csvFileName: string = '';


  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private dialog: MatDialog,
    private alertService: AlertService,
    public globService: GlobalService,
    private disputeService: DisputesListService,
  ) {
    this.tranService.translaterService();
    this.configInitialValues();
    this.tranService.convertText('are_you_sure').subscribe(value => {
      this.deletionMsg.header = value;
    });
    this.tranService.convertText('delete_confirm_dispute').subscribe(value => {
      this.deletionMsg.message = value;
    });
  }

  private configInitialValues(): void {
    this.columns = [
      'Id',
      'Date',
      'Status',
      'StatusLastUpdated',
      'Details',
      'DisputedAmount',
      'BillId',
      'BillNumber',
      'BillDate',
      'ApprovedBy',
      'ApprovalNotes',
      'RaisedBy',
      'ContactDetails',
      'SettlementAmount',
      'SettlementTax',
      'CreatedBy',      
      'Created',
      'LastUpdated',
      'UpdatedBy'
    ];
  }

  ngOnInit() {
    this.csvFileName = 'Bill Disputes - ' + this.ContactCode;
    this.getPermission();
  }
  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/Accounts/Bills/Disputes', "").replace('/', "") as PermissionType);
  }
  private async getPermission(): Promise<void> {
    await this.loading.present();
    this.globService.getAuthorization('/Accounts/Bills/Disputes', true)
      .subscribe({
        next: async (_result) => {
          await this.loading.dismiss();
          this.formatPermissions(_result);
          if (!this.permissions.includes('')) {
            await this.loading.dismiss();
            this.tranService.errorMessage('resource_forbidden');
            this.alertService.closeAllAlerts();
            setTimeout(() => {
              this.goBack();
            }, 1000);
          }else{
            await this.getDisputeList();
          }
        },
        error: async (err) => {
          await this.loading.dismiss();
          const errResult = this.globService.ConvertKeysToLowerCase(err);
          this.tranService.errorMessage('resource_forbidden');

          if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
            setTimeout(() => {
              this.goBack();
            }, 1000);
          }
        }
      });
  }

  async fetchData(event: Paging): Promise<void> {
    this.eventParam = {
      CountRecords: 'Y',
      ...event
    }
    this.getDisputeList();
  }

  async getDisputeList() {
    await this.loading.present();
    this.disputeService.getBillDisputes(this.eventParam, this.ContactCode).subscribe(async (result: any) => {

      await this.loading.dismiss();
      if (result === null) {
      } else {
        this.dataSource = result.BillDisputes;
        this.totalCount = result.Count;
      }
    }, async (error: any) => {
      await this.loading.dismiss();

      this.tranService.errorMessage(error);
    });
  }


  async deleteDispute(selectedData: BillDisputeItem) {
    await this.loading.present();
    this.disputeService.deleteBillDisputes(selectedData.Id).subscribe(async (result: any) => {
      await this.loading.dismiss();
      await this.getDisputeList();
    }, async (error) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  goToNewDispute() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '650px',
      maxHeight: '600px',
      panelClass: 'dialog',
      data: {
        component: DisputeFormComponent,
        ContactCode: this.ContactCode,
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === 'ok') {
        this.getDisputeList();
      }
    });
  }

  goToDisputeDetail(selectedData: BillDisputeItem) {
    if (selectedData) {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '100%',
        height: '100%',
        maxWidth: '650px',
        maxHeight: '600px',
        panelClass: 'dialog',
        data: {
          component: DisputeFormComponent,
          ContactCode: this.ContactCode,
          DisputeID: selectedData.Id,
        }
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res === 'ok') {
          this.getDisputeList();
        }
      });
    }
  }

  goBack() {
    this.DisputeListComponent.emit({ type: 'go-back' });
  }

}
