import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { RechargeListService } from './services/recharge-list.service';
import { NavController } from '@ionic/angular';
import { ToastService, LoadingService, TranService } from 'src/services';

import { RechargeListItem, ErrorItems } from 'src/app/model';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-recharge-list',
  templateUrl: './recharge-list.page.html',
  styleUrls: ['./recharge-list.page.scss'],
})
export class RechargeListPage implements OnInit {
  @ViewChild('myGrid') myGrid: jqxGridComponent;

  rechargeList: Array<RechargeListItem> = [];
  pageTitle: string = '';

  

  selectIndex: number;
  selectedData: any;
  gridWidth: any;
  gridContentWidth = '';

  source = {
    localdata: [],
    datafields: [
      { name: 'id_up', type: 'string', },
      { name: 'type', type: 'string', },
      { name: 'voucher', type: 'string', },
      { name: 'amount', type: 'string', },
      { name: 'start', type: 'string', },
      { name: 'end', type: 'string', },
      { name: 'expiry_date', type: 'string', },
      { name: 'status', type: 'string', },
      { name: 'status_date', type: 'string', },
      { name: 'status_by', type: 'string', },
    ],
    datatype: 'array'
  };

  dataAdapter: any = new jqx.dataAdapter(this.source);

  columns = [
    { text: '', datafield: 'id_up', width: 50 },
    { text: '', datafield: 'type', width: 130 },
    { text: '', datafield: 'voucher', width: 150 },
    { text: '', datafield: 'amount', cellsalign: 'right', width: 100 },
    { text: '', datafield: 'start', width: 180 },
    { text: '', datafield: 'end', width: 80 },
    { text: '', datafield: 'expiry_date', width: 100 },
    { text: '', datafield: 'status', width: 80 },
    { text: '', datafield: 'status_date', width: 180 },
    { text: '', datafield: 'status_by', width: 100 },
  ];


  constructor(
    private navCtrl: NavController,
    private toast: ToastService,
    private loading: LoadingService,
    private tranService: TranService,
    private rListService: RechargeListService,
    
    private cdr: ChangeDetectorRef,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('recharge').subscribe(value => {
      this.pageTitle = value;
    });

    
    this.setGridWidth();

    for (let i = 0; i < this.columns.length; i++) {
      this.tranService.convertText(this.columns[i].datafield).subscribe(value => {
        this.columns[i].text = value;
      });
    }


  }

  async ngOnInit() {
    await this.loading.present();
    this.rListService.getRechargeList().subscribe(async (result: RechargeListItem[]) => {
      
      await this.loading.dismiss();
      if (result === null) {
        this.tranService.errorMessage('no_recharges_list');
      } else {
        for (const list of result) {
          this.rechargeList.push(list);
        }
        this.setGridData();
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  goBack() {
    this.navCtrl.pop();
  }

  goToElements() {

  }

  goToAdd() {
    this.navCtrl.navigateForward(['Recharges/recharge-new']);
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
    this.selectIndex = this.myGrid.getselectedrowindex();
    this.selectedData = this.myGrid.getrowdata(this.selectIndex);
    
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
    
    this.myGrid.exportview('xlsx', 'Recharge list');
  }

  setGridData() {
    for (const list of this.rechargeList) {
      const tempData = {
        id_up: list.ID,
        type: list.Type,
        voucher: list.Voucher,
        amount: this.globService.getCurrencyConfiguration(list.Amount),
        start: list.Start,
        end: list.End,
        expiry_date: list.ExpiryDate,
        status: list.Status,
        status_date: list.StatusDate,
        status_by: list.StatusBy,
      };
      this.source.localdata.push(tempData);
    }

    this.myGrid.updatebounddata();

    this.source.localdata.length = 0;
  }

}
