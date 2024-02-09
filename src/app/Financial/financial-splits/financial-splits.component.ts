import { AfterViewChecked, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { FinancialTransactionDetailService } from '../financial-transaction-detail/services/financial-transaction-detail.service';

@Component({
  selector: 'app-financial-splits',
  templateUrl: './financial-splits.component.html',
  styleUrls: ['./financial-splits.component.scss'],
})
export class FinancialSplitsComponent implements OnInit {
  @Input() FinancialId: string = '';

  @ViewChild('splitsGrid') splitsGrid: jqxGridComponent;

  gridWidth: any;
  gridContentWidth = '';
  selectedData: any;

  source = {
    localdata: [],
    datafields: [
      { name: 'id', type: 'string', },
      { name: 'split_direction', type: 'string', },
      { name: 'other_transaction_id', type: 'string', },
      { name: 'number', type: 'string', },
      { name: 'type', type: 'string', },
      { name: 'date', type: 'string', },
      { name: 'amount', type: 'string', },
      { name: 'refund_id', type: 'string', },
      { name: 'refund_number', type: 'string', },
      { name: 'refund_date', type: 'string', },
      { name: 'refund_amount', type: 'string', },
      { name: 'lastupdated', type: 'string', },
      { name: 'updatedby', type: 'string', },
    ],
    datatype: 'array'
  };

  dataAdapter: any = new jqx.dataAdapter(this.source);

  columns = [
    { text: '', datafield: 'id', width: 60 },
    { text: '', datafield: 'split_direction', width: 70 },
    { text: '', datafield: 'other_transaction_id', width: 90 },
    { text: '', datafield: 'number', width: 150 },
    { text: '', datafield: 'type', width: 150 },
    { text: '', datafield: 'date', width: 150 },
    { text: '', datafield: 'amount', cellsalign: 'right', width: 80 },
    { text: '', datafield: 'refund_id', width: 150 },
    { text: '', datafield: 'refund_number', width: 150 },
    { text: '', datafield: 'refund_date', width: 150 },
    { text: '', datafield: 'refund_amount', cellsalign: 'right', width: 100 },
    { text: '', datafield: 'lastupdated', width: 150 },
    { text: '', datafield: 'updatedby', width: 150 },
  ];
  gridRecords: any = {};
  
  groupList: any[] = [];

  constructor(
    private tranService: TranService,
    
    private cdr: ChangeDetectorRef,
    public globService: GlobalService,
    private fnService: FinancialTransactionDetailService,
    private loading: LoadingService,
  ) {
    
    for (let i = 0; i < this.columns.length; i++) {
      this.tranService.convertText(this.columns[i].datafield).subscribe(value => {
        this.columns[i].text = value;
      });
    }
  }

  async ngOnInit() {
    await this.loading.present();
    this.groupList = [];
    this.fnService.FinantialTransactionsById(this.FinancialId).subscribe(async (result: any) => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.groupList = convResult.splits;
      this.setGridData();
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
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

  exportData() {
    this.splitsGrid.exportview('xlsx', 'Finantial Splits');
  }

  getWidth() {
    let element = document.getElementById('splits-grid');
    if (typeof (element) !== 'undefined' && element !== null) {
      return element.offsetWidth;
    } else {
      return 900;
    }
  }

  setGridData() {

    for (const list of this.groupList) {
      const tempData = {
        id: list.id,
        split_direction: list.splitdirection,
        other_transaction_id: list.othertransactionid,
        number: list.number,
        type: list.type,
        date: list.date,
        amount: this.globService.getCurrencyConfiguration(list.amount),
        refund_id: list.refundid,
        refund_number: list.refundnumber,
        refund_date: list.refunddate,
        refund_amount: this.globService.getCurrencyConfiguration(list.refundamount),
        lastupdated: list.lastupdated,
        updatedby: list.updatedby,
      };
      this.source.localdata.push(tempData);
    }

    this.splitsGrid.updatebounddata();
    this.source.localdata.length = 0;

    this.gridRecords = this.splitsGrid.attrSource;
    this.setGridColumnWidth(this.gridRecords.records);
  }

  setGridColumnWidth(list) {
    let columnsMaxWidth = {
      id: 0,
      split_direction: 0,
      other_transaction_id: 0,
      number: 0,
      type: 0,
      date: 0,
      amount: 0,
      refund_id: 0,
      refund_number: 0,
      refund_date: 0,
      refund_amount: 0,
      lastupdated: 0,
      updatedby: 0,
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
          this.splitsGrid.setcolumnproperty(list.datafield, "width", result.length * 8 + 10);
        } else {
          this.splitsGrid.setcolumnproperty(list.datafield, "width", columnsMaxWidth[list.datafield] * 8 + 10);
        }
      });
    }
  }
}
