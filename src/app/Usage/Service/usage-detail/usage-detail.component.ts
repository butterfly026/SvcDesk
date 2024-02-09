import { Component, EventEmitter, TemplateRef, Input, OnInit, Output, ViewChild, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { TranService } from 'src/services';
import { MatDialog } from '@angular/material/dialog';
import { UsageDetailService } from './services/usage-detail.service';
import { NavController } from '@ionic/angular';
import { Subject  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GlobalService } from 'src/services/global-service.service';
import { ServiceUsageDetails, TariffValues } from '../../models';
import { Paging } from 'src/app/model';

@Component({
  selector: 'app-usage-detail',
  templateUrl: './usage-detail.component.html',
  styleUrls: ['./usage-detail.component.scss'],
})
export class UsageDetailComponent implements OnInit {


  @Input('usageDetail') usageDetailInput: any;  
  @Input() Refresh: Boolean = true;
  @Input() UsageId: string = '';
  @Output('UsageDetailComponent') public UsageDetailComponent: EventEmitter<string> = new EventEmitter<string>();


  usageDetailList = [];

  grTotal: string = '';
  selectedDealer: any;
  selectedTabIndex: number = 0;

  totalCount: number = 0;
  dataSource: ServiceUsageDetails[] = [];
  tariffValues: TariffValues[] = [];
  columns: string[] = [];
  columnIDs: string[] = [];

  eventParam = new Paging();

  private unsubscribeAll$: Subject<any> = new Subject<any>();
  private Refresh_: Boolean = true;

  alertContent: string = '';
  alertButton: string = 'OK';
  alertButtonOther: string = 'Yes';
  alertTitle: string = 'Warning';
  bInit: boolean = false;
  isQuestionDlg: boolean = false;  
  @ViewChild('alertDialog') alertDialog: TemplateRef<any>;
  @ViewChild('spinnerDialog') spinnerDialog: TemplateRef<any>;
  spinnerRef: any; 
  csvFileName: string = ''; 

  constructor(
    public navCtrl: NavController,
    private tranService: TranService,
    private usageDetailService: UsageDetailService,
    public globService: GlobalService,
    private dialog: MatDialog,
  ) {

    this.tranService.translaterService();
    this.configInitialValues();


    this.tranService.convertText('grand_total').subscribe(value => {
      this.grTotal = value;
    });
  }
  
  ngOnInit(): void {
    this.csvFileName = "Transaction Details - " + this.UsageId;
  }
  
  ngAfterViewInit() {
    this.bInit = true;
    this.getPermission();
  }

  ngOnChanges(changes: SimpleChanges): void {    
    if (this.Refresh !== undefined && this.Refresh !== this.Refresh_) {
      this.getUsageDetail()
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
    if(this.selectedTabIndex == 0)
      this.getUsageDetail();
    else{
      this.getTariff();
    }
  }

  goToNewEvent(): void { 
    this.UsageDetailComponent.emit('new');
  }

  goBack(): void {
    this.UsageDetailComponent.emit('usage');
  }

  private configInitialValues(): void {
    this.columns = [
      'Id', 'Name', 'Type', 
      'Amount', 'DiscountId', 'Discount', 'DiscountType', 'TransactionCategory', 'Tariff', 'PlanId', 'Plan',
      'OverrideId', 'Taxable'
    ];
  }
  openAlertDialog(content = '', isQuestion=false, alertBtn = 'OK', alertBtnOther='Cancel') {
    this.alertButton = alertBtn;
    this.alertButtonOther = alertBtnOther;
    this.isQuestionDlg = isQuestion;
    if (content)
      this.alertContent = content;
    this.dialog.open(this.alertDialog);
  }
  openLoadingDialog() {
    // if(!this.spinnerDialog || this.spinnerRef) return;
    this.spinnerRef = this.dialog.open(this.spinnerDialog, { disableClose: true });
  }
  closeLoadingDialog() {
    if(!this.spinnerRef) return;
    this.spinnerRef.close();
    this.spinnerRef = null;
  }
  selectTabs(en) {
    this.selectedTabIndex = en.index;
    if(this.selectedTabIndex == 1){
      this.getTariff();
    }
    
  }

  private async getPermission(): Promise<void> {
    this.getUsageDetail();
  }

  async getUsageDetail() {
    if(!this.bInit) return;
    this.dataSource = [];
    this.totalCount = 0;
    await this.openLoadingDialog();
    this.usageDetailService.usageDetailList(this.UsageId).pipe(takeUntil(this.unsubscribeAll$))
    .subscribe({
      next: async (result) =>{
        await this.closeLoadingDialog();        
        if (result === null) {
          this.tranService.errorMessage('no_transaction_detail');
        } else {          
          this.totalCount = result.length;
          this.dataSource = result;
        }
      },
      error: async (error: any) => {
        await this.closeLoadingDialog();
        let app = this;
        this.tranService.matErrorMessage(error, function (title, button, content) {
          app.alertTitle = title;
          app.alertButton = button;
          app.alertContent = content;
          app.openAlertDialog();
        });
      }
    })
    this.Refresh_ = this.Refresh;
  }

  async getTariff() {
    this.tariffValues = [];
    await this.openLoadingDialog();
    this.usageDetailService.getTariffList(this.UsageId).pipe(takeUntil(this.unsubscribeAll$))
    .subscribe({
      next: async (result) =>{
        await this.closeLoadingDialog();        
        if (result === null) {
          this.tranService.errorMessage('no_tariff');
        } else {
          var tmpData = [];
          Object.keys(result).forEach(element => {
            let tmp = {
              name: element,
              value: result[element]
            }
            tmpData.push(tmp);            
          });
          this.tariffValues = tmpData;
        }
      },
      error: async (error: any) => {
        await this.closeLoadingDialog();
        let app = this;
        this.tranService.matErrorMessage(error, function (title, button, content) {
          app.alertTitle = title;
          app.alertButton = button;
          app.alertContent = content;
          app.openAlertDialog();
        });
      }
    })

    this.Refresh_ = this.Refresh;
  }

  closeDialog(){
    this.UsageDetailComponent.emit('close');    
  }


}
