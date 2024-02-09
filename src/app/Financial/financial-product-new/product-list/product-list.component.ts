import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { ComponentOutValue } from 'src/app/model';
import { TranService, LoadingService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { ProductNewComponent } from '../product-new/product-new.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Output('ProductListComponent') ProductListComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  @ViewChild('productNewGrid') productNewGrid: jqxGridComponent;

  gridWidth: any;
  gridContentWidth = '';
  selectedData: any;
  selectIndex: any;

  source = {
    localdata: [],
    datafields: [
      { 'name': 'product_id', 'type': 'string' },
      { 'name': 'override_description', 'type': 'string' },
      { 'name': 'quantity', 'type': 'string' },
      { 'name': 'unit_price', 'type': 'float' },
      { 'name': 'total_price', 'type': 'float' },
      { 'name': 'serial', 'type': 'string' },
      { 'name': 'note', 'type': 'string' },
    ],
    datatype: 'array'
  };

  dataAdapter: any = new jqx.dataAdapter(this.source);

  columns = [
    { 'text': '', 'datafield': 'product_id' },
    { 'text': '', 'datafield': 'override_description' },
    { 'text': '', 'datafield': 'quantity' },
    { 'text': '', 'datafield': 'unit_price', cellsformat: 'c2', cellsalign: 'right' },
    { 'text': '', 'datafield': 'total_price', cellsformat: 'c2', cellsalign: 'right' },
    { 'text': '', 'datafield': 'serial' },
    { 'text': '', 'datafield': 'note' },
  ];
  gridRecords: any = {};

  groupList: any[] = [];


  totalLength: any;
  pageRowNumber: number = 1;
  rowStep: string = '10';
  SkipRecords: number = 0;

  reqParam = {
    SearchString: '',
    SkipRecords: 0,
    TakeRecords: 10,
    CountRecords: 'Y',
  };

  constructor(
    private tranService: TranService,

    private cdr: ChangeDetectorRef,
    public globService: GlobalService,
    private loading: LoadingService,
    private modalCtrl: ModalController,
  ) {

    for (let i = 0; i < this.columns.length; i++) {
      this.tranService.convertText(this.columns[i].datafield).subscribe(value => {
        this.columns[i].text = value;
      });
    }
  }

  ngOnInit() {
  }

  refreshGrid() {
    this.reqParam.SkipRecords = 0;
    this.reqParam.TakeRecords = 10;
    this.pageRowNumber = 1;
    this.rowStep = '10';
    this.globService.globSubject.next('refresh-grid');
    this.getProductList();
  }

  async getProductList() {
    if (this.groupList.length > 0) {
      this.setGridData();
      this.getTotalAmount();
      this.selectedData = null;
      this.productNewGrid.clearselection();
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
    this.gridWidth = 0;
    for (let i = 0; i < this.columns.length; i++) {
      if (this.columns[i]['width']) {
        this.gridWidth += this.columns[i]['width'];
      }
    }
  }

  exportData() {
    this.productNewGrid.exportview('xlsx', 'Finantial Charges');
  }

  selectRow(event) {
    this.selectedData = null;
    if (event.args.row.product_id) {
      this.selectIndex = event.args.rowindex;
      this.selectedData = this.groupList[this.selectIndex];
    } else {
      // this.selectedData = false;
    }
  }

  getWidth() {
    let element = document.getElementById('financial-product-new-grid');
    if (typeof (element) !== 'undefined' && element !== null) {
      return element.offsetWidth;
    } else {
      return 900;
    }
  }

  setGridData() {

    for (const list of this.groupList) {
      const tempData = {
        product_id: list.productid,
        override_description: list.overridedescription,
        quantity: list.quantity,
        unit_price: list.unitprice,
        total_price: list.totalprice,
        serial: list.serial,
        note: list.note,
      };
      this.source.localdata.push(tempData);
    }

    this.productNewGrid.updatebounddata();
    this.source.localdata.length = 0;

    this.gridRecords = this.productNewGrid.attrSource;
    this.setGridColumnWidth(this.gridRecords.records);
  }

  setGridColumnWidth(list) {

    this.gridWidth = 0;
    let columnsMaxWidth = {
      product_id: 0,
      override_description: 0,
      quantity: 0,
      unit_price: 0,
      total_price: 0,
      serial: 0,
      note: 0,
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
          this.productNewGrid.setcolumnproperty(list.datafield, 'width', result.length * 8 + 10);
          this.gridWidth += result.length * 8 + 10;
        } else {
          this.productNewGrid.setcolumnproperty(list.datafield, 'width', columnsMaxWidth[list.datafield] * 8 + 10);
          this.gridWidth += columnsMaxWidth[list.datafield] * 8 + 10;
        }
      });
    }
  }

  searchInputEvent(event) {
    if (event.keyCode === 13) {
      this.reqParam.SearchString = event.target.value;
      this.reqParam.SkipRecords = 0;
      this.reqParam.TakeRecords = 10;
      this.pageRowNumber = 1;
      this.rowStep = '10';
      this.SkipRecords = 0;
      this.getProductList();
    }
  }

  outPagingComponent(event) {
    this.reqParam.SkipRecords = event.SkipRecords;
    this.reqParam.TakeRecords = event.TakeRecords;

    this.pageRowNumber = event.pageRowNumber;
    this.rowStep = event.rowStep;
    this.SkipRecords = event.SkipRecords;

    this.getProductList();
  }

  async addNew() {
    const modal = await this.modalCtrl.create({
      component: ProductNewComponent,
      componentProps: {
        ContactCode: this.ContactCode
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data?.type === 'list') {
        const convResult = this.globService.ConvertKeysToLowerCase(result.data.data);
        const tempData = {
          productid: convResult.productidval,
          overridedescription: convResult.overridedescription,
          quantity: convResult.quantity,
          unitprice: convResult.unitprice,
          totalprice: convResult.totalprice,
          serial: convResult.serial,
          note: convResult.note,
        };

        this.groupList.push(tempData);
        this.getProductList();
      }
    });

    await modal.present();
  }

  remoteItem() {
    this.groupList.splice(this.selectIndex, 1);
    this.setGridData();
    this.selectedData = null;
    this.productNewGrid.clearselection();
    this.getTotalAmount();
  }

  async updateProduct() {
    const modal = await this.modalCtrl.create({
      component: ProductNewComponent,
      componentProps: {
        ContactCode: this.ContactCode,
        ProductType: 'update',
        ProductData: this.selectedData
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data?.type === 'list') {
        const convResult = this.globService.ConvertKeysToLowerCase(result.data.data);
        const tempData = {
          productid: convResult.productidval,
          overridedescription: convResult.overridedescription,
          quantity: convResult.quantity,
          unitprice: convResult.unitprice,
          totalprice: convResult.totalprice,
          serial: convResult.serial,
          note: convResult.note,
        };

        this.groupList.splice(this.selectIndex, 1, tempData);
        this.getProductList();
      }
    });

    await modal.present();
  }

  getTotalAmount() {
    let charge = 0;
    for (let list of this.groupList) {
      charge += list.totalprice;
    }

    this.ProductListComponent.emit({ type: 'totalPrice', data: this.groupList });
  }

}
