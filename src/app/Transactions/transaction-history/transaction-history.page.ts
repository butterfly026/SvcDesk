import { Component, OnInit, ChangeDetectorRef, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { TransactionHistoryService } from './services/transaction-history.service';
import { TranService, LoadingService } from 'src/services';

import { ConvertDateFormatService } from 'src/services/convert-dateformat.service';

import * as moment from 'moment';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { Transactions } from 'src/app/model';
import { GlobalService } from 'src/services/global-service.service';

var downloadIndexI: number = -10;
var selectedFinDoc: any;

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.page.html',
  styleUrls: ['./transaction-history.page.scss'],
})
export class TransactionHistoryPage implements OnInit {


  @Input() ContactCode: string = '';
  @Input() TypeStr: string = '';
  @Input() BillId: string = '';
  @Output('TransactionHistoryComponent') TransactionHistoryComponent: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('TransactionHistoryGrid') TransactionHistoryGrid: jqxGridComponent;

  

  groupList: Array<Transactions> = [];

  selectIndex: number;
  selectedData: any;
  gridWidth: any;
  gridContentWidth = '';

  childGrid: Array<any> = [];
  selectedInvoiceOrReceipt: any;

  downloadStr: string = '';
  detailStr: string = '';
  servicesStr: string = '';
  tranStr: string = '';
  chargeStr: string = '';

  source = {
    localdata: [],
    datafields: [
      { name: 'id', type: 'string', },
      { name: 'servicenumber', type: 'string', },
      { name: 'startdatetime', type: 'string', },
      { name: 'bparty', type: 'string', },
      { name: 'bpartydescription', type: 'string', },
      { name: 'duration', type: 'string', },
      { name: 'unitquantity', type: 'string', },
      { name: 'unitofmeasure', type: 'string', },
      { name: 'price', type: 'string', },
      { name: 'tax', type: 'string', },
      { name: 'nondiscountedprice', type: 'string', },
      { name: 'undiscountedpricetaxex', type: 'string', },
      { name: 'cost', type: 'string', },
      { name: 'costtax', type: 'string', },
      { name: 'usagegroup', type: 'string', },
      { name: 'usagegroupcode', type: 'string', },
      { name: 'usagegrouporder', type: 'string', },
      { name: 'ratebanddescription', type: 'string', },
      { name: 'tariffcode', type: 'string', },
      { name: 'tariff', type: 'string', },
      { name: 'origin', type: 'string', },
      { name: 'thirdparty', type: 'string', },
      { name: 'band1rateunit', type: 'string', },
      { name: 'taxfree', type: 'string', },
      { name: 'servicenarrative', type: 'string', },
      { name: 'servicereference', type: 'string', },
    ],
    datatype: 'array'
  };

  dataAdapter: any = new jqx.dataAdapter(this.source);

  columns = [
    { text: '', datafield: 'id', width: 80 },
    { text: '', datafield: 'servicenumber', width: 150 },
    { text: '', datafield: 'startdatetime', width: 150 },
    { text: '', datafield: 'bparty', width: 100 },
    { text: '', datafield: 'bpartydescription', width: 160 },
    { text: '', datafield: 'duration', width: 100 },
    { text: '', datafield: 'unitquantity', width: 120 },
    { text: '', datafield: 'unitofmeasure', width: 120 },
    { text: '', datafield: 'price', cellsalign: 'right', width: 80 },
    { text: '', datafield: 'tax', cellsalign: 'right', width: 80 },
    { text: '', datafield: 'nondiscountedprice', cellsalign: 'right', width: 180 },
    { text: '', datafield: 'undiscountedpricetaxex', cellsalign: 'right', width: 150 },
    { text: '', datafield: 'cost', cellsalign: 'right', width: 60 },
    { text: '', datafield: 'costtax', cellsalign: 'right', width: 80 },
    { text: '', datafield: 'usagegroup', width: 80 },
    { text: '', datafield: 'usagegroupcode', width: 120 },
    { text: '', datafield: 'usagegrouporder', width: 120 },
    { text: '', datafield: 'ratebanddescription', width: 180 },
    { text: '', datafield: 'tariffcode', width: 120 },
    { text: '', datafield: 'tariff', width: 60 },
    { text: '', datafield: 'origin', width: 60 },
    { text: '', datafield: 'thirdparty', width: 100 },
    { text: '', datafield: 'band1rateunit', width: 120 },
    { text: '', datafield: 'taxfree', width: 80 },
    { text: '', datafield: 'servicenarrative', width: 150 },
    { text: '', datafield: 'servicereference', width: 150 },
  ];

  public rowdetailstemplate: any = {
    rowdetails: '<div id="nestedGridBill" style="margin: 10px; margin-top: 0px;">'
      + '</div>', rowdetailsheight: 200, rowdetailshidden: true
  };

