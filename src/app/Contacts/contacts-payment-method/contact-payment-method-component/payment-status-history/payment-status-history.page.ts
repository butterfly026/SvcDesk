import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { StatusHistory, OrderManagement } from 'src/app/model';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { Router } from '@angular/router';
import { TranService, LoadingService } from 'src/services';

import { ConvertDateFormatService } from 'src/services/convert-dateformat.service';

import * as moment from 'moment';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-payment-status-history',
  templateUrl: './payment-status-history.page.html',
  styleUrls: ['./payment-status-history.page.scss'],
})
export class PaymentStatusHistoryPage implements OnInit {

  @Input() ContactCode: string = '';
  @Input() StatusHistoryList: Array<StatusHistory> = [];

  @Output('PaymentStatusHistoryComponent') PaymentStatusHistoryComponent: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('PaymentStatusHistoryGrid') PaymentStatusHistoryGrid: jqxGridComponent;

  
  groupList = [];


  selectIndex: number;
  selectedData: any;
  gridWidth: any;
  gridContentWidth = '';

  gridWidth2: any;
  gridContentWidth2 = '';

  rowList = ['10', '20', '50', '100'];
  maxPageRow: any;
  rowStep = '10';

  backSymbol = '⮜';
  forwardSymbol = '⮞';
  pageRowNumber = 1;


  SkipRecords = 0;
  TakeRecords = 10;
  stepCount = 1;
  pageNumber = 1;

  startIndex = 0;
  endIndex: number;
  totalLength: number;
  keyPress: boolean = false;

  source = {
    localdata: [],
    datafields: [
      { name: 'status', type: 'string', map: '0' },
      { name: 'from_date_time', type: 'string', map: '1' },
      { name: 'to_date_time', type: 'string', map: '2' },
      { name: 'note', type: 'string', map: '3' },
      { name: 'created_by', type: 'string', map: '4' },
      { name: 'created_date_time', type: 'string', map: '5' },
    ],
    datatype: 'array'
  };

  dataAdapter: any = new jqx.dataAdapter(this.source);

  columns = [
    { text: '', datafield: 'status', width: 100 },
    { text: '', datafield: 'from_date_time', width: 200 },
    { text: '', datafield: 'to_date_time', width: 200 },
    { text: '', datafield: 'note', width: 150 },
    { text: '', datafield: 'created_by', width: 120 },
    { text: '', datafield: 'created_date_time', width: 220 }
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
    this.groupList = this.StatusHistoryList;
  }

  goBack() {
    this.PaymentStatusHistoryComponent.emit('close');
  }

  getWidth() {
    let element = document.getElementById('paymentMethodStatusHistory');
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
    this.PaymentStatusHistoryGrid.exportview('xlsx', 'Address Management History');
  }

  setGridData() {

    if (this.totalLength % parseInt(this.rowStep, 10) === 0) {
      this.maxPageRow = this.totalLength / parseInt(this.rowStep, 10);
    } else {
      this.maxPageRow = Math.floor(this.totalLength / parseInt(this.rowStep, 10)) + 1;
    }

    this.endIndex = this.startIndex + parseInt(this.rowStep, 10);
    if (this.totalLength > 0) {
      if (this.startIndex > -1) {
        if (this.endIndex < this.totalLength) {
        } else {
          this.endIndex = this.totalLength;
        }
      }
    }

    for (const list of this.groupList) {
      let tempData = [];
      tempData = [
        list.status, this.globService.newDateFormat(list.from), this.globService.newDateFormat(list.to), list.note,
        list.createdby, this.globService.newDateFormat(list.created)
      ];
      this.source.localdata.push(tempData);
    }

    this.PaymentStatusHistoryGrid.updatebounddata();
    this.source.localdata.length = 0;
  }

}
