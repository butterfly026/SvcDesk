import { Component, OnInit, ChangeDetectorRef, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { ServiceDeskListPaymentService } from './services/list-payment.service';
import { NavController } from '@ionic/angular';
import { TranService, LoadingService, ToastService } from 'src/services';

import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { ActivatedRoute } from '@angular/router';
import { ErrorItems, PaymentItem } from 'src/app/model';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-list-payment',
  templateUrl: './list-payment.page.html',
  styleUrls: ['./list-payment.page.scss'],
})
export class ListPaymentPage implements OnInit {


  @Input() ContactCode: string = '';

  @Output('setComponentValue') public componentValue: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('PaymentList') PaymentList: jqxGridComponent;

  paymentList: Array<PaymentItem> = [];
  pageTitle: string = '';

  

  debitRunTitle = '';

  selectIndex: number;
  selectedData: any;
  gridWidth: any;
  gridContentWidth = '';


  source = {
    localdata: [],
    datafields: [
      { name: 'type', type: 'string', map: '0' },
      { name: 'name', type: 'string', map: '1' },
      { name: 'number', type: 'string', map: '2' },
      { name: 'bsb_exp_date', type: 'string', map: '3' },
      { name: 'start', type: 'string', map: '4' },
      { name: 'end', type: 'string', map: '5' },
      { name: 'status', type: 'string', map: '6' },
      { name: 'usage', type: 'string', map: '7' },
      { name: 'used', type: 'bool', map: '8' },
      { name: 'usage_ref', type: 'string', map: '9' },
      { name: 'protected', type: 'string', map: '10' },
      { name: 'component', type: 'string', map: '11' }
    ],
    datatype: 'array'
  };

  dataAdapter: any = new jqx.dataAdapter(this.source);

  columns = [
    { text: '', datafield: 'type', width: 80 },
    { text: '', datafield: 'name', width: 180 },
    { text: '', datafield: 'number', width: 100 },
    { text: '', datafield: 'bsb_exp_date', width: 130 },
    { text: '', datafield: 'start', width: 180 },
    { text: '', datafield: 'end', width: 100 },
    { text: '', datafield: 'status', width: 80 },
    { text: '', datafield: 'usage', width: 100 },
    { text: '', datafield: 'used', columntype: 'checkbox', cellsalign: 'center', width: 50 },
    { text: '', datafield: 'usage_ref', width: 90 },
    { text: '', datafield: 'protected', width: 90 },
    { text: '', datafield: 'component', width: 100 }
  ];

  constructor(
    public navCtrl: NavController,
    private tranService: TranService,
    private loading: LoadingService,
    private toast: ToastService,
    private cCLPService: ServiceDeskListPaymentService,
    
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    this.setGridWidth();
    

    for (let i = 0; i < this.columns.length; i++) {
      this.tranService.convertText(this.columns[i].datafield).subscribe(value => {
        this.columns[i].text = value;
      });
    }

  }

  ngOnInit() {
    this.getGridData();
  }

  async getGridData() {
    await this.loading.present();
    this.cCLPService.getPaymentList(this.ContactCode).subscribe(async (result: PaymentItem[]) => {
      await this.loading.dismiss();
      
      if (result === null) {
        this.tranService.errorMessage('no_payments');
      } else {
        for (const list of result) {
          this.paymentList.push(list);
        }
        this.setGridData();
        this.PaymentList.selectrow(0);
      }

    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  setGridData() {
    for (const list of this.paymentList) {
      const tempData = [
        list.Type, list.Name, list.Number, list.BSBExpDate, list.Start,
        list.End, list.Status, list.Usage, list.Used, list.UsageRef, list.Protected,
        list.Component
      ];
      this.source.localdata.push(tempData);
    }
    this.PaymentList.updatebounddata();

    this.source.localdata.length = 0;
  }

  goBack() {
    this.componentValue.emit('closeTab');
  }

  selectRow() {
    this.selectIndex = this.PaymentList.getselectedrowindex();
    this.selectedData = this.PaymentList.getrowdata(this.selectIndex);
    
  }

  goToUpdate() {
    this.selectRow();
    const debitStepId = this.selectedData.usage_ref;
    // this.navCtrl.navigateForward(['ServiceDesk/update-payment', debitStepId]);
    this.componentValue.emit(debitStepId);
  }

  goToNew() {
    // this.navCtrl.navigateForward(['ServiceDesk/new-payment']);
    this.componentValue.emit('new_payment');
  }

  Columnresized(event: any): void {
    
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
    for (let i = 0; i < this.columns.length; i++) {
      this.gridWidth = this.gridWidth + this.columns[i].width;
    }
  }

  exportData() {
    this.PaymentList.exportview('xlsx', 'Payment List');
  }


}