  initRowDetails = (index: number, parentElement: any, gridElement: any, record: any): void => {


    const container = document.createElement('div');
    container.id = 'transactionHistory' + index;
    container.classList.add('d-flex', 'flex-wrap');
    container.style.border = 'none';

    parentElement.appendChild(container);

    const container3 = document.createElement('div');
    container3.id = 'transactionHistoryServices' + index;
    container3.classList.add('ion-margin-end', 'disable-item');
    container3.style.border = 'none';
    container3.style.marginRight = '10px';
    container.appendChild(container3);

    const container4 = document.createElement('div');
    container4.id = 'transactionHistoryTransactions' + index;
    container4.classList.add('ion-margin-end', 'disable-item');
    container4.style.border = 'none';
    container4.style.marginRight = '10px';
    container.appendChild(container4);

    const container5 = document.createElement('div');
    container5.id = 'transctionHistoryCharges' + index;
    container5.classList.add('ion-margin-end', 'disable-item');
    container5.style.border = 'none';
    container5.style.marginRight = '10px';
    container.appendChild(container5);

    const container1 = document.createElement('div');
    container1.id = 'transactionHistoryButtons' + index;
    container1.classList.add('ion-margin-end', 'disable-item');
    container1.style.border = 'none';
    container1.style.marginRight = '10px';
    container.appendChild(container1);

    const container2 = document.createElement('div');
    container2.id = 'transactionHistoryDetail' + index;
    container2.classList.add('ion-margin-end', 'disable-item');
    container2.style.border = 'none';
    container2.style.marginRight = '10px';
    container.appendChild(container2);

    const serviceOption = {
      theme: this.globService.themeColor,
      value: this.servicesStr,
      width: 100,
      height: 30,
    };

    const serviceButton = jqwidgets.createInstance('#' + container3.id, 'jqxButton', serviceOption);
    serviceButton.addEventHandler('click', function (): void {
    });

    const tranOption = {
      theme: this.globService.themeColor,
      value: this.tranStr,
      width: 100,
      height: 30,
    };
    const tranButton = jqwidgets.createInstance('#' + container4.id, 'jqxButton', tranOption);
    tranButton.addEventHandler('click', function (): void {
    });

    const chargeOption = {
      theme: this.globService.themeColor,
      value: this.chargeStr,
      width: 100,
      height: 30,
    };
    const chargeButton = jqwidgets.createInstance('#' + container5.id, 'jqxButton', chargeOption);
    chargeButton.addEventHandler('click', function (): void {
    });

    const downOption = {
      theme: this.globService.themeColor,
      value: this.downloadStr,
      width: 100,
      height: 30,
    };
    const downButton = jqwidgets.createInstance('#' + container1.id, 'jqxButton', downOption);
    downButton.addEventHandler('click', function (): void {
      downloadIndexI = index;
      document.getElementById('downloadButtonBill').click();
    });

    const detailOptin = {
      theme: this.globService.themeColor,
      value: this.detailStr,
      width: 100,
      height: 30,
    };
    const detailButton = jqwidgets.createInstance('#' + container2.id, 'jqxButton', detailOptin);
    detailButton.addEventHandler('click', function (): void {
    });

    const groupDetail = this.groupList[index].TransactionComponents;
    if (typeof (parentElement) !== 'undefined' && typeof (groupDetail) !== 'undefined') {
      let nestedGridContainer = parentElement.children[0];
      let tempArray = [];
      for (let list of groupDetail) {
        let temp = {
          id: list.Id,
          name: list.Name,
          type: list.Type,
          amount: list.Amount,
          discount_id: list.DiscountId,
          discount: list.Discount,
          transaction_category: list.TransactionCategory,
          tariff: list.Tariff,
          planid: list.PlanId,
          overrideid: list.OverrideId,
          taxable: list.Taxable
        };
        tempArray.push(temp);
      }

      let detailDataSource =
      {
        datafields: [
          { name: 'id', type: 'string' },
          { name: 'name', type: 'string' },
          { name: 'type', type: 'string' },
          { name: 'amount', type: 'string' },
          { name: 'discount_id', type: 'string' },
          { name: 'discount', type: 'string' },
          { name: 'transaction_category', type: 'string' },
          { name: 'tariff', type: 'string' },
          { name: 'planid', type: 'string' },
          { name: 'overrideid', type: 'string' },
          { name: 'taxable', type: 'string' }
        ],
        localdata: []
      };

      let detailColumn = [
        { text: '', datafield: 'id', width: 100, },
        { text: '', datafield: 'name', width: 100 },
        { text: '', datafield: 'type', width: 100 },
        { text: '', datafield: 'amount', cellsalign: 'right', width: 100 },
        { text: '', datafield: 'discount_id', width: 120 },
        { text: '', datafield: 'discount', width: 90 },
        { text: '', datafield: 'transaction_category', width: 150 },
        { text: '', datafield: 'tariff', width: 150 },
        { text: '', datafield: 'planid', width: 150 },
        { text: '', datafield: 'overrideid', width: 150 },
        { text: '', datafield: 'taxable', width: 150 },
      ];

      for (let list of detailColumn) {
        this.tranService.convertText(list.datafield).subscribe(result => {
          list.text = result;
        });
      }

      let childGridWidth = '';
      let width = 0;
      for (let list of detailColumn) {
        width = width + list.width;
      }
      let contentWidth = document.getElementById('bill-history-content').offsetWidth;

      if (width > contentWidth + 32) {
        childGridWidth = 'calc(100% - 2px)';
      } else {
        childGridWidth = width + 'px';
      }
      detailDataSource.localdata = tempArray;
      const nestedGridAdapter = new jqx.dataAdapter(detailDataSource);

      if (nestedGridContainer != null) {
        const settings = {
          width: 'calc(100% - 2px)',
          height: 150,
          theme: this.globService.themeColor,
          source: nestedGridAdapter,
          columns: detailColumn
        };

        this.childGrid[index] = jqwidgets.createInstance(`#${nestedGridContainer.id}`, 'jqxGrid', settings);
        this.childGrid[index].addEventHandler('rowselect', function (event) {
          downloadIndexI = index;

          selectedFinDoc = event.args.row;
          document.getElementById('clearSelectionChildGrid').click();
        });

      } else {
      }
    }
  }

