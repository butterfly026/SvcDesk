import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef } from '@angular/core';
import { OrderManagementService } from './services/order-management.service';
import { Router } from '@angular/router';
import { TranService, LoadingService } from 'src/services';

import { OrderManagement } from 'src/app/model';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';

import * as moment from 'moment';
import { ConvertDateFormatService } from 'src/services/convert-dateformat.service';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.page.html',
  styleUrls: ['./order-management.page.scss'],
})
export class OrderManagementPage implements OnInit {

  @Input() ContactCode: string = '';
  @Output('OrderManagementComponent') OrderManagementComponent: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('OrderManagementGrid') OrderManagementGrid: jqxGridComponent;

  
  groupList: Array<OrderManagement> = [];


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
      { name: 'order_number', type: 'string', map: '0' },
      { name: 'customer_name', type: 'string', map: '1' },
      { name: 'date', type: 'string', map: '2' },
      { name: 'status', type: 'string', map: '3' },
    ],
    datatype: 'array'
  };

  dataAdapter: any = new jqx.dataAdapter(this.source);

  columns = [
    { text: '', datafield: 'order_number', width: 110 },
    { text: '', datafield: 'customer_name', width: 200 },
    { text: '', datafield: 'date', width: 150 },
    { text: '', datafield: 'status', width: 80 }
  ];

  constructor(
    private router: Router,
    private tranService: TranService,
    private loading: LoadingService,
    
    private oeService: OrderManagementService,
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

  async getOrderList() {
    await this.loading.present();
    let reqParam = {
      ContactCode: this.ContactCode,
      SkipRecords: this.SkipRecords,
      TakeRecords: this.TakeRecords
    }
    this.oeService.getOrderList(reqParam).subscribe(async (result: OrderManagement[]) => {
      
      await this.loading.dismiss();
      if (result === null) {
        this.tranService.errorMessage('no_order_management');
      } else {
        this.groupList = result;
        this.totalLength = this.groupList.length;
        this.setGridData();
      }
    })
  }

  goBack() {
    this.OrderManagementComponent.emit('close');
  }

  getWidth() {
    let element = document.getElementById('orderManagementGrid');
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
    this.OrderManagementGrid.exportview('xlsx', 'Order Management History');
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
        list.OrderNumber, list.CustomerName, this.globService.newDateFormat(new Date(list.Date)), list.Status
      ];
      this.source.localdata.push(tempData);
    }

    this.OrderManagementGrid.updatebounddata();
    this.source.localdata.length = 0;
  }



  reduceList() {
    if (this.startIndex - parseInt(this.rowStep, 10) > -1) {
      this.startIndex = this.startIndex - parseInt(this.rowStep, 10);
    } else {
      this.startIndex = 0;
    }
    if (this.pageRowNumber > 0) {
      this.pageRowNumber = this.pageRowNumber - 1;
      this.getOrderList();
    }
  }

  increaseList() {
    if (this.startIndex + parseInt(this.rowStep, 10) < this.totalLength) {
      this.startIndex = this.startIndex + parseInt(this.rowStep, 10);
    } else {
    }
    this.pageRowNumber = this.pageRowNumber + 1;
    this.getOrderList();
  }

  changePageNumber(event: any) {
    if (this.pageRowNumber < 1) {
      if (event != null && typeof (event.srcElement) !== 'undefined') {
        event.srcElement.value = 1;
        this.pageRowNumber = 1;
      }
    }
    if (this.pageRowNumber > this.maxPageRow) {
      if (event != null && typeof (event.srcElement) !== 'undefined') {
        event.srcElement.value = this.maxPageRow;
        this.pageRowNumber = this.maxPageRow;
      }
    }

    this.startIndex = (this.pageRowNumber - 1) * parseInt(this.rowStep, 10);
    if (event.key === 'Enter') {
      this.keyPress = true;
      this.getOrderList();
    }
  }

  focusChangePage() {

  }

  focusOutChangePage() {
    if (!this.keyPress) {
      this.startIndex = (this.pageRowNumber - 1) * parseInt(this.rowStep, 10);
      this.getOrderList();
    }
  }

  changeRowStep() {
    this.startIndex = 0;
    this.pageRowNumber = 1;
    this.getOrderList();
  }

}
