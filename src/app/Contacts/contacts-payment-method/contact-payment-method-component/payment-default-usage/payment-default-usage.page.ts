import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DefaultUsageHistory, StatusHistory } from 'src/app/model';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { Router } from '@angular/router';
import { TranService, LoadingService } from 'src/services';

import { ConvertDateFormatService } from 'src/services/convert-dateformat.service';
import * as moment from 'moment';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-payment-default-usage',
  templateUrl: './payment-default-usage.page.html',
  styleUrls: ['./payment-default-usage.page.scss'],
})
export class PaymentDefaultUsagePage implements OnInit {

  @Input() ContactCode: string = '';
  @Input() DefaultUsageHistoryList: Array<DefaultUsageHistory> = [];

  @Output('PaymentDefaultHistoryComponent') PaymentDefaultHistoryComponent: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('PaymentDefaultUsageHistoryGrid') PaymentDefaultUsageHistoryGrid: jqxGridComponent;

  
  groupList: Array<DefaultUsageHistory> = [];


  selectIndex: number;
  selectedData: any;
  gridWidth: any;
  gridContentWidth = '';

  gridWidth2: any;
  gridContentWidth2 = '';

  source = {
    localdata: [],
    datafields: [
      { name: 'id', type: 'string', map: '0' },
      { name: 'from_date_time', type: 'string', map: '1' },
      { name: 'to_date_time', type: 'string', map: '2' },
    ],
    datatype: 'array'
  };

  dataAdapter: any = new jqx.dataAdapter(this.source);

  columns = [
    { text: '', datafield: 'id', width: 100 },
    { text: '', datafield: 'from_date_time', width: 200 },
    { text: '', datafield: 'to_date_time', width: 200 },
  ];

  constructor(
    private router: Router,
    private tranService: TranService,
    private loading: LoadingService,
    
    private cdr: ChangeDetectorRef,
    private dateService: ConvertDateFormatService,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    

    this.setGridWidth();
    for (let list of this.columns) {
      this.tranService.convertText(list.datafield).subscribe(result => {
        list.text = result;
      });
    }
  }

  ngOnInit() {
    this.getOrderList();
  }

  getOrderList() {
    this.groupList = []
    this.groupList = this.DefaultUsageHistoryList;
  }

  goBack() {
    this.PaymentDefaultHistoryComponent.emit('close');
  }

  getWidth() {
    let element = document.getElementById('paymentMethodDefaultHistory');
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
      this.gridWidth = this.gridWidth + this.columns[i].width;
    }
  }

  exportData() {
    this.PaymentDefaultUsageHistoryGrid.exportview('xlsx', 'Address Management History');
  }

  setGridData() {

    for (const list of this.groupList) {
      let tempData = [];
      tempData = [
        list.id, this.globService.newDateFormat(list.from), this.globService.newDateFormat(list.to),
      ];
      this.source.localdata.push(tempData);
    }

    this.PaymentDefaultUsageHistoryGrid.updatebounddata();
    this.source.localdata.length = 0;
  }

}
