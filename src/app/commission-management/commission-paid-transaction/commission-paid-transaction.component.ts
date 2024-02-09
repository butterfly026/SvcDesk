import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { ModalController, NavController } from '@ionic/angular';
import { LoadingService, ToastService, TranService } from 'src/services';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CommissionPaidTransactionService } from './services/paid-transaction.service';
import { GlobalService } from 'src/services/global-service.service';
import { ComponentOutValue } from 'src/app/model';
import { CommissionFilterComponent } from '../commission-filter/commission-filter.component';

@Component({
  selector: 'app-commission-paid-transaction',
  templateUrl: './commission-paid-transaction.component.html',
  styleUrls: ['./commission-paid-transaction.component.scss'],
})
export class CommissionPaidTransactionComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Input() CommissionDetail: any;
  @Input() CommissionDetailItem: any;

  @Output('CommissionPaidTransactionComponent') CommissionPaidTransactionComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();
  @ViewChild('commissionPaidTransactionGrid') public commissionPaidTransactionGrid: jqxGridComponent;

  public grTotal: string = '';
  selectedTransaction: any;

  groupList = [];

  selectIndex: number;
  selectedDealer: any;
  gridWidth: any;
  gridContentWidth = '';

  pagingParam = {
    SkipRecords: 0,
    TakeRecords: 10,
    CountRecords: 'Y',
    CurrentOnly: true,
    AccountOnly: true,
    SearchString: '',
    FilterVal: '',
  };


  totalLength: any;
  pageRowNumber: number = 1;
  rowStep: string = '10';
  SkipRecords: number = 0;

  gridRecords: any = {};

  source = {
    localdata: [],
    datafields: [
      { name: 'transaction_id', type: 'number' },
      { name: 'rule_id', type: 'string' },
      { name: 'account', type: 'string' },
      { name: 'service', type: 'string' },
      { name: 'apply_to', type: 'string' },
      { name: 'amount', type: 'number' },
      { name: 'trans_type', type: 'string' },
      { name: 'trans_no', type: 'number' },
      { name: 'due_date', type: 'string' },
      { name: 'rate', type: 'number' },
      { name: 'basis_amount', type: 'number' },
      { name: 'source', type: 'string' }
    ],
    datatype: 'array',
    pagesize: 10
  };


  public dataAdapter: any = new jqx.dataAdapter(this.source);
  _grandTotalText = `<div style="font-size: smaller; line-height: 30px; color: #222428;"><strong>${this.grTotal || 'Grand Total'}:</strong></div>`;


  public columns: Array<any> = [
    { text: 'transaction_id', datafield: 'transaction_id', width: 80, },
    { text: 'rule_id', datafield: 'rule_id', width: 80, },
    { text: 'account', datafield: 'account', width: 110, },
    { text: 'service', datafield: 'service', width: 110, },
    { text: 'apply_to', datafield: 'apply_to', width: 80, },
    { text: 'amount', datafield: 'amount', width: 80, cellsformat: 'c2', cellsalign: 'right' },
    { text: 'trans_type', datafield: 'trans_type', width: 100, },
    { text: 'trans_number', datafield: 'trans_no', width: 100, cellsalign: 'right' },
    { text: 'due_date', datafield: 'due_date', width: 150, },
    { text: 'rate', datafield: 'rate', width: 80, cellsformat: 'c2', cellsalign: 'right' },
    { text: 'basis_amount', datafield: 'basis_amount', width: 80, cellsformat: 'c2', cellsalign: 'right' },
    { text: 'source', datafield: 'source', width: 150, }
  ];
  _aggregateSum = (aggregates: { sum: string }): string => `<div style="font-size: smaller; line-height: 30px; color: #222428;"><strong>${aggregates.sum}</strong></div>`;

  constructor(
    public navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    private commissionPaidTransactionService: CommissionPaidTransactionService,
    public globService: GlobalService,
    private cdr: ChangeDetectorRef,
    private modalCtrl: ModalController,
  ) {

    this.tranService.translaterService();
    this.translateColumns();

    this.tranService.convertText('grand_total').subscribe(value => {
      this.grTotal = value;
    });

  }


  ngOnInit(): void {
    this.getData();
  }

  async getData() {
    await this.loading.present();
    this.commissionPaidTransactionService.getCommissionPaidTransactions(this.pagingParam, this.ContactCode).subscribe(async (result: any) => {
      
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.groupList = convResult.data;
      this.setGridData();
      this.totalLength = convResult.count;
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  translateColumns() {
    for (let list of this.columns) {
      this.tranService.convertText(list.datafield).subscribe(result => {
        list.text = result;
      })
    }
  }

  getWidth() {
    let element = document.getElementById('commission-paid-transaction-grid');
    if (typeof (element) !== 'undefined' && element !== null) {
      return element.offsetWidth;
    } else {
      return 900;
    }
  }

  setGridWidth() {
    if (this.getWidth() > this.gridWidth) {
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
  }

  exportData() {
    this.commissionPaidTransactionGrid.exportview('xlsx', 'Commissions List');
  }

  refreshGrid() {
    this.pagingParam.SkipRecords = 0;
    this.pagingParam.TakeRecords = 10;
    this.pageRowNumber = 1;
    this.rowStep = '10';
    this.globService.globSubject.next('refresh-grid');
    this.getData();
  }

  setGridData() {

    this.source.localdata = [];
    for (const list of this.groupList) {
      const tempData = {
        transaction_id: list.transaction_id,
        rule_id: list.rule_id,
        account: list.account,
        service: list.service,
        apply_to: list.apply_to,
        amount: list.amount,
        trans_type: list.trans_type,
        trans_no: list.trans_no,
        due_date: list.due_date,
        rate: list.rate,
        basis_amount: list.basis_amount,
        source: list.source,
      };
      this.source.localdata.push(tempData);
    }

    this.commissionPaidTransactionGrid.updatebounddata();

    this.gridRecords = this.commissionPaidTransactionGrid.attrSource;
    this.setGridColumnWidth(this.gridRecords.records);
  }

  setGridColumnWidth(list) {

    this.gridWidth = 0;
    let columnsMaxWidth = {
      transaction_id: 0,
      rule_id: 0,
      account: 0,
      service: 0,
      apply_to: 0,
      amount: 0,
      trans_type: 0,
      trans_no: 0,
      due_date: 0,
      rate: 0,
      basis_amount: 0,
      source: 0,
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
          this.commissionPaidTransactionGrid.setcolumnproperty(list.datafield, 'width', result.length * 8 + 10);
          this.gridWidth += result.length * 8 + 10;
        } else {
          this.commissionPaidTransactionGrid.setcolumnproperty(list.datafield, 'width', columnsMaxWidth[list.datafield] * 8 + 10);
          this.gridWidth += columnsMaxWidth[list.datafield] * 8 + 10;
        }
      });
    }
  }

  outPagingComponent(event) {
    this.pagingParam.SkipRecords = event.SkipRecords;
    this.pagingParam.TakeRecords = event.TakeRecords;

    this.pageRowNumber = event.pageRowNumber;
    this.rowStep = event.rowStep;
    this.SkipRecords = event.SkipRecords;

    this.getData();
  }

  searchInputEvent(event) {
    if (event.keyCode === 13) {
      this.pagingParam.SearchString = event.target.value;
      this.pagingParam.SkipRecords = 0;
      this.pagingParam.TakeRecords = 10;
      this.pageRowNumber = 1;
      this.rowStep = '10';
      this.SkipRecords = 0;
      this.getData();
    }
  }

  goToOtherPages(type) {
    switch (type) {
      case 'close':
        this.CommissionPaidTransactionComponent.emit({ type: type, data: null });
        break;

      default:
        this.CommissionPaidTransactionComponent.emit({ type: type, data: this.selectedDealer });
        break;
    }
  }

  async openFilter() {
    const modal = await this.modalCtrl.create(
      {
        component: CommissionFilterComponent,
        componentProps: {
          ContactCode: this.ContactCode,
        }
      }
    );
    modal.onDidDismiss().then((result: any) => {
      if (result.data) {
        this.pagingParam.FilterVal = result.data.filter;
        this.getData();
      }
    });
    await modal.present();
  }

}
