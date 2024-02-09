import { AfterContentChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UsageHistoryService } from './services/usage-history.service';
import { LoadingService, ToastService, TranService } from 'src/services';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GlobalService } from 'src/services/global-service.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ServiceUsageHistory } from '../../models';
import { AlertService } from 'src/services/alert-service.service';
import { Paging } from 'src/app/model';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { UsageDetailComponent } from '../usage-detail/usage-detail.component';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { DatatableAction, Permission, PermissionType, SearchOption } from 'src/app/Shared/models';
import * as moment from 'moment';
import { DialogComponent } from 'src/app/Shared/components';
import { UsageComponentsFormComponent } from '../usage-components-form/usage-components-form.component';

@Component({
  selector: 'app-usage-account-history',
  templateUrl: './usage-history.component.html',
  styleUrls: ['./usage-history.component.scss'],
})
export class UsageHistoryComponent implements OnInit, AfterContentChecked {
  @Input() ContactCode: string = '';

  @Input() Refresh: Boolean = true;
  @Output('setComponentValue') public componentValue: EventEmitter<string> = new EventEmitter<string>();

  usageDetailConfig = new MatDialogConfig();
  usageDetailDialog: MatDialogRef<UsageDetailComponent, any> | undefined;


  public selectedUsageHistory: any;
  usageDetail: any;
  totalCount: number = 0;
  dataSource: ServiceUsageHistory[] = [];
  columns: string[] = [];
  dataTableAction: DatatableAction = { row: ['Details'], toolBar: ['Refresh', 'ExportExcel'] };
  _showSearchOption: boolean = false;
  permissions: PermissionType[] = [];
  searchOptions: SearchOption[] = ['Text', 'From', 'To', 'Uninvoiced'];

  eventParam = new Paging();  

  private unsubscribeAll$: Subject<any> = new Subject<any>();
  private Refresh_: Boolean = true;

  groupForm: UntypedFormGroup;
  constructor(
    public navCtrl: NavController,
    private toast: ToastService,
    private loading: LoadingService,
    private tranService: TranService,
    private usageHistoryService: UsageHistoryService,
    private cdr: ChangeDetectorRef,
    private matDialog: MatDialog,
    public dialog: MatDialog,
    private alertService: AlertService,
    public globService: GlobalService,
    private formBuilder: UntypedFormBuilder,
  ) {

    this.tranService.translaterService();
    this.configInitialValues();

    this.groupForm = this.formBuilder.group({
      From: [''],
      To: [''],
      Uninvoiced: [true],
    });

    this.groupForm.get('Uninvoiced').valueChanges.subscribe((result: any) => {
        this.getUsageHistory();
    });

  }
  ngAfterContentChecked(): void {

  }

  ngOnInit(): void {
    this.getPermission();
  }

