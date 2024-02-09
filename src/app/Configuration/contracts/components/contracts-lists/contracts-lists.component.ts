import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DatatableAction, MessageForRowDeletion, Permission, PermissionType, SearchOption } from 'src/app/Shared/models';
import { ComponentOutValue, Paging } from 'src/app/model';
import { Subject } from 'rxjs';
import { LoadingService, TranService } from 'src/services';
import { AlertService } from 'src/services/alert-service.service';
import { GlobalService } from 'src/services/global-service.service';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { DialogComponent } from 'src/app/Shared/components';
import { ContractsFormComponent } from '../contracts-form/contracts-form.component';
import { ContractItemDetail, ContractOption, ContractsItemResponse } from '../../models/contracts.types';
import { ContractsService } from '../../services/contracts.service';

@Component({
  selector: 'app-contracts-lists',
  templateUrl: './contracts-lists.component.html',
  styleUrls: ['./contracts-lists.component.scss'],
})
export class ContractsListsComponent implements OnInit {
  @Output('ContractsListsComponent') ContractsListsComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  totalCount: number = 0;
  dataSource: ContractItemDetail[] = [];
  tblPageSizeOptions: number[] = [10, 20, 50];
  dataTableAction: DatatableAction = { row: ['Details', 'Update', 'Delete'], toolBar: ['Create', 'Refresh'] };  
  columnsUsedForDate: string[] = [''];
  eventParam = new Paging();
  permissions: PermissionType[] = [];
  csvFileName: string;
  _showSearchOption: boolean = false;
  searchOptions: SearchOption[] = ['Text', 'Uninvoiced'];
  columnsUsedForCurrency: string[] = ['DisconnectionFee',];
  propertyNameToShowInSubTable: string = 'Extensions';
  contractOption: ContractOption = new ContractOption();
  columns: string[] = [
    'Id',
    'Name',
    'Penalty',
    'CoolOffDays',
    'PenaltyPercentage',
    'PenaltyId',
    'DisconnectionUnit',
    'Disconnection',
    'DisconnectionFee',
    'TermUnit',
    'Term',
    'Service',
    'Contact',
    'CreatedBy',
    'Created',
    'UpdatedBy',
    'LastUpdated'
  ];
  subTableColumns: string[] = [
    'Id',
    'Name',
    'Discount',
    'Term',
    'Commission',
    'From',
    'To',
    'CreatedBy',
    'Created',
    'UpdatedBy',
    'LastUpdated',
  ]

  deletionMsg: MessageForRowDeletion = {
    header: this.tranService.instant('are_you_sure'),
    message: this.tranService.instant('are_you_sure_delete_contract'),
  }
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private loading: LoadingService,
    private contractsService: ContractsService,
    private tranService: TranService,
    private alertService: AlertService,
    public globService: GlobalService,
    public dialog: MatDialog,
  ) {
    this.tranService.translaterService();
  }

  ngOnInit(): void {
    this.csvFileName = this.tranService.instant('Contracts');
    this.getPermission();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  async fetchData(event: Paging): Promise<void> {
    this.eventParam = event;
    this.getContractsList();
  }

  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/Contracts', "").replace('/', "") as PermissionType);
  }

  private async getPermission(): Promise<void> {
    await this.loading.present();
    this.globService.getAuthorization('/Contracts', true)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (_result: Permission[]) => {
          this.formatPermissions(_result);
          await this.loading.dismiss();
          if (this.permissions.includes('')) {
            this.getContractsList();
          } else {
            await this.loading.dismiss();
            this.tranService.errorMessage('resource_forbidden');
            this.alertService.closeAllAlerts();
            setTimeout(() => {
              this.ContractsListsComponent.emit({ type: 'close' });
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
              this.ContractsListsComponent.emit({ type: 'close' });
            }, 1000);
          }
        }
      });
  }

  private async getContractsList(): Promise<void> {
    await this.loading.present();
    this.contractsService.getContractsList(this.eventParam, this.contractOption)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result: ContractsItemResponse) => {
          await this.loading.dismiss();
          if (result === null) {
            this.tranService.errorMessage('no_contracts');
          } else {
            this.totalCount = result.Count;
            this.dataSource = result.Contracts;
          }
        },
        error: async (error: any) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      });
  }

  goBack(): void {
    this.ContractsListsComponent.emit({ type: 'close' });
  }

  async addNew(): Promise<void> {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '750px',
      maxHeight: '680px',
      panelClass: 'dialog',
      data: {
        component: ContractsFormComponent,
        EditMode: 'New',
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === 'ok') {
        this.getContractsList();
      }
    });
  }

  async editOne(event: ContractItemDetail): Promise<void> {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '750px',
      maxHeight: '680px',
      panelClass: 'dialog',
      data: {
        component: ContractsFormComponent,
        EditMode: 'Update',
        ContractId: event.Id,
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === 'ok') {
        this.getContractsList();
      }
    });
  }

  async viewDetail(event: ContractItemDetail): Promise<void> {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '750px',
      maxHeight: '680px',
      panelClass: 'dialog',
      data: {
        component: ContractsFormComponent,
        EditMode: 'View',
        ContractId: event.Id,
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === 'ok') {
        this.getContractsList();
      }
    });
  }

  async deleteItem(event: ContractItemDetail): Promise<void> {
    await this.loading.present();
    this.contractsService.deleteContract(event.Id)
      .subscribe({
        next: async (result) =>{
          await this.loading.dismiss();
          this.getContractsList();
        },
        error: async (error: any) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      });
  }

  showHideSearchOption(val){
    this._showSearchOption = val;
  }
  get ShowSearchOption(){
    return this._showSearchOption;
  }
}