  pagingParam = {
    SearchString: '',
    SkipRecords: 0,
    TakeRecords: 10,
    CountRecords: 'Y',
    ContactCode: '',
  };
  gridRecords: any = {};

  totalLength: any;
  pageRowNumber: number = 1;
  rowStep: string = '10';
  SkipRecords: number = 0;

  constructor(
    private tranService: TranService,
    
    private loading: LoadingService,
    private transactionService: TransactionHistoryService,
    private cdr: ChangeDetectorRef,
    private dateConvert: ConvertDateFormatService,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    
    this.setGridWidth();
    this.translateText();
  }

  ngOnInit() {
    this.getTransactionHistory();
  }

  clearSelectionChildGrid() {
    for (let i = 0; i < this.groupList.length; i++) {
      if (document.getElementById('transactionHistoryButtons' + i) !== null
        && typeof (document.getElementById('transactionHistoryButtons' + i)) !== 'undefined') {
        if (document.getElementById('transactionHistoryButtons' + i).classList.contains('disable-item')) {
        } else {
          document.getElementById('transactionHistoryButtons' + i).classList.add('disable-item');
        }
      }
      if (document.getElementById('transactionHistoryDetail' + i) !== null
        && typeof (document.getElementById('transactionHistoryDetail' + i)) !== 'undefined') {
        if (document.getElementById('transactionHistoryDetail' + i).classList.contains('disable-item')) {
        } else {
          document.getElementById('transactionHistoryDetail' + i).classList.add('disable-item');
        }
      }
      if (document.getElementById('transactionHistoryServices' + i) !== null
        && typeof (document.getElementById('transactionHistoryServices' + i)) !== 'undefined') {
        if (document.getElementById('transactionHistoryServices' + i).classList.contains('disable-item')) {
        } else {
          document.getElementById('transactionHistoryServices' + i).classList.add('disable-item');
        }
      }
      if (document.getElementById('transactionHistoryTransactions' + i) !== null
        && typeof (document.getElementById('transactionHistoryTransactions' + i)) !== 'undefined') {
        if (document.getElementById('transactionHistoryTransactions' + i).classList.contains('disable-item')) {
        } else {
          document.getElementById('transactionHistoryTransactions' + i).classList.add('disable-item');
        }
      }
      if (document.getElementById('transctionHistoryCharges' + i) !== null
        && typeof (document.getElementById('transctionHistoryCharges' + i)) !== 'undefined') {
        if (document.getElementById('transctionHistoryCharges' + i).classList.contains('disable-item')) {
        } else {
          document.getElementById('transctionHistoryCharges' + i).classList.add('disable-item');
        }
      }
    }
    document.getElementById('transactionHistoryButtons' + downloadIndexI).classList.remove('disable-item');
    document.getElementById('transactionHistoryDetail' + downloadIndexI).classList.remove('disable-item');
    document.getElementById('transactionHistoryServices' + downloadIndexI).classList.remove('disable-item');
    document.getElementById('transactionHistoryTransactions' + downloadIndexI).classList.remove('disable-item');
    document.getElementById('transctionHistoryCharges' + downloadIndexI).classList.remove('disable-item');

    this.childGrid.map(gridObj => {
      gridObj.clearselection();
    });
  }

