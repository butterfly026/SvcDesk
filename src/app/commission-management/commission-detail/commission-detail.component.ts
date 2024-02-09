import { AfterContentChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { NavController } from '@ionic/angular';
import { LoadingService, ToastService, TranService } from 'src/services';
import { Subscription } from 'rxjs';
import { CommissionDetailService } from './services/commission-detail.service';
import { GlobalService } from 'src/services/global-service.service';
import { ComponentOutValue } from 'src/app/model';

@Component({
  selector: 'app-commission-detail',
  templateUrl: './commission-detail.component.html',
  styleUrls: ['./commission-detail.component.scss'],
})
export class CommissionDetailComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Input() CommissionDetail: any;

  @Output('CommissionDetailComponent') CommissionDetailComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  @ViewChild('commissionDetailGrid') public commissionDetailGrid: jqxGridComponent;

  commissionDetail = [];

  public rowList: Array<number> = [10, 20, 50, 100];
  themeColor: string;
  public grTotal: string = '';
  groupList = [];

  selectIndex: number;
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

  public selectedDetail: any;
  public dealerId: string;

  source = {
    localdata: [],
    datafields: [
      { name: 'pay_id', type: 'number' },
      { name: 'status', type: 'string' },
      { name: 'calculated_amount', type: 'number' },
      { name: 'paid_amount', type: 'number' },
      { name: 'paid_date', type: 'string' },
      { name: 'check_no', type: 'string' },
      { name: 'comment', type: 'string' },
      { name: 'fin_file', type: 'string' }
    ],
    datatype: 'array',
    pagesize: 10
  };


  public dataAdapter: any = new jqx.dataAdapter(this.source);

  public columns: Array<any> = [
    { text: '', datafield: 'pay_id', width: 80, },
    { text: '', datafield: 'status', width: 110, },
    { text: '', datafield: 'calculated_amount', width: 80, cellsformat: 'c2', cellsalign: 'right' },
    { text: '', datafield: 'paid_amount', width: 80, cellsformat: 'c2', cellsalign: 'right' },
    { text: '', datafield: 'paid_date', width: 200, },
    { text: '', datafield: 'check_no', width: 100, },
    { text: '', datafield: 'comment', width: 200, },
    { text: '', datafield: 'fin_file', width: 80, },
  ];

  _grandTotalText = `<div style="font-size: smaller; line-height: 30px; color: #222428;"><strong>${this.grTotal || 'Grand Total'}:</strong></div>`;
  _aggregateSum = (aggregates: { sum: string }): string => `<div style="font-size: smaller; line-height: 30px; color: #222428;"><strong>${aggregates.sum}</strong></div>`;

  showComponent: string = 'detail';

  constructor(
    public navCtrl: NavController,
    private toast: ToastService,
    private loading: LoadingService,
    private tranService: TranService,
    private commissionDetailService: CommissionDetailService,
    public globService: GlobalService,
    private cdr: ChangeDetectorRef,
  ) {

    this.tranService.translaterService();
    this.translateColumns();

    this.tranService.convertText('grand_total').subscribe(value => {
      this.grTotal = value;
    });

    // this.dealerId = activatedRoute.snapshot.params['dealer_id'];
  }


  ngOnInit(): void {
    this.dealerId = this.CommissionDetail.dealer_id;
    this.getData();
  }


  ngAfterContentChecked(): void {
  }

  async getData() {
    await this.loading.present();
    this.commissionDetailService.getCommissionDetails(this.pagingParam, this.ContactCode).subscribe(async (result: any) => {
      // this.source.localdata = this.commissionDetail = result.data;
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
      });
    }
  }

  getWidth() {
    let element = document.getElementById('commissions-detail-grid');
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
    this.commissionDetailGrid.exportview('xlsx', 'Service Cost Centre Service List');
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
        pay_id: list.pay_id,
        status: list.status,
        calculated_amount: list.calculated_amount,
        paid_amount: list.paid_amount,
        paid_date: list.paid_date,
        check_no: list.check_no,
        comment: list.comment,
        fin_file: list.fin_file,
      };
      this.source.localdata.push(tempData);
    }

    this.commissionDetailGrid.updatebounddata();

    this.gridRecords = this.commissionDetailGrid.attrSource;
    this.setGridColumnWidth(this.gridRecords.records);
  }

  setGridColumnWidth(list) {

    this.gridWidth = 0;
    let columnsMaxWidth = {
      pay_id: 0,
      status: 0,
      calculated_amount: 0,
      paid_amount: 0,
      paid_date: 0,
      check_no: 0,
      comment: 0,
      fin_file: 0,
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
          this.commissionDetailGrid.setcolumnproperty(list.datafield, 'width', result.length * 8 + 10);
          this.gridWidth += result.length * 8 + 10;
        } else {
          this.commissionDetailGrid.setcolumnproperty(list.datafield, 'width', columnsMaxWidth[list.datafield] * 8 + 10);
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
        this.CommissionDetailComponent.emit({ type: type, data: null });
        break;

      default:
        this.showComponent = type;
        break;
    }
  }

  processComponent(event) {
    switch (event.type) {
      case 'close':
        this.showComponent = 'detail';
        break;

      default:
        break;
    }
  }

}
