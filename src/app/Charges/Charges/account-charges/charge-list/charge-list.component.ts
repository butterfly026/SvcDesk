import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Paging,} from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { ChargeListService } from './services/charge-list-service';
import { DatatableAction, Permission, PermissionType, SearchOption } from 'src/app/Shared/models';
import { AlertService } from 'src/services/alert-service.service';
import { DialogComponent } from 'src/app/Shared/components';
import { ChargeDetailComponent } from '../charge-detail/charge-detail.component';
import { ChargeItem, ChargeReqParam } from '../charges.types';
import { ChargeInstancesComponent } from '../charge-instances/charge-instances.component';
import { ChargeNewComponent } from '../charge-new/charge-new.component';
import { MatAlertService } from 'src/app/Shared/services';

@Component({
  selector: 'app-charge-list',
  templateUrl: './charge-list.component.html',
  styleUrls: ['./charge-list.component.scss'],
})
export class ChargeListComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Input() Refresh: Boolean = true;
  @Output('ChargeList') ChargeList: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('endDialog') endDialog: TemplateRef<any>;

  pageTitle: string = '';

  deleteStr = '';
  selectedData: ChargeItem = null;
  deleteMessage: string = '';
  disableUpdate = false;
  disableEnd = false;
  ChargeCode: string = '';
  totalCount: number = 0;
  dataSource: ChargeItem[] = [];
  columns: string[] = [];
  dataTableAction: DatatableAction = { row: ['Details', 'Update', 'Delete', 'Instances', 'End'], toolBar: ['Create', 'Refresh', 'ExportExcel'] };
  columnsUsedForCurrency: string[] = ['Price', 'Cost', 'DiscountAmount', 'OverRidePrice', 'ETF'];
  _showSearchOption: boolean = false;
  permissions: PermissionType[] = ['New', 'Details', 'Update', 'Delete'];
  searchOptions: SearchOption[] = ['Text', 'From'];

  eventParam = new Paging();
  isAccountOnly: boolean = false;

  private unsubscribeAll$: Subject<any> = new Subject<any>();
  private Refresh_: Boolean = true;
  csvFileName: string = '';

  showSearchOptions: boolean = false;

  chargeParam: ChargeReqParam = {
    SkipRecords: 0,
    TakeRecords: 10,
    CountRecords: 'Y',
    CurrentOnly: true,
    AccountOnly: false,
  };

  endForm: UntypedFormGroup;
  accountOnlyForm: UntypedFormGroup;
  endFormMinDate: any;

  constructor(
    private loading: LoadingService,
    private chargeService: ChargeListService,
    private tranService: TranService,
    private alertService: AlertService,
    private dialog: MatDialog,
    private matAlert: MatAlertService,
    public globService: GlobalService,
    private formBuilder: UntypedFormBuilder,
  ) {
    this.tranService.translaterService();
    this.configInitialValues();
    this.tranService.convertText('charge_list').subscribe(value => {
      this.pageTitle = value;
    });

    this.endForm = this.formBuilder.group({
      endDate: ['', Validators.required]
    });

    this.accountOnlyForm = this.formBuilder.group({
    });

  }
  private configInitialValues(): void {
    this.columns = [
      'Id',
      'ServiceId',
      'ServiceType',
      'Description',
      'From',
      'To',
      'InvoicedTo',
      'BillDescription',
      'Price',
      'Frequency',
      'ChargeInAdvance',
      'Prorated',
      'Plan',
      'PlanOption',
      'Unit',
      'Quantity',
      'DiscountAmount',
      'DiscountPercentage',
      'Type',
      'Source',
      'Status',
      'CustomerReference',
      'Reference',
      'OtherReference',
      'Cost',
      'ProviderCode',
      'AdvancePeriods',
      'DiscountBased',
      'AttributeBased',
      'AutoSourceId',
      'GeoBased',
      'OverRideId',
      'OverRidePrice',
      'OverMarkUp',
      'ETF',
      'ExternalSource',
      'RevenueAccount',
      'ExternalTableName',
      'ExternalTransactionId',
      'DefinitionId',
      'ServiceReference',
      'ServiceTypeId',
      'PlanId',
      'PlanOptionId',
      'DisplayEndDate',
      'Editable',
      'CreatedBy',
      'Created',
      'LastUpdated',
    ];
  }
  ngOnInit(): void {
    this.csvFileName = 'Account Charge History - ' + this.ContactCode;
    this.getPermission();
  }

  ngOnChanges(): void {
    if (this.Refresh !== undefined && this.Refresh !== this.Refresh_) {
      this.getChargeList()
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
    this.getChargeList();
  }
  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/Accounts/Charges', "").replace('/', "") as PermissionType);
  }
  private async getPermission(): Promise<void> {
    await this.loading.present();
    this.globService.getAuthorization('/Accounts/Charges', true)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (_result) => {
          await this.loading.dismiss();
          this.formatPermissions(_result);
          if (this.permissions.includes('')) {
            this.getChargeList();
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
  async getChargeList() {
    this.dataSource = [];
    this.chargeParam = {
      CurrentOnly: false,
      AccountOnly: this.isAccountOnly,
      ...this.eventParam
    };
    await this.loading.present();
    this.chargeService.getChargeList(this.chargeParam, this.ContactCode).subscribe(async (result: any) => {
      await this.loading.dismiss();
      if (result === null) {
        this.tranService.errorMessage('no_charges');
      } else {
        this.dataSource = result.Items;
        this.totalCount = result.Count;
      }
    }, async (error: any) => {
      await this.loading.dismiss();

      this.tranService.errorMessage(error);
    });
  }


  goBack() {
    this.ChargeList.emit('close');
  }

  goToNew() {
    this.dialog.open(DialogComponent, {
      width: '100%',
      maxWidth: '750px',
      maxHeight: '835px',
      panelClass: 'dialog',
      data: {
        component: ChargeNewComponent,
        ContactCode: this.ContactCode,
        Title: this.tranService.instant('NewCharges'),
      }
    })
  }

  goToUpdate(selectedData: ChargeItem) {
    this.dialog.open(DialogComponent, {
      width: '100%',
      maxWidth: '750px',
      maxHeight: '835px',
      panelClass: 'dialog',
      data: {
        component: ChargeNewComponent,
        ContactCode: this.ContactCode,
        ChargeId: selectedData.Id,
        Title: `[${selectedData.Id} - ${selectedData.Description}]`,
        ChargeType: 'update',
        ReadOnly: false
      }
    })
  }

  goToDetail(selectedData: ChargeItem) {
    this.dialog.open(DialogComponent, {
      width: '100%',
      maxWidth: '600px',
      maxHeight: '835px',
      panelClass: 'dialog',
      data: {
        component: ChargeDetailComponent,
        chargeData: selectedData,
      }
    })
  }

  goToInstances(selectedData: ChargeItem) {
    this.dialog.open(DialogComponent, {
      width: '100%',
      maxWidth: '750px',
      maxHeight: '835px',
      panelClass: 'dialog',
      data: {
        component: ChargeInstancesComponent,
        ContactCode: this.ContactCode,
        ChargeId: selectedData.Id,
        Title: `[${selectedData.Id} - ${selectedData.Description}]`,
        ChargeType: 'update',
        ReadOnly: false
      }
    })
  }

  async endCharge(selectedData: ChargeItem) {
    this.deleteStr = 'end';
    this.endForm.get('endDate').reset();
    this.selectedData = selectedData;
    this.dialog.open(this.endDialog);
    this.endFormMinDate = this.globService.getDateTimeWithString('YYYY-MM-DDTHH:mm', this.selectedData.From);
  }

  async validateDelete(selectedData: ChargeItem) {
    await this.loading.present();
    this.chargeService.validateDelete(selectedData.Id.toString()).subscribe(async (validResult: any) => {
      await this.loading.dismiss();
      if (validResult && validResult.length > 0) {
        let msgStr = '';
        validResult.forEach(val => {
          const msg = `${val.Field} : ${val.Detail}`;
          msgStr += !msgStr ? (msg + '\n') : msg;
        })
        this.matAlert.alert(this.tranService.instant('ValidationWarningsDelete') + '\n' + msgStr,
          this.tranService.instant('Warning'),
          this.tranService.instant('Yes'),
          this.tranService.instant('No')).subscribe(async (result) => {
            if (result) {
              this.deleteCharge(selectedData.Id);
            }
          });
      } else {
        this.deleteCharge(selectedData.Id);
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });

  }

  async deleteCharge(delId: number){
    await this.loading.present();
    this.chargeService.deleteCharge(delId).subscribe(async (result: any) => {
      await this.loading.dismiss();
      this.deleteStr = '';
      this.getChargeList();
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  async confirmEnd() {
    const RequestBody = {
      To: this.endForm.get('endDate').value,
    }

    await this.loading.present();
    this.chargeService.endCharge(this.selectedData.Id, this.globService.convertRequestBody(RequestBody)).subscribe(async (result: any) => {
      await this.loading.dismiss();
      this.cancelEnd();
      this.getChargeList();
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });

  }

  cancelEnd() {
    this.deleteStr = '';
  }

  showHideSearchOption(bShow: boolean){
    this.showSearchOptions = !this.showSearchOptions;
    if(this.showSearchOptions)
      this.accountOnlyForm.addControl('AccountOnly', new UntypedFormControl(this.isAccountOnly));
    else
      this.accountOnlyForm.removeControl('AccountOnly');

  }

}