  refreshGrid() {
    this.pagingParam.SkipRecords = 0;
    this.pagingParam.TakeRecords = 10;
    this.pageRowNumber = 1;
    this.rowStep = '10';
    this.globService.globSubject.next('refresh-grid');
    this.getTransactionHistory();
  }

  translateText() {
    for (let list of this.columns) {
      this.tranService.convertText(list.datafield).subscribe(result => {
        list.text = result;
      });
    }

    this.tranService.convertText('download').subscribe(result => {
      this.downloadStr = result;
    });

    this.tranService.convertText('detail').subscribe(result => {
      this.detailStr = result;
    });

    this.tranService.convertText('services').subscribe(result => {
      this.servicesStr = result;
    });

    this.tranService.convertText('transactions').subscribe(result => {
      this.tranStr = result;
    });

    this.tranService.convertText('charges').subscribe(result => {
      this.chargeStr = result;
    });
  }

  downloadButtonBill() {
    if (selectedFinDoc !== null && typeof (selectedFinDoc) !== 'undefined') {
    }
  }

  searchInputEvent(event) {
    if (event.keyCode === 13) {
      this.pagingParam.SearchString = event.target.value;

      this.pagingParam.SkipRecords = 0;
      this.pagingParam.TakeRecords = 10;
      this.pageRowNumber = 1;
      this.rowStep = '10';
      this.SkipRecords = 0;
      this.getTransactionHistory();
    }
  }

  async getTransactionHistory() {
    this.groupList = [];
    await this.loading.present();
    this.transactionService.getTransactions(this.pagingParam, this.BillId).subscribe(async (result: Transactions[]) => {
      
      await this.loading.dismiss();
      if (result === null) {
        this.tranService.errorMessage('no_payment_history');
      } else {
        for (let list of result) {
          this.groupList.push(list);
          this.groupList.push(list);
        }
        this.totalLength = result.length;

        for (let i = 0; i < this.groupList.length; i++) {
          this.groupList[i].TransactionComponents.push(result[0].TransactionComponents[0]);
          this.groupList[i].TransactionComponents.push(result[0].TransactionComponents[0]);
        }
        this.setGridData();
      }
    }, async (error: any) => {
      
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  getWidth() {
    return Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.documentElement.clientWidth
    );
  }

  selectRow() {
    this.selectIndex = this.TransactionHistoryGrid.getselectedrowindex();
    this.selectedData = this.TransactionHistoryGrid.getrowdata(this.selectIndex);
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
      this.gridWidth = this.gridWidth + this.columns[i].width;
    }
    this.gridWidth = this.gridWidth + 30;
  }

  exportData() {
    this.TransactionHistoryGrid.exportview('xlsx', 'Transaction History');
  }

  setGridData() {

    for (const list of this.groupList) {
      const tempData = {
        id: list.Id,
        servicenumber: list.ServiceNumber,
        startdatetime: list.StartDateTime,
        bparty: list.BParty,
        bpartydescription: list.BPartyDescription,
        duration: list.Duration,
        unitquantity: list.UnitQuantity,
        unitofmeasure: list.UnitOfMeasure,
        price: this.globService.getCurrencyConfiguration(list.Price),
        tax: this.globService.getCurrencyConfiguration(list.Tax),
        nondiscountedprice: this.globService.getCurrencyConfiguration(list.NonDiscountedPrice),
        undiscountedpricetaxex: this.globService.getCurrencyConfiguration(list.NonDiscountedTax),
        cost: this.globService.getCurrencyConfiguration(list.Cost),
        costtax: this.globService.getCurrencyConfiguration(list.CostTax),
        usagegroup: list.UsageGroup,
        usagegroupcode: list.UsageGroupCode,
        usagegrouporder: list.UsageGroupOrder,
        ratebanddescription: list.RateBandDescription,
        tariffcode: list.TariffCode,
        tariff: list.Tariff,
        origin: list.Origin,
        thirdparty: list.ThirdParty,
        band1rateunit: list.Band1RateUnit,
        taxfree: list.TaxFree,
        servicenarrative: list.ServiceNarrative,
        servicereference: list.TransactionComponents,
      };
      this.source.localdata.push(tempData);
    }

    this.TransactionHistoryGrid.updatebounddata();
    this.source.localdata.length = 0;
  }

  goBack() {
    this.TransactionHistoryComponent.emit('close');
  }

  outPagingComponent(event) {
    this.pagingParam.SkipRecords = event.SkipRecords;
    this.pagingParam.TakeRecords = event.TakeRecords;

    this.pageRowNumber = event.pageRowNumber;
    this.rowStep = event.rowStep;
    this.SkipRecords = event.SkipRecords;

    this.getTransactionHistory();
  }

}
