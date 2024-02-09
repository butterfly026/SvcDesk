import { Component, OnInit, ChangeDetectorRef, ViewChild, Inject } from '@angular/core';
import { RechargeSimpleListService } from './services/recharge-simple-list.service';
import { NavController, AlertController } from '@ionic/angular';
import { ToastService, LoadingService, TranService } from 'src/services';


import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';

import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { ConvertDateFormatService } from 'src/services/convert-dateformat.service';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-recharge-simple-list',
  templateUrl: './recharge-simple-list.page.html',
  styleUrls: ['./recharge-simple-list.page.scss'],
})
export class RechargeSimpleListPage implements OnInit {
  @ViewChild('myGrid') myGrid: jqxGridComponent;

  rechargeList: any = [];
  pageTitle: string = '';

  actKeyString: string = '';

  

  selectIndex: number;
  selectedData: any;
  gridWidth: any;
  gridContentWidth = '';

  availButton: boolean = true;
  offlineVouchers: string = '';
  onlineVouchers: string = '';

  formTitle: string = '';

  CategoryId: number = 0;

  source = {
    localdata: [],
    datafields: [
      { name: 'id', type: 'string', },
      { name: 'date_purchased', type: 'string', },
      { name: 'recharge_name', type: 'string', },
      { name: 'procedures_available', type: 'string', },
      { name: 'price', type: 'string', },
    ],
    datatype: 'array'
  };

  dataAdapter: any = new jqx.dataAdapter(this.source);

  columns = [
    { text: '', datafield: 'id', width: 50 },
    { text: '', datafield: 'date_purchased', width: 180 },
    { text: '', datafield: 'recharge_name', width: 180 },
    { text: '', datafield: 'procedures_available', width: 180 },
    { text: '', datafield: 'price', cellsalign: 'right', width: 100 },
  ];

  sourceOffline = {
    localdata: [],
    datafields: [
      { name: 'id', type: 'string', },
      { name: 'date_purchased', type: 'string', },
      { name: 'recharge_name', type: 'string', },
      { name: 'price', type: 'string', },
    ],
    datatype: 'array'
  };

  dataAdapterOffline: any = new jqx.dataAdapter(this.sourceOffline);

  columnsOffline = [
    { text: '', datafield: 'id', width: 50 },
    { text: '', datafield: 'date_purchased', width: 180 },
    { text: '', datafield: 'recharge_name', width: 200 },
    { text: '', datafield: 'price', cellsalign: 'right', width: 100 },
  ];

  constructor(
    private navCtrl: NavController,
    private toast: ToastService,
    private loading: LoadingService,
    private tranService: TranService,
    private rListService: RechargeSimpleListService,
    
    private cdr: ChangeDetectorRef,
    private alt: AlertController,
    private route: ActivatedRoute,
    private dateConvert: ConvertDateFormatService,

    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('customer_recharge').subscribe(value => {
      this.pageTitle = value;
    });

    this.CategoryId = this.route.snapshot.params['CategoryId'];

    this.tranService.convertText('voucher_code').subscribe(value => {
      this.actKeyString = value;
    })
    
    this.setGridWidth();

    for (let i = 0; i < this.columns.length; i++) {
      this.tranService.convertText(this.columns[i].datafield).subscribe(value => {
        this.columns[i].text = value;
      });
    }

    for (let i = 0; i < this.columnsOffline.length; i++) {
      this.tranService.convertText(this.columnsOffline[i].datafield).subscribe(value => {
        this.columnsOffline[i].text = value;
      });
    }

    if (this.CategoryId.toString() === '1') {
      this.tranService.convertText('online_vouchers').subscribe(onValue => {
        this.onlineVouchers = onValue;
        this.formTitle = onValue;
      });
    } else if (this.CategoryId.toString() === '2') {
      this.tranService.convertText('offline_vouchers').subscribe(offValue => {
        this.offlineVouchers = offValue;
        this.formTitle = offValue;
      });
    } else {
      this.formTitle = '';
    }

  }

  async ngOnInit() {
    await this.loading.present();
    this.rListService.getRechargeList(this.CategoryId).subscribe(async (result: any) => {
      
      await this.loading.dismiss();

      if (result === null) {
        this.tranService.convertText('vouchers_not_found').subscribe(value => {
          this.toast.present(value);
        });
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
    // this.navCtrl.pop();
    this.navCtrl.navigateRoot(['Menu/menu-grid']);
  }

  getRechargeId() {

  }

  async goToActivation() {
    await this.loading.present();
    this.rListService.checkActivationKey(this.selectedData.id).subscribe(async (result: any) => {
      
      await this.loading.dismiss();
      if (result === null) {
      } else {
        this.showAlert(result.ActivationKey);
      }
      // this.navCtrl.navigateForward(['Recharges/activation-key', result.ActivationKey]);
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  async showAlert(actKey) {
    const alert = await this.alt.create({
      subHeader: this.actKeyString,
      message: actKey,
      buttons: ['Cancel']
    });
    await alert.present();
  }

  goToNew() {
    if (this.CategoryId.toString() === '1' || this.CategoryId.toString() === '2') {
      this.navCtrl.navigateForward(['Recharges/recharge-simple-new', this.CategoryId]);
    } else {
      this.navCtrl.navigateForward(['Recharges/recharge-simple-new']);
    }
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
    
    if (this.selectedData !== null && typeof (this.selectedData) !== 'undefined') {
      this.availButton = false;
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
    if (this.CategoryId.toString() === '1') {
      for (let i = 0; i < this.columns.length; i++) {
        this.gridWidth = this.gridWidth + this.columns[i].width;
      }
    } else {
      for (let i = 0; i < this.columnsOffline.length; i++) {
        this.gridWidth = this.gridWidth + this.columnsOffline[i].width;
      }
    }
  }

  exportData() {
    if (this.CategoryId.toString() === '1') {
      this.myGrid.exportview('xlsx', 'Online Vouchers');
    } else if (this.CategoryId.toString() === '2') {
      this.myGrid.exportview('xlsx', 'Offline Vouchers');
    }
  }

  setGridData() {
    if (this.CategoryId.toString() === '1') {
      for (const list of this.rechargeList) {
        const tempData = {
          id: list.Id,
          date_purchased: list.StartDateTime,
          recharge_name: list.Type,
          procedures_available: list.MainCurrencyAmount,
          price: this.globService.getCurrencyConfiguration(list.PriceIncTax),
        };
        this.source.localdata.push(tempData);
      }
    } else {
      for (const list of this.rechargeList) {
        const tempData = {
          id: list.Id,
          date_purchased: list.StartDateTime,
          recharge_name: list.Type,
          price: list.PriceIncTax,
        };
        this.sourceOffline.localdata.push(tempData);
      }
    }

    this.myGrid.updatebounddata();

    this.source.localdata.length = 0;
    this.sourceOffline.localdata.length = 0;
  }

  getCategoryText(value) {
    let keyString;
    if (value === '1') {
      keyString = this.onlineVouchers;
    } else if (value === '2') {
      keyString = this.offlineVouchers;
    } else {
      keyString = '';
    }
    return keyString;
  }

}