  ngOnChanges(): void {
    if (this.Refresh !== undefined && this.Refresh !== this.Refresh_) {
      this.getUsageHistory()
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
    this.getUsageHistory();
  }

  goToNewEvent(): void {
    this.componentValue.emit('new');
  }

  goBack(): void {
    this.componentValue.emit('close');
  }  

  onKeyDownFrom(event){
    if(event.keyCode == 13) {
      if(this.groupForm.get('From').value) {        
        this.getUsageHistory();
      }
    }   
  }
  onKeyDownTo(event){
    if(event.keyCode == 13) {
      if(this.groupForm.get('To').value) {        
        this.getUsageHistory();
      }
    }   
  }
  addEventTo(type: string, event: MatDatepickerInputEvent<Date>) {
    if(type == 'input') return;
    this.getUsageHistory();
  }
  public redirectUsageDetail = (usage_detail): void => {

    this.usageDetail = usage_detail
    // this.componentValue.emit('usage-detail&&' + JSON.stringify(this.usageDetail));
  };

  processUsageDetail(event) {
    if (event === 'close') {
      this.usageDetail = null;
    } else if (event === 'usage') {
      this.usageDetail = null;
    }
  }

  private configInitialValues(): void {
    this.columns = [
      'Id',
      'ServiceId',
      'ServiceNarrative',
      'ServiceType',
      'ServiceTypeId',
      'StartDateTime',
      'Details',
      'AdditionalDetails',
      'Duration',
      'UnitQuantity',
      'UnitOfMeasure',
      'Price',
      'Tax',
      'NonDiscountedPrice',
      'NonDiscountedTax',
      'Cost',
      'CostTax',
      'UsageGroup',
      'UsageGroupCode',
      'UsageGroupOrder',
      'TimeBandDescription',
      'TariffCode',
      'Tariff',
      'Origin',
      'ThirdParty',
      'Band1RateUnit',
      'TaxFree'
    ];
  }
  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/UsageTransactions/Accounts', "").replace('/', "") as PermissionType);
  }
  private async getPermission(): Promise<void> {
    await this.loading.present();
    this.globService.getAuthorization('/UsageTransactions/Accounts', true)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (_result) => {
          await this.loading.dismiss();
          this.formatPermissions(_result);
          if (this.permissions.includes('')) {
            this.getUsageHistory();
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

  async getUsageHistory() {
    
    await this.loading.present();
    let reqData = {
      ...this.globService.convertRequestBody(this.groupForm.value),
      ...this.eventParam
    };    
    if(!this._showSearchOption){
      reqData.From = null;
      reqData.To = null;
      reqData.Uninvoiced = null;
    }else{
      if(this.groupForm.get('From').value)
        reqData.From = moment(this.groupForm.get('From').value).format('YYYY-MM-DD');
      if(this.groupForm.get('To').value)
        reqData.To = moment(this.groupForm.get('To').value).format('YYYY-MM-DD');
    }
    
    reqData = Object
      .entries({...reqData})
      .reduce(
        (a, [key, val]) => ((val === null || val === undefined || val === '') ? a : (a[key] = val, a)), {}
      );
    this.usageHistoryService.getUsageHistory(reqData, this.ContactCode)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result) => {
          await this.loading.dismiss();
          if (result === null) {
            this.tranService.errorMessage('no_transactions');
          } else {
            this.totalCount = result.Count;
            this.dataSource = result.Transactions;
          }
        },
        error: async (error: any) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      })

    this.Refresh_ = this.Refresh;
  }
  viewSelectedUsage(row) {
    this.openCreateDialog(row);
  }
  async openCreateDialog(usageData) {
    await this.loading.present();
    this.globService.getAuthorization('/UsageTransactions/Details').subscribe(async (result: any) => {
      await this.loading.dismiss();

      if (!result || result.length == 0) {
        this.tranService.errorToastMessage('no_cost_configs');
      } else {
        if (result === null) {
          this.tranService.errorToastMessage('no_cost_configs');
        } else {

          this.usageDetailConfig.id = "contact-cost-center-new";
          this.usageDetailConfig.height = "700px";
          this.usageDetailConfig.width = "1000px";
          this.usageDetailDialog = this.matDialog.open(UsageDetailComponent, this.usageDetailConfig);          
          this.usageDetailDialog.componentInstance.UsageId = usageData.Id;
          this.usageDetailDialog.componentInstance.UsageDetailComponent.subscribe(event => {
            if (event === 'close') {
              this.usageDetailDialog.close();
            }
          })
        }
      }

    }, async (error: any) => {

      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  async viewDetail(event): Promise<void> {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '750px',
      maxHeight: '680px',
      panelClass: 'dialog',
      data: {
        component: UsageComponentsFormComponent,
        UsageId: event.Id,
      }
    });
  }
  
  showHideSearchOption(val){
    this._showSearchOption = val;
  }
  get ShowSearchOption(){
    return this._showSearchOption;
  }
  get csvFileName(){
    return 'Usage Transaction - ' + this.ContactCode;
  }

}