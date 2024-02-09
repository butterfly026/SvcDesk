import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ReceiptDetailService } from './services/receipt-detail.service';
import { NavController } from '@ionic/angular';
import { TranService, LoadingService, ToastService } from 'src/services';

import { AllocationItem, ErrorItems, DistributionItem, SplitItem } from 'src/app/model';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { ReceiptItem } from 'src/app/model/ReceiptItem/ReceiptItem';
import { EventListItem } from 'src/app/model/EventListItem/EventListItem';
import { BulkItem } from 'src/app/model';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-receipt-detail',
  templateUrl: './receipt-detail.page.html',
  styleUrls: ['./receipt-detail.page.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: navigator.language },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class ReceiptDetailPage implements OnInit {
  @ViewChild('myGridAll') myGridAll: jqxGridComponent;
  @ViewChild('myGridDis') myGridDis: jqxGridComponent;
  @ViewChild('myGridEnt') myGridEnt: jqxGridComponent;
  @ViewChild('myGridSplit') myGridSplit: jqxGridComponent;
  @ViewChild('myGridBulk') myGridBulk: jqxGridComponent;


  allocationList: Array<AllocationItem> = [];
  paymentList: ReceiptItem;
  disList: Array<DistributionItem> = [];
  entlist: Array<EventListItem> = [];
  splitList: Array<SplitItem> = [];
  bulkList: Array<BulkItem> = [];

  pageTitle: string = '';
  selectedIndex: number = 0;
  

  receiptDetailList: Array<string> = ['Receipt Detail 1', 'Receipt Detail 2', 'Receipt Detail 3', 'Receipt Detail 4']
  selectedReceipt: string = '';
  splitAmount: number = 100000;
  splitAmountStr: string = '';
  currentLng: string = '';
  splitState: string = '';

  minDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());
  maxDate = new Date(2100, 12, 31);
  bulkDate: Date;
  addBulkForm: UntypedFormGroup;
  bulkState: string = '';
  addSplitForm: UntypedFormGroup;


  selectIndex: number;
  selectedData: any;
  gridWidth: any;
  gridContentWidth = '';

  source = {
    localdata: [],
    datafields: [
      { name: 'type', type: 'string', },
      { name: 'name', type: 'string', },
      { name: 'number', type: 'string', },
      { name: 'bsb_exp_date', type: 'string', },
      { name: 'cheque_transaction_no', type: 'string', },
      { name: 'status', type: 'string', },
      { name: 'gl_account', type: 'string', },
      { name: 'type_code', type: 'string', }
    ],
    datatype: 'array'
  };

  dataAdapter: any = new jqx.dataAdapter(this.source);

  columns = [
    { text: '', datafield: 'type', width: 80 },
    { text: '', datafield: 'name', width: 180 },
    { text: '', datafield: 'number', width: 100 },
    { text: '', datafield: 'bsb_exp_date', width: 130 },
    { text: '', datafield: 'cheque_transaction_no', width: 180 },
    { text: '', datafield: 'status', width: 100 },
    { text: '', datafield: 'gl_account', width: 80 },
    { text: '', datafield: 'type_code', width: 100 }
  ];

  sourceAll = {
    localdata: [],
    datafields: [
      { name: 'amount', type: 'string', },
      { name: 'fin_number', type: 'string', },
      { name: 'bill_number', type: 'string', },
      { name: 'open', type: 'string', },
      { name: 'total', type: 'string', },
      { name: 'tax', type: 'string', },
      { name: 'type', type: 'string', },
      { name: 'date', type: 'string', }
    ],
    datatype: 'array'
  };

  dataAdapterAll: any = new jqx.dataAdapter(this.sourceAll);

  columnsAll = [
    { text: '', datafield: 'amount', cellsalign: 'right', width: 80 },
    { text: '', datafield: 'fin_number', width: 100 },
    { text: '', datafield: 'bill_number', width: 100 },
    { text: '', datafield: 'open', cellsalign: 'right', width: 80 },
    { text: '', datafield: 'total', cellsalign: 'right', width: 80 },
    { text: '', datafield: 'tax', cellsalign: 'right', width: 80 },
    { text: '', datafield: 'type', width: 80 },
    { text: '', datafield: 'date', width: 100 }
  ];

  sourceDis = {
    localdata: [],
    datafields: [
      { name: 'gl_code', type: 'string', },
      { name: 'gl_account', type: 'string', },
      { name: 'period', type: 'string', },
      { name: 'amount', type: 'string', },
      { name: 'tax', type: 'string', },
      { name: 'type', type: 'string', },
      { name: 'start_date', type: 'string', },
      { name: 'end_date', type: 'string', },
      { name: 'comment', type: 'string', },
      { name: 'ref', type: 'string', },
      { name: 'service', type: 'string', },
      { name: 'last_exported_date', type: 'string', },
      { name: 'created', type: 'string', },
      { name: 'created_by', type: 'string', },
      { name: 'lastupdated', type: 'string', },
      { name: 'updatedby', type: 'string', },
      { name: 'control', type: 'string', }
    ],
    datatype: 'array'
  };

  dataAdapterDis: any = new jqx.dataAdapter(this.sourceAll);

  columnsDis = [
    { text: '', datafield: 'gl_code', width: 80 },
    { text: '', datafield: 'gl_account', width: 100 },
    { text: '', datafield: 'period', width: 100 },
    { text: '', datafield: 'amount', width: 80 },
    { text: '', datafield: 'tax', width: 80 },
    { text: '', datafield: 'type', width: 80 },
    { text: '', datafield: 'start_date', width: 80 },
    { text: '', datafield: 'end_date', width: 100 },
    { text: '', datafield: 'comment', width: 100 },
    { text: '', datafield: 'ref', width: 80 },
    { text: '', datafield: 'service', width: 80 },
    { text: '', datafield: 'last_exported_date', width: 80 },
    { text: '', datafield: 'created', width: 80 },
    { text: '', datafield: 'created_by', width: 100 },
    { text: '', datafield: 'lastupdated', width: 80 },
    { text: '', datafield: 'updatedby', width: 100 },
    { text: '', datafield: 'control', width: 100 }
  ];

  sourceEnt = {
    localdata: [],
    datafields: [
      { name: 'description', type: 'strint', },
      { name: 'created_date_time', type: 'string', },
      { name: 'creator_name', type: 'string', },
      { name: 'reason', type: 'string', },
      { name: 'notes', type: 'string', },
      { name: 'document', type: 'string', }
    ],
    datatype: 'array'
  };

  dataAdapterEnt: any = new jqx.dataAdapter(this.sourceAll);

  columnsEnt = [
    { text: '', datafield: 'description', width: 100 },
    { text: '', datafield: 'created_date_time', width: 135 },
    { text: '', datafield: 'creator_name', width: 110 },
    { text: '', datafield: 'reason', width: 80 },
    { text: '', datafield: 'notes', width: 80 },
    { text: '', datafield: 'document', width: 80 }
  ];

  sourceSplit = {
    localdata: [],
    datafields: [
      { name: 'date', type: 'strint', },
      { name: 'amount', type: 'string', },
      { name: 'status', type: 'string', },
      { name: 'account', type: 'string', },
      { name: 'account_name', type: 'string', },
      { name: 'refund', type: 'string', },
      { name: 'refund_status', type: 'string', },
      { name: 'lastupdated', type: 'string', },
      { name: 'updatedby', type: 'string', }
    ],
    datatype: 'array'
  };

  dataAdapterSplit: any = new jqx.dataAdapter(this.sourceAll);

  columnsSplit = [
    { text: '', datafield: 'date', width: 80 },
    { text: '', datafield: 'amount', width: 80 },
    { text: '', datafield: 'status', width: 80 },
    { text: '', datafield: 'account', width: 80 },
    { text: '', datafield: 'account_name', width: 120 },
    { text: '', datafield: 'refund', width: 80 },
    { text: '', datafield: 'refund_status', width: 110 },
    { text: '', datafield: 'lastupdated', width: 120 },
    { text: '', datafield: 'updatedby', width: 100 }
  ];

  sourceBulk = {
    localdata: [],
    datafields: [
      { name: 'account_number', type: 'strint', },
      { name: 'bill_number', type: 'string', },
      { name: 'split_amount', type: 'string', },
      { name: 'error', type: 'string', },
      { name: 'account_name', type: 'string', },
      { name: 'invoice_ref', type: 'string', }
    ],
    datatype: 'array'
  };

  dataAdapterBulk: any = new jqx.dataAdapter(this.sourceAll);

  columnsBulk = [
    { text: '', datafield: 'account_number', width: 120 },
    { text: '', datafield: 'bill_number', width: 120 },
    { text: '', datafield: 'split_amount', width: 120 },
    { text: '', datafield: 'error', width: 100 },
    { text: '', datafield: 'account_name', width: 120 },
    { text: '', datafield: 'invoice_ref', width: 120 }
  ];

  constructor(
    public navCtrl: NavController,
    private tranService: TranService,
    private loading: LoadingService,
    private toast: ToastService,
    private rDService: ReceiptDetailService,
    
    private cdr: ChangeDetectorRef,
    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('receipt_detail').subscribe(value => {
      this.pageTitle = value;
    });
    
    this.setGridWidth();
    this.getPaymentList();
    this.currentLng = localStorage.getItem('set_lng');
    this.bulkDate = this.minDate;
    this.addBulkForm = this.formBuilder.group({
      'code': ['', Validators.required],
      'billNumber': ['', Validators.required],
      'amount': ['', Validators.required]
    });
    this.addSplitForm = this.formBuilder.group({
      'date': ['', Validators.required],
      'amount': ['', Validators.required],
      'code': ['', Validators.required],
      'name': ['', Validators.required]
    })
  }

  ngOnInit() {
    this.splitAmountStr = this.globService.getCurrencyConfiguration(this.splitAmount);
  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  selectTabs(event) {
    this.selectedIndex = event.index;
    if (this.selectedIndex === 0) {
      this.getPaymentList();
    } else if (this.selectedIndex === 1) {
      this.getAllocationList();
    } else if (this.selectedIndex === 2) {
      this.getDisList();
    } else if (this.selectedIndex === 3) {
      this.getEntList();
    } else if (this.selectedIndex === 4) {
      this.getSplitList();
    }
  }

  selectReceipt(index) {
    this.selectedReceipt = this.receiptDetailList[index];
  }

  goBack() {
    this.navCtrl.pop();
  }

  allocationHistory() {

  }

  clearAllocation() {

  }

  setGridData() {
    if (this.selectedIndex === 0) {
    } else if (this.selectedIndex === 1) {
      for (const list of this.allocationList) {
        const tempData = {
          amount: this.globService.getCurrencyConfiguration(list.Amount),
          fin_number: list.FinNumber,
          bill_number: list.BillNumber,
          open: this.globService.getCurrencyConfiguration(list.Open),
          total: this.globService.getCurrencyConfiguration(list.Total),
          tax: this.globService.getCurrencyConfiguration(list.Tax),
          type: list.Type,
          date: list.Date
        };
        this.sourceAll.localdata.push(tempData);
      }

      this.myGridAll.updatebounddata();

      this.sourceAll.localdata.length = 0;
    } else if (this.selectedIndex === 2) {
      for (const list of this.disList) {
        const tempData = {
          gl_code: list.GLCode,
          gl_account: list.GLAccount,
          period: list.Period,
          amount: this.globService.getCurrencyConfiguration(list.Amount),
          tax: this.globService.getCurrencyConfiguration(list.Tax),
          type: list.Type,
          start_date: list.StartDate,
          end_date: list.EndDate,
          comment: list.Comment,
          ref: list.Ref,
          service: list.Service,
          last_exported_date: list.LastExportedDate,
          created: list.Created,
          created_by: list.CreatedBy,
          lastupdated: list.LastUpdated,
          updatedby: list.UpdatedBy,
          control: list.Control,

        };
        this.sourceDis.localdata.push(tempData);
      }

      this.myGridDis.updatebounddata();

      this.sourceDis.localdata.length = 0;
    } else if (this.selectedIndex === 3) {
      for (const list of this.entlist) {
        const tempData = {

          description: list.Description,
          created_date_time: list.CreatedDateTime,
          creator_name: list.CreatorName,
          reason: list.Reason,
          notes: list.Notes,
          document: list.Document,
        };
        this.sourceEnt.localdata.push(tempData);
      }

      this.myGridEnt.updatebounddata();

      this.sourceEnt.localdata.length = 0;
    } else if (this.selectedIndex === 4) {
      if (this.splitState === '') {
        for (const list of this.splitList) {
          const tempData = {
            date: list.Date,
            amount: this.globService.getCurrencyConfiguration(list.Amount),
            status: list.Status,
            account: list.Account,
            account_name: list.AccountName,
            refund: list.Refund,
            refund_status: list.RefundStatus,
            lastupdated: list.LastUpdated,
            updatedby: list.UpdateBy,
          };
          this.sourceSplit.localdata.push(tempData);
        }

        this.myGridSplit.updatebounddata();

        this.sourceSplit.localdata.length = 0;
      } else if (this.splitState === 'Bulk Split') {
        for (const list of this.bulkList) {
          const tempData = {
            account_number: list.AccountNumber,
            bill_number: list.BillNumber,
            split_amount: this.globService.getCurrencyConfiguration(list.SplitAmount),
            error: list.Error,
            account_name: list.AccountName,
            invoice_ref: list.InvoiceRef,
          };
          this.sourceBulk.localdata.push(tempData);
        }

        this.myGridBulk.updatebounddata();

        this.sourceBulk.localdata.length = 0;
      }
    }
  }

  selectRow() {
    this.selectIndex = this.getCurrentGrid().getselectedrowindex();
    this.selectedData = this.getCurrentGrid().getrowdata(this.selectIndex);
  }

  getCurrentGrid() {
    switch (this.selectedIndex) {
      case 1:
        return this.myGridAll;
      case 2:
        return this.myGridDis;
      case 3:
        return this.myGridEnt;
      case 4:
        if (this.splitState === '') {
          return this.myGridSplit;
        } else if (this.splitState === 'Bulk Split') {
          return this.myGridBulk;
        } else {
          break;
        }
      default:
        break;
    }
  }

  selectRowAll() {
    this.selectIndex = this.getCurrentGrid().getselectedrowindex();
    this.selectedData = this.getCurrentGrid().getrowdata(this.selectIndex);
    // if (this.selectedIndex == 0) {
    //   // this.selectIndex = this.myGrid.getselectedrowindex();
    //   // this.selectedData = this.myGrid.getrowdata(this.selectIndex);
    // } else if (this.selectedIndex == 1) {
    //   this.selectIndex = this.myGridAll.getselectedrowindex();
    //   this.selectedData = this.myGridAll.getrowdata(this.selectIndex);
    // } else if (this.selectedIndex == 2) {
    //   this.selectIndex = this.myGridAll.getselectedrowindex();
    //   this.selectedData = this.myGridAll.getrowdata(this.selectIndex);
    // } else if (this.selectedIndex == 2) {
    //   this.selectIndex = this.myGridAll.getselectedrowindex();
    //   this.selectedData = this.myGridAll.getrowdata(this.selectIndex);
    // }
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
    if (this.selectedIndex === 0) {
    } else if (this.selectedIndex === 1) {
      for (let i = 0; i < this.columnsAll.length; i++) {
        this.gridWidth = this.gridWidth + this.columnsAll[i].width;
      }
    } else if (this.selectedIndex === 2) {
      for (let i = 0; i < this.columnsDis.length; i++) {
        this.gridWidth = this.gridWidth + this.columnsDis[i].width;
      }
    } else if (this.selectedIndex === 3) {
      for (let i = 0; i < this.columnsEnt.length; i++) {
        this.gridWidth = this.gridWidth + this.columnsEnt[i].width;
      }
    } else if (this.selectedIndex === 4) {
      if (this.splitState === '') {
        for (let i = 0; i < this.columnsSplit.length; i++) {
          this.gridWidth = this.gridWidth + this.columnsSplit[i].width;
        }
      } else if (this.splitState === 'Bulk Split') {
        for (let i = 0; i < this.columnsBulk.length; i++) {
          this.gridWidth = this.gridWidth + this.columnsBulk[i].width;
        }
      }
    }
  }

  exportData() {
  
    // this.myGrid.exportview('xlsx', 'CollectionRunStepList');
  }

  async getAllocationList() {

    await this.loading.present();
    this.setGridWidth();

    for (let i = 0; i < this.columnsAll.length; i++) {
      this.tranService.convertText(this.columnsAll[i].datafield).subscribe(value => {
        this.columnsAll[i].text = value;
      });
    }

    this.allocationList = [];
    this.rDService.getAllocationList().subscribe(async (result: AllocationItem[]) => {
      await this.loading.dismiss();
      
      if (result === null) {
        this.tranService.errorMessage('no_allocations');
      } else {
        for (const list of result) {
          this.allocationList.push(list);
        }
        this.setGridData();
      }

    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  async getPaymentList() {
    await this.loading.present();
    this.setGridWidth();

    for (let i = 0; i < this.columns.length; i++) {
      this.tranService.convertText(this.columns[i].datafield).subscribe(value => {
        this.columns[i].text = value;
      });
    }

    this.rDService.getPaymentData().subscribe(async (result: ReceiptItem) => {
      await this.loading.dismiss();
      
      if (result === null) {
        this.tranService.errorMessage('no_payments');
      } else {
        this.paymentList = result;
        this.setGridData();
      }

    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  async getDisList() {
    await this.loading.present();
    this.setGridWidth();

    for (let i = 0; i < this.columnsDis.length; i++) {
      this.tranService.convertText(this.columnsDis[i].datafield).subscribe(value => {
        this.columnsDis[i].text = value;
      });
    }

    this.disList = [];
    this.rDService.getDisList().subscribe(async (result: DistributionItem[]) => {
      await this.loading.dismiss();
      
      if (result === null) {
        this.tranService.errorMessage('no_distributions');
      } else {
        if (result != null && result.length > 0) {
          for (const list of result) {
            this.disList.push(list);
          }
        }
        this.setGridData();
      }

    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  async getEntList() {
    await this.loading.present();
    this.setGridWidth();

    for (let i = 0; i < this.columnsEnt.length; i++) {
      this.tranService.convertText(this.columnsEnt[i].datafield).subscribe(value => {
        this.columnsEnt[i].text = value;
      });
    }

    this.entlist = [];
    this.rDService.getEventList().subscribe(async (result: EventListItem[]) => {
      await this.loading.dismiss();
      
      if (result === null) {
        this.tranService.errorMessage('no_events');
      } else {
        if (result != null && result.length > 0) {
          for (const list of result) {
            this.entlist.push(list);
          }
        }
        this.setGridData();

      }

    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  async getSplitList() {
    await this.loading.present();
    this.setGridWidth();

    for (let i = 0; i < this.columnsSplit.length; i++) {
      this.tranService.convertText(this.columnsSplit[i].datafield).subscribe(value => {
        this.columnsSplit[i].text = value;
      });
    }

    this.splitList = [];
    this.rDService.getSplitList().subscribe(async (result: SplitItem[]) => {
      await this.loading.dismiss();
      
      if (result === null) {
        this.tranService.errorMessage('no_splits');
      } else {
        if (result != null && result.length > 0) {
          for (const list of result) {
            this.splitList.push(list);
          }
        }
        this.setGridData();
      }

    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  async getBulkList() {
    await this.loading.present();
    this.setGridWidth();

    for (let i = 0; i < this.columnsBulk.length; i++) {
      this.tranService.convertText(this.columnsBulk[i].datafield).subscribe(value => {
        this.columnsBulk[i].text = value;
      });
    }

    this.bulkList = [];
    this.rDService.getBulkList().subscribe(async (result: BulkItem[]) => {
      await this.loading.dismiss();
      
      if (result === null) {
        this.tranService.errorMessage('no_bulks');
      } else {
        if (result != null && result.length > 0) {
          for (const list of result) {
            this.bulkList.push(list);
          }
        }
        this.setGridData();
      }

    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  addDis() {

  }

  editDis() {
    this.selectRow();
    if (this.selectedIndex !== -1) {

    }
  }

  removeDis() {
    this.selectRow();
    if (this.selectedIndex !== -1) {

    }
  }

  rePrint() {

  }

  bulkSplit() {
    this.splitState = 'Bulk Split';
    this.getBulkList();
  }

  addBulk() {
    this.bulkState = 'add';
  }

  deleteBulk() {

  }

  editBulk() {

  }

  processBulk() {

  }

  cancelBulk() {
    this.splitState = '';
  }

  addNewBulk() {
    document.getElementById('submitButton').click();
  }

  goBackBulk() {
    this.bulkState = '';
  }

  saveSplit() {
    document.getElementById('submitButtonSplit').click();
  }

  addSplitSubmit() {

  }

  addBulkSubmit() {

  }

  addSplit() {
    this.splitState = 'Add Split';
  }

  voidSplit() {
    this.splitState = '';
  }

}
