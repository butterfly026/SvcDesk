import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { LoadingService, ToastService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { ChargeListService } from './services/charge-list.service';
import { ServiceChargeItem, ServiceChargeProfileItem, ServiceChargeReqParam } from '../charges.types';
import { DatatableAction, MessageForRowDeletion, Permission, PermissionType, SearchOption } from 'src/app/Shared/models';
import { Paging } from 'src/app/model';
import { AlertService } from 'src/services/alert-service.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/Shared/components';
import { ChargeFormComponent } from '../charge-form/charge-form.component';
import { MatAlertService } from 'src/app/Shared/services';

@Component({
  selector: 'app-charge-list',
  templateUrl: './charge-list.component.html',
  styleUrls: ['./charge-list.component.scss'],
})
export class ChargeListComponent implements OnInit {
  @Input() ServiceReference: string = '';
  @Input() ServiceId: string = '';
  @Input() Refresh: Boolean = true;
  @Output('ChargeList') ChargeList: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('endDialog') endDialog: TemplateRef<any>;

  groupList: any[] = [];



  debitRunTitle = '';

  selectIndex: number;
  selectedData: any;
  gridWidth: any;
  gridContentWidth = '';

  pageTitle: string = '';

  deleteStr = '';

  deleteMessage: string = '';
  disableUpdate = false;
  disableEnd = false;
  ChargeCode: string = '';

  totalCount: number = 0;
  dataSource: ServiceChargeItem[] = [];
  columns: string[] = [];
  dataTableAction: DatatableAction = { row: ['Details', 'Update', 'Delete', 'Instances', 'End'], toolBar: ['Create', 'Refresh', 'ExportExcel'] };
  _showSearchOption: boolean = false;
  permissions: PermissionType[] = ['New', 'Details', 'Update', 'Delete'];
  searchOptions: SearchOption[] = ['Text', 'From'];

  eventParam = new Paging();

  private unsubscribeAll$: Subject<any> = new Subject<any>();
  private Refresh_: Boolean = true;
  csvFileName: string = '';

  showSearchOptions: boolean = false;
  isCurrentOnly: boolean = false;

  chargeParam: ServiceChargeReqParam = {
    SkipRecords: 0,
    TakeRecords: 10,
    CountRecords: 'Y',
    CurrentOnly: false,
  };

  deletionMsg: MessageForRowDeletion = {
    header: this.tranService.instant('are_you_sure'),
    message: this.tranService.instant('are_you_sure_delete_charge'),
  }
  endForm: UntypedFormGroup;
  currentOnlyForm: UntypedFormGroup;
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

    this.currentOnlyForm = this.formBuilder.group({
    });    
  }
  private configInitialValues(): void {
    this.columns = [
      'Id',
      'Source',
      'Status',
      'DefinitionId',
      'Description',
      'ProviderCode',
      'From',
      'To',
      'InvoicedTo',
      'BillDescription',
      'Price',

      'DiscountAmount',
      'DiscountPercentage',
      'Type',
      'Plan',
      'PlanOption',
      'PlanId',
      'PlanOptionId',
      'CustomerReference',
      'Reference',
      'OtherReference',
      'Frequency',
      'Unit',
      'Quantity',
      'Prorated',
      'Editable',
      'ChargeInAdvance',
      'AdvancePeriods',
      'DiscountBased',
      'AttributeBased',
      'AutoSourceId',
      'GeoBased',
      'DisplayEndDate',
      'Cost',
      'OverRideId',
      'OverRidePrice',
      'OverMarkUp',
      'ETF',
      'ExternalSource',
      'RevenueAccount',
      'ExternalTableName',
      'ExternalTransactionId',
      'CreatedBy',
      'Created',
      'LastUpdated',
      'UpdatedBy'
    ];
  }

  ngOnInit(): void {
    this.csvFileName = 'Service Charge History - ' + this.ServiceId;
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
    this.permissions = value.map(s => s.Resource.replace('/Services/Charges', "").replace('/', "") as PermissionType);
  }
  private async getPermission(): Promise<void> {
    await this.loading.present();
    this.globService.getAuthorization('/Services/Charges', true)
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
      CurrentOnly: this.isCurrentOnly,
      ...this.eventParam
    };
    await this.loading.present();
    this.chargeService.getChargeList(this.chargeParam, this.ServiceReference).subscribe(async (result: any) => {
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

  ngAfterViewInit() {
  }


  goBack() {
    this.ChargeList.emit('close');
  }

  goToNew() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '700px',
      maxHeight: '700px',
      panelClass: 'dialog',
      data: {
        component: ChargeFormComponent,
        ServiceReference: this.ServiceReference,
        ChargeType: '',
        IsModal: true,
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == 'ok') {
        this.getChargeList();
      }
    });
  }

  goToUpdate(selectedData: ServiceChargeProfileItem) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '700px',
      maxHeight: '700px',
      panelClass: 'dialog',
      data: {
        component: ChargeFormComponent,
        ServiceReference: this.ServiceReference,
        ChargeType: 'update',
        ChargeId: selectedData.Id,
        Title: `[${selectedData.Id} - ${selectedData.Description}]`,
        IsModal: true,
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == 'ok') {
        this.getChargeList();
      }
    });

  }

  goToDetail(selectedData: ServiceChargeProfileItem) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '700px',
      maxHeight: '700px',
      panelClass: 'dialog',
      data: {
        component: ChargeFormComponent,
        ServiceReference: this.ServiceReference,
        ChargeType: 'update',
        ReadOnly: true,
        ChargeId: selectedData.Id,
        Title: `[${selectedData.Id} - ${selectedData.Description}]`,
        IsModal: true,
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == 'ok') {
        this.getChargeList();
      }
    });
  }

  goToInstances(selectedData: ServiceChargeProfileItem) {
    let instanceObj = {
      name: 'chargeInstances',
      ChargeId: selectedData.Id,
      ChargeDescription: selectedData.Description
    }
    this.ChargeList.emit(instanceObj);
  }

  async endCharge(selectedData: ServiceChargeItem) {
    this.dialog.open(this.endDialog);
    this.endForm.get('endDate').reset();
    this.selectedData = selectedData;
    this.endFormMinDate = this.globService.getDateTimeWithString('YYYY-MM-DDTHH:mm', this.selectedData.From);
  }

  async validateDelete(selectedData: ServiceChargeProfileItem) {
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

  cancelDelete() {
    this.deleteStr = '';
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

  showHideSearchOption(bShow: boolean) {
    this.showSearchOptions = !this.showSearchOptions;
    if (this.showSearchOptions) {
      this.currentOnlyForm.addControl('CurrentOnly', new UntypedFormControl(this.isCurrentOnly));
    } else {
      this.currentOnlyForm.removeControl('CurrentOnly');
    }

  }
}
