import { AfterContentChecked, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { Subscription } from 'rxjs';
import { ToastService, LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { FinancialUsageHistoryService } from './services/financial-usage-history-service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Transaction } from '../financial-usage/financial-usage.component.type';

@Component({
  selector: 'app-financial-usage-history',
  templateUrl: './financial-usage-history.component.html',
  styleUrls: ['./financial-usage-history.component.scss'],
})
export class FinancialUsageHistoryComponent implements OnInit, AfterContentChecked {

  @ViewChild('usageDetailGrid') usageDetailRef: jqxGridComponent;

  @Output('FinancialUsageDetailComponent') public FinancialUsageDetailComponent: EventEmitter<string> = new EventEmitter<string>();


  usageDetailList = [];

  public rowList: Array<number> = [10, 20, 50, 100];


  grTotal: string = '';
  selectedDealer: any;

  source = {
    localdata: [],
    datafields: [
      { name: 'plan_discount', type: 'string', },
      { name: 'entry_type', type: 'string', },
      { name: 'amount', type: 'string', },
      { name: 'taxable', type: 'string', },
      { name: 'entry_id', type: 'string', },
      { name: 'disc_id', type: 'string', },
      { name: 'tariff_num', type: 'string', },
      { name: 'planid', type: 'string', },
      { name: 'overrideid', type: 'string', },
      { name: 'transaction', type: 'string', },
      { name: 'discount_type', type: 'string', }
    ],
    datatype: 'array',
    pagesize: 10
  };


  public dataAdapter: any = new jqx.dataAdapter(this.source);
  _grandTotalText = `<div style="font-size: smaller; line-height: 30px; color: #222428;"><strong>${'Grand Total'}:</strong></div>`;
  _aggregateSum = (aggregates: { sum: string }): string => `<div style="font-size: smaller; line-height: 30px; color: #222428;"><strong>${aggregates.sum}</strong></div>`;


  public columns: Array<any> = [
    { text: 'plan_slash_discount', datafield: 'plan_discount', width: 200, aggregatesrenderer: () => this._grandTotalText },
    { text: 'entry_type', datafield: 'entry_type', width: 200, },
    { text: 'amount', datafield: 'amount', width: 100, cellsalign: 'right', aggregates: ['sum'], aggregatesrenderer: this._aggregateSum },
    { text: 'taxable', datafield: 'taxable', width: 100, },
    { text: 'entry_id', datafield: 'entry_id', width: 100, },
    { text: 'discount_id', datafield: 'disc_id', width: 100, },
    { text: 'tariff_num', datafield: 'tariff_num', width: 100, },
    { text: 'planid', datafield: 'planid', width: 100, },
    { text: 'overrideid', datafield: 'overrideid', width: 100, },
    { text: 'transaction', datafield: 'transaction', width: 100, },
    { text: 'discount_type', datafield: 'discount_type', width: 100, }
  ];


  totalLength: any;
  pageRowNumber: number = 1;
  rowStep: string = '10';
  SkipRecords: number = 0;

  usageParam = {
    SearchString: '',
    SkipRecords: 0,
    TakeRecords: 10,
    CountRecords: 'Y',
  };
  gridRecords: any = {};

  gridWidth: any;
  gridContentWidth = '';


  constructor(
    public navCtrl: NavController,
    private toast: ToastService,
    private loading: LoadingService,
    private tranService: TranService,
    private usageDetailService: FinancialUsageHistoryService,
    private cdr: ChangeDetectorRef,
    public globService: GlobalService,
    private dialogRef: MatDialogRef<FinancialUsageHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Transaction
  ) {

    this.tranService.translaterService();
    this.translateColumns();


    this.tranService.convertText('grand_total').subscribe(value => {
      this.grTotal = value;
    });
    this.setGridWidth();
  }

  async getUsageDetail() {
    await this.loading.present();
    this.usageDetailService.usageDetailList().subscribe(async (result) => {
      this.usageDetailList = result;
      this.totalLength = result.length;
      this.setGridData();
      await this.loading.dismiss();
    }, async error => {
      this._handleError(error.message);
      await this.loading.dismiss();
    });
  }

  getWidth() {
    let element = document.getElementById('usage-detail-grid');
    if (typeof (element) !== 'undefined' && element !== null) {
      return element.offsetWidth;
    } else {
      return 900;
    }
  }

  setGridWidth() {
    this.getGridWidth();
    if (this.getWidth() > this.gridWidth + 32) {
      const tempData = this.gridContentWidth;
      this.gridContentWidth = this.gridWidth + 'px';
      if (tempData !== '' && tempData !== this.gridContentWidth) {
        this.cdr.detectChanges();
        this.setGridData();
      }
      return this.gridWidth;
    } else {
      const tempData = this.gridContentWidth;
      this.gridContentWidth = '100%';
      if (tempData !== '' && tempData !== this.gridContentWidth) {
        this.cdr.detectChanges();
        this.setGridData();
      }
      return 'calc(100% - 2px)';
    }
  }

  getGridWidth() {
    this.gridWidth = 0;
    for (let i = 0; i < this.columns.length; i++) {
      if (this.columns[i]['width']) {
        this.gridWidth += this.columns[i]['width'];
      }
    }
  }

  setGridData() {
    for (let list of this.usageDetailList) {
      const tempData = {
        plan_discount: list.plan_discount,
        entry_type: list.entry_type,
        amount: this.globService.getCurrencyConfiguration(list.amount),
        taxable: list.taxable,
        entry_id: list.entry_id,
        disc_id: list.disc_id,
        tariff_num: list.tariff_num,
        planid: list.planid,
        overrideid: list.overrideid,
        transaction: list.transaction,
        discount_type: list.discount_type,
      };
      this.source.localdata.push(tempData);
    }
    this.usageDetailRef.updatebounddata();
    this.source.localdata.length = 0;
    this.gridRecords = this.usageDetailRef.attrSource;
    this.setGridColumnWidth(this.gridRecords.records);
  }

  setGridColumnWidth(list) {
    let columnsMaxWidth = {
      plan_discount: 0,
      entry_type: 0,
      amount: 0,
      taxable: 0,
      entry_id: 0,
      disc_id: 0,
      tariff_num: 0,
      planid: 0,
      overrideid: 0,
      transaction: 0,
      discount_type: 0,
    };

    for (const record of list) {
      for (const key in columnsMaxWidth) {
        if (record[key] && columnsMaxWidth[key] < (record[key]).toString().length) {
          columnsMaxWidth[key] = (record[key]).toString().length;
        }
      }
    }

    for (let list of this.columns) {
      this.tranService.convertText(list.datafield).subscribe(result => {
        if (columnsMaxWidth[list.datafield] < result.length) {
          this.usageDetailRef.setcolumnproperty(list.datafield, "width", result.length * 8 + 10);
        } else {
          this.usageDetailRef.setcolumnproperty(list.datafield, "width", columnsMaxWidth[list.datafield] * 8 + 10);
        }
      });
    }
  }

  outPagingComponent(event) {
    this.usageParam.SkipRecords = event.SkipRecords;
    this.usageParam.TakeRecords = event.TakeRecords;

    this.pageRowNumber = event.pageRowNumber;
    this.rowStep = event.rowStep;
    this.SkipRecords = event.SkipRecords;

    this.getUsageDetail();
  }

  exportData() {
    this.usageDetailRef.exportview('xlsx', 'Financial Usage History');
  }

  ngOnInit(): void {
    this.getUsageDetail();
  }

  refreshGrid() {
    this.usageParam.SkipRecords = 0;
    this.usageParam.TakeRecords = 10;
    this.pageRowNumber = 1;
    this.rowStep = '10';
    this.globService.globSubject.next('refresh-grid');
    this.getUsageDetail();
  }


  ngAfterContentChecked(): void {

    // this.pageRowNumberLimit = this.usageDetailRef.getpaginginformation().pagescount;
  }

  private _handleError = (message: string): Subscription =>
    this.tranService.convertText(message)
      .subscribe(
        value => this.toast.present(value)
      );


  private translateColumns = (): void => this.columns.forEach((obj, idx) => {
    this.tranService.convertText(obj.text).subscribe(text => this.columns[idx].text = text);
  });

  goBack() {
    this.dialogRef.close();
    this.FinancialUsageDetailComponent.emit('close');
  }


}
