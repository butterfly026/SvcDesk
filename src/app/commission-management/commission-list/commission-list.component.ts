import { AfterContentChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { NavController } from '@ionic/angular';
import { LoadingService, ToastService, TranService } from 'src/services';
import { CommissionListService } from './services/commission-list.service';

import { Subscription } from 'rxjs';
import { GlobalService } from 'src/services/global-service.service';
import { ComponentOutValue } from 'src/app/model';


@Component({
  selector: 'app-commission-list',
  templateUrl: './commission-list.component.html',
  styleUrls: ['./commission-list.component.scss'],
})
export class CommissionListComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Output('CommissionListComponent') CommissionListComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  @ViewChild('commissionListGrid') public commissionListGrid: jqxGridComponent;

  public grTotal: string = '';
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
  };


  totalLength: any;
  pageRowNumber: number = 1;
  rowStep: string = '10';
  SkipRecords: number = 0;

  gridRecords: any = {};

  source = {
    localdata: [],
    datafields: [
      { name: 'dealer_id', type: 'string' },
      { name: 'dealer_name', type: 'string' },
      { name: 'paid_to_date', type: 'number' },
      { name: 'tagged', type: 'number' },
      { name: 'payble', type: 'number' },
      { name: 'pending', type: 'number' },
      { name: 'suspended', type: 'number' },
      { name: 'last_paid_amount', type: 'number' },
      { name: 'last_paid_date', type: 'string' },
      { name: 'check_no', type: 'string' }
    ],
    datatype: 'array'
  };


  public dataAdapter: any = new jqx.dataAdapter(this.source);
  _grandTotalText = `<div style="font-size: smaller; line-height: 30px; color: #222428;"><strong>${this.grTotal || 'Grand Total'}:</strong></div>`;


  columns: Array<any> = [
    { text: '', datafield: 'dealer_id', width: 80, },
    { text: '', datafield: 'dealer_name', width: 80, aggregatesrenderer: () => this._grandTotalText },
    { text: '', datafield: 'paid_to_date', width: 80, cellsformat: 'c2', cellsalign: 'right', },
    { text: '', datafield: 'tagged', width: 80, cellsformat: 'c2', cellsalign: 'right', },
    { text: '', datafield: 'payble', width: 80, cellsformat: 'c2', cellsalign: 'right', },
    { text: '', datafield: 'pending', width: 80, cellsformat: 'c2', cellsalign: 'right', },
    { text: '', datafield: 'suspended', width: 80, cellsformat: 'c2', cellsalign: 'right', },
    { text: '', datafield: 'last_paid_amount', width: 80, cellsformat: 'c2', cellsalign: 'right', },
    { text: '', datafield: 'last_paid_date', width: 80, },
    { text: '', datafield: 'check_no', width: 80, }
  ];
  _aggregateSum = (aggregates: { sum: string }): string => `<div style="font-size: smaller; line-height: 30px; color: #222428;"><strong>${aggregates.sum}</strong></div>`;

  constructor(
    public navCtrl: NavController,
    private toast: ToastService,
    private loading: LoadingService,
    private tranService: TranService,
    private commissionListService: CommissionListService,
    public globService: GlobalService,
    private cdr: ChangeDetectorRef,
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


  ngAfterContentChecked(): void {
  }

  async getData() {
    await this.loading.present();
    this.commissionListService.getCommissionList(this.pagingParam, this.ContactCode).subscribe(async (result: any) => {
      
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

  public myGridOnPageSizeChanged = (event: any): void => {
    
  };

  translateColumns() {
    for (let list of this.columns) {
      this.tranService.convertText(list.datafield).subscribe(result => {
        list.text = result;
      })
    }
  }

  getWidth() {
    let element = document.getElementById('commission-list-grid');
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
    this.commissionListGrid.exportview('xlsx', 'Commissions List');
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
        dealer_id: list.dealer_id,
        dealer_name: list.dealer_name,
        paid_to_date: list.paid_to_date,
        tagged: list.tagged,
        payble: list.payble,
        pending: list.pending,
        suspended: list.suspended,
        last_paid_amount: list.last_paid_amount,
        last_paid_date: list.last_paid_date,
        check_no: list.check_no,
      };
      this.source.localdata.push(tempData);
    }

    this.commissionListGrid.updatebounddata();

    this.gridRecords = this.commissionListGrid.attrSource;
    this.setGridColumnWidth(this.gridRecords.records);
  }

  setGridColumnWidth(list) {

    this.gridWidth = 0;
    let columnsMaxWidth = {
      dealer_id: 0,
      dealer_name: 0,
      paid_to_date: 0,
      tagged: 0,
      payble: 0,
      pending: 0,
      suspended: 0,
      last_paid_amount: 0,
      last_paid_date: 0,
      check_no: 0,
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
          this.commissionListGrid.setcolumnproperty(list.datafield, 'width', result.length * 8 + 10);
          this.gridWidth += result.length * 8 + 10;
        } else {
          this.commissionListGrid.setcolumnproperty(list.datafield, 'width', columnsMaxWidth[list.datafield] * 8 + 10);
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
        this.CommissionListComponent.emit({ type: type, data: null });
        break;

      default:
        this.CommissionListComponent.emit({ type: type, data: this.selectedDealer });
        break;
    }
  }

}
