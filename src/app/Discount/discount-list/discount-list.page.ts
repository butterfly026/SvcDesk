import { Component, OnInit, ChangeDetectorRef, AfterViewInit, ViewChild } from '@angular/core';
import { DiscountListService } from './services/discount-list.service';
import { LoadingService, ToastService, TranService } from 'src/services';

import { NavController } from '@ionic/angular';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { ChargeItem, DiscountItem } from 'src/app/model';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-discount-list',
  templateUrl: './discount-list.page.html',
  styleUrls: ['./discount-list.page.scss'],
})
export class DiscountListPage implements OnInit, AfterViewInit {


  @ViewChild('myGridDiscounList') myGridDiscounList: jqxGridComponent;

  discountList: Array<DiscountItem> = [];

  

  selectIndex: number;
  selectedData: any;
  gridWidth: any;
  gridContentWidth = '';

  pageTitle: string = '';

  deleteStr = '';

  deleteMessage: string = '';
  disableUpdate = false;

  source = {
    localdata: [],
    datafields: [
      { name: 'discount', type: 'string', map: '0' },
      { name: 'from', type: 'string', map: '1' },
      { name: 'to', type: 'string', map: '2' },
      { name: 'source', type: 'string', map: '3' },
      { name: 'package', type: 'string', map: '4' },
      { name: 'status', type: 'string', map: '5' },
      { name: 'terminal_discount', type: 'string', map: '6' },
      { name: 'discount_id', type: 'string', map: '7' },
    ],
    datatype: 'array'
  };

  dataAdapter: any = new jqx.dataAdapter(this.source);

  columns = [
    { text: '', datafield: 'discount', width: 120 },
    { text: '', datafield: 'from', width: 120 },
    { text: '', datafield: 'to', width: 120 },
    { text: '', datafield: 'source', width: 130 },
    { text: '', datafield: 'package', width: 130 },
    { text: '', datafield: 'status', width: 100 },
    { text: '', datafield: 'terminal_discount', width: 100 },
    { text: '', datafield: 'discount_id', hidden: true, width: 0 }
  ];

  constructor(
    private loading: LoadingService,
    private toast: ToastService,
    private discountService: DiscountListService,
    private tranService: TranService,
    
    private cdr: ChangeDetectorRef,
    private navCtrl: NavController,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('discount_list').subscribe(value => {
      this.pageTitle = value;
    });
    

    this.setGridWidth();

    for (let i = 0; i < this.columns.length; i++) {
      this.tranService.convertText(this.columns[i].datafield).subscribe(value => {
        this.columns[i].text = value;
      });
    }
    this.getDiscountList();
  }

  ngOnInit() {
  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  ngAfterViewInit() {
    this.myGridDiscounList.selectrow(0);
    setTimeout(() => {
      this.selectRow();
    }, 1000);
  }

  async getDiscountList() {
    this.discountList = [];
    await this.loading.present();
    this.discountService.getDiscountList().subscribe(async (result: DiscountItem[]) => {
      
      await this.loading.dismiss();
      if (result === null) {
        this.tranService.errorMessage('no_discounts');
      } else {
        for (const list of result) {
          this.discountList.push(list);
        }
        this.setGridData();
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
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
    this.selectIndex = this.myGridDiscounList.getselectedrowindex();
    this.selectedData = this.myGridDiscounList.getrowdata(this.selectIndex);
    if (this.selectIndex > this.discountList.length - 1) {
      this.disableUpdate = true;
    } else {
      this.disableUpdate = false;
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
      return '100%';
    }
  }

  getGridWidth() {
    this.gridWidth = 0;
    for (let i = 0; i < this.columns.length; i++) {
      this.gridWidth = this.gridWidth + this.columns[i].width;
    }
  }

  exportData() {
    this.myGridDiscounList.exportview('xlsx', 'Discount List');
  }

  setGridData() {
    for (const list of this.discountList) {
      const tempData = [
        list.Discount, list.From, list.To, list.Source, list.Package, list.Status,
        list.TerminalDiscount, list.DiscountId
      ];
      this.source.localdata.push(tempData);
    }

    this.myGridDiscounList.updatebounddata();

    this.source.localdata.length = 0;
  }

  goBack() {
    // this.navCtrl.pop();
    this.navCtrl.navigateRoot(['auth/signin']);
  }

  goToNew() {
    this.navCtrl.navigateForward(['Discount/discount-new']);
  }

  goToEdit() {
    this.selectRow();
    this.navCtrl.navigateForward(['Discount/discount-edit', this.selectedData.discount_id]);
  }

  deleteDiscount() {
    this.selectRow();
  }

}
