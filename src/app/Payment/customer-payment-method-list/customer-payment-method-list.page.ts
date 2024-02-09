import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CustomerPaymentMethodListItem, RechargeListItem, ErrorItems } from 'src/app/model';
import { CustomerPaymentMethodListService } from './services/customer-payment-method-list';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { NavController } from '@ionic/angular';
import { ToastService, LoadingService, TranService } from 'src/services';

import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-customer-payment-method-list',
  templateUrl: './customer-payment-method-list.page.html',
  styleUrls: ['./customer-payment-method-list.page.scss'],
})
export class CustomerPaymentMethodListPage implements OnInit {
  @ViewChild('myGrid') myGrid: jqxGridComponent;

  customerList: Array<CustomerPaymentMethodListItem> = [];
  pageTitle: string = '';

  
  toggleValue: boolean = false;
  isDisabled: boolean = true;

  selectIndex: number;
  selectedData: any;
  gridWidth: any;
  gridContentWidth = '';

  source = {
    localdata: [],
    datafields: [
      { name: 'id_up', type: 'string', map: '0' },
      { name: 'category_code', type: 'string', map: '1' },
      { name: 'payment_method_code', type: 'string', map: '2' },
      { name: 'description', type: 'float', map: '3' },
      { name: 'account_name', type: 'string', map: '4' },
      { name: 'account_number', type: 'string', map: '5' },
      { name: 'expiry_date', type: 'string', map: '6' },
      { name: 'bsb', type: 'string', map: '7' },
      { name: 'status_code', type: 'string', map: '8' },
      { name: 'status', type: 'string', map: '9' },
      { name: 'masked', type: 'string', map: '10' },
      { name: 'token', type: 'string', map: '11' },
    ],
    datatype: 'array'
  };

  dataAdapter: any = new jqx.dataAdapter(this.source);

  columns = [
    { text: '', datafield: 'id_up', width: 80 },
    { text: '', datafield: 'category_code', width: 100 },
    { text: '', datafield: 'payment_method_code', width: 150 },
    { text: '', datafield: 'description', width: 90 },
    { text: '', datafield: 'account_name', width: 150 },
    { text: '', datafield: 'account_number', width: 180 },
    { text: '', datafield: 'expiry_date', width: 90 },
    { text: '', datafield: 'bsb', width: 80 },
    { text: '', datafield: 'status_code', width: 100 },
    { text: '', datafield: 'status', width: 80 },
    { text: '', datafield: 'masked', width: 80 },
    { text: '', datafield: 'token', width: 60 },
  ];

  constructor(
    private navCtrl: NavController,
    private toast: ToastService,
    private loading: LoadingService,
    private tranService: TranService,
    private cPMListService: CustomerPaymentMethodListService,
    
    private cdr: ChangeDetectorRef,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('customer_payment_method_list').subscribe(value => {
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
    this.cPMListService.getMethodList().subscribe(async (result: CustomerPaymentMethodListItem[]) => {
      
      await this.loading.dismiss();
      if (result === null) {
        this.tranService.errorMessage('customer_payment_method_list');
      } else {
        for (const list of result) {
          this.customerList.push(list);
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

  goToAdd() {
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
      this.isDisabled = false;
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
    this.myGrid.exportview('xlsx', 'Customer Payment Method List');
  }

  setGridData() {
    for (const list of this.customerList) {
      const tempData = [
        list.id, list.CategoryCode, list.PaymentMethodCode, list.Description, list.AccountName, list.AccountNumber,
        list.ExpiryDate, list.BSB, list.StatusCode, list.Status, list.Masked, list.Token,
      ];
      this.source.localdata.push(tempData);
    }

    this.myGrid.updatebounddata();

    this.source.localdata.length = 0;
  }

  onChange() {
  }

}
