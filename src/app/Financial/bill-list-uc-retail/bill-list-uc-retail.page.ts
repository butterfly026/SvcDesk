import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ChangeDetectorRef, AfterContentChecked } from '@angular/core';

import { LoadingService, ToastService, TranService } from 'src/services';
import { BillListUCRetailService } from './services/bill-list-uc-retail.service';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { BillListUCRetail } from 'src/app/model';

import * as $ from 'jquery';


import * as moment from 'moment';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { ConvertDateFormatService } from 'src/services/convert-dateformat.service';
import { GlobalService } from 'src/services/global-service.service';

const rendererPDF = function (id) {
  if (localStorage.getItem('set_lng') === 'en') {
    // return '<input type="button" onClick="buttonclick(event)" class="gridButton" id="btn' + id + '" value="Delete Row"/>'
    return '<ion-button mode="ios" class="gridButton margin-auto" id="down_pdf' + id
      + '">' + 'Download PDF' + '</ion-button>';
  } else {
    // return '<input type="button" onClick="buttonclick(event)" class="gridButton" id="btn' + id + '" value="Delete Row"/>'
    return '<ion-button mode="ios" class="gridButton margin-auto" id="down_pdf' + id
      + '">' + 'Скачать PDF' + '</ion-button>';
  }
}

const rendererExcel = function (id) {
  if (localStorage.getItem('set_lng') === 'en') {
    // return '<input type="button" onClick="buttonclick(event)" class="gridButton" id="btn' + id + '" value="Delete Row"/>'
    return '<ion-button mode="ios" class="gridButton margin-auto" id="down_excel' + id
      + '">' + 'Download Excel' + '</ion-button>';
  } else {
    // return '<input type="button" onClick="buttonclick(event)" class="gridButton" id="btn' + id + '" value="Delete Row"/>'
    return '<ion-button mode="ios" class="gridButton margin-auto" id="down_excel' + id
      + '">' + 'Скачать Excel' + '</ion-button>';
  }
}

@Component({
  selector: 'app-bill-list-uc-retail',
  templateUrl: './bill-list-uc-retail.page.html',
  styleUrls: ['./bill-list-uc-retail.page.scss'],
})


export class BillListUcRetailPage implements OnInit {

  @Input() ContactCode: string = '';
  @Input() pageTitle: string = '';

  @Output('setComponentValue') public componentValue: EventEmitter<string> = new EventEmitter<string>();


  @ViewChild('billListUCRetail') billListUCRetail: jqxGridComponent;
  @ViewChild('dataGrid') dataGrid: jqxGridComponent;

  selectIndex: number;
  selectedData: any;
  gridWidth: any;
  gridContentWidth = '';

  billUCList: Array<BillListUCRetail> = [];

  source = {
    localdata: [],
    datafields: [
      { name: 'number', type: 'string', },
      { name: 'date', type: 'string', },
      { name: 'due_date', type: 'string', },
      { name: 'balance', type: 'string', },
      { name: 'new_charges', type: 'string', },
      { name: 'over_due', type: 'string', },
      { name: 'download_pdf', type: 'button', },
      { name: 'download_excel', type: 'button', },
    ],
    datatype: 'array'
  };
  sourceExport = {
    localdata: [],
    datafields: [
      { name: 'number', type: 'string', },
      { name: 'date', type: 'string', },
      { name: 'due_date', type: 'string', },
      { name: 'balance', type: 'string', },
      { name: 'new_charges', type: 'string', },
      { name: 'over_due', type: 'string', },
    ],
    datatype: 'array'
  };

  dataAdapter: any = new jqx.dataAdapter(this.source);
  exportDataAdapter: any = new jqx.dataAdapter(this.sourceExport);

  columns = [
    { text: '', datafield: 'number', width: 80 },
    { text: '', datafield: 'date', width: 130 },
    { text: '', datafield: 'due_date', width: 150 },
    { text: '', datafield: 'balance', cellsalign: 'right', width: 100 },
    { text: '', datafield: 'new_charges', cellsalign: 'right', width: 130 },
    { text: '', datafield: 'over_due', width: 100 },
    { text: '', datafield: 'download_pdf', cellsalign: 'right', width: 180, cellsrenderer: rendererPDF },
    { text: '', datafield: 'download_excel', cellsalign: 'right', width: 180, cellsrenderer: rendererExcel }
  ];

  columnsExport = [
    { text: '', datafield: 'number', width: 80 },
    { text: '', datafield: 'date', width: 130 },
    { text: '', datafield: 'due_date', width: 150 },
    { text: '', datafield: 'balance', cellsalign: 'right', width: 100 },
    { text: '', datafield: 'new_charges', cellsalign: 'right', width: 130 },
    { text: '', datafield: 'over_due', width: 100 },
  ];

  

  downPDFForm: UntypedFormGroup;
  downExcelForm: UntypedFormGroup;

  constructor(
    
    private loading: LoadingService,
    private toast: ToastService,
    private bLURService: BillListUCRetailService,
    private tranService: TranService,
    private cdr: ChangeDetectorRef,
    private formBuilder: UntypedFormBuilder,
    private dateConvert: ConvertDateFormatService,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    
    this.setGridWidth();

    for (let i = 0; i < this.columns.length; i++) {
      this.tranService.convertText(this.columns[i].datafield).subscribe(value => {
        this.columns[i].text = value;
      });
    }

    for (let i = 0; i < this.columnsExport.length; i++) {
      this.tranService.convertText(this.columnsExport[i].datafield).subscribe(value => {
        this.columnsExport[i].text = value;
      });
    }

    this.downPDFForm = this.formBuilder.group({
      noRequire: ['']
    });

    this.downExcelForm = this.formBuilder.group({
      noRequire: ['']
    });

  }

  async ngOnInit() {
    await this.loading.present();
    this.bLURService.getBillListUC(this.ContactCode).subscribe(async (result: BillListUCRetail[]) => {
      
      await this.loading.dismiss();
      this.billUCList = result;
      this.setGridData();
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  downloadPDF() {
    this.setGridToDownload(this.selectedData);
  }

  setGridToDownload(selectedData) {

    const tempData = [
      selectedData.number, selectedData.date, selectedData.due_date,
      this.globService.getCurrencyConfiguration(selectedData.balance), this.globService.getCurrencyConfiguration(selectedData.new_charges), selectedData.over_due
    ];
    this.sourceExport.localdata.push(tempData);

    this.dataGrid.updatebounddata();

    this.sourceExport.localdata.length = 0;

    this.dataGrid.exportdata('pdf', 'BillData');
  }

  downloadExcel() {
    this.setGridToDownloadExcel(this.selectedData);
  }

  setGridToDownloadExcel(selectedData) {

    const tempData = [
      selectedData.number, selectedData.date, selectedData.due_date,
      this.globService.getCurrencyConfiguration(selectedData.balance), this.globService.getCurrencyConfiguration(selectedData.new_charges), selectedData.over_due
    ];
    this.sourceExport.localdata.push(tempData);

    this.dataGrid.updatebounddata();

    this.sourceExport.localdata.length = 0;

    this.dataGrid.exportview('xlsx', 'Bill Data');
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
    this.selectIndex = this.billListUCRetail.getselectedrowindex();
    this.selectedData = this.billListUCRetail.getrowdata(this.selectIndex);
    if (typeof (this.selectedData) !== 'undefined') {
      const clickedId = 'down_pdf' + this.selectedData.uid;
      $('body').on('click', '#' + clickedId, function (e) {
        e.preventDefault();
        document.getElementById('downloadPDF').click();
        return false;
      });
      const clickedIdExcel = 'down_excel' + this.selectedData.uid;
      $('body').on('click', '#' + clickedIdExcel, function (e) {
        e.preventDefault();
        document.getElementById('downloadExcel').click();
        return false;
      });
    }
  }

  exportData() {
    this.billListUCRetail.exportview('xlsx', 'Bill List UC Retail');
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
      return '100%';
    }
  }

  getGridWidth() {
    this.gridWidth = 0;
    for (let i = 0; i < this.columns.length; i++) {
      this.gridWidth = this.gridWidth + this.columns[i].width;
    }
  }

  setGridData() {
    for (const list of this.billUCList) {
      const tempData = {
        number: list.Number,
        date: list.Date,
        due_date: list.DueDate,
        balance: list.Balance,
        new_charges: list.NewCharges,
        over_due: list.OverDue,
      };
      this.source.localdata.push(tempData);
    }

    this.billListUCRetail.updatebounddata();

    this.source.localdata.length = 0;
  }

}
