import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { SpendNotificationHistoryService } from './services/spend-notification-history.service';
import { NavController } from '@ionic/angular';
import { LoadingService, TranService } from 'src/services';

import { NotificationHistoryItem } from 'src/app/model';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-spend-notification-history',
  templateUrl: './spend-notification-history.page.html',
  styleUrls: ['./spend-notification-history.page.scss'],
})
export class SpendNotificationHistoryPage implements OnInit {

  @ViewChild('myGridNotHistory') myGridNotHistory: jqxGridComponent;

  notHistory: Array<NotificationHistoryItem> = [];

  pageTitle: string = '';
  

  selectIndex: number;
  selectedData: any;
  gridWidth: any;
  gridContentWidth = '';

  source = {
    localdata: [],
    datafields: [
      { name: 'id', type: 'string', map: '0' },
      { name: 'bill_period', type: 'string', map: '1' },
      { name: 'created_date', type: 'string', map: '2' },
      { name: 'discount_id', type: 'string', map: '3' },
      { name: 'discount_narrative', type: 'string', map: '4' },
      { name: 'alert_type', type: 'string', map: '5' },
      { name: 'alert_level', type: 'string', map: '6' },
      { name: 'usage_level', type: 'string', map: '7' },
      { name: 'usage_amount', type: 'string', map: '8' },
      { name: 'bundle_amount', type: 'string', map: '9' },
      { name: 'narrative', type: 'string', map: '10' },
      { name: 'created', type: 'string', map: '11' },
      { name: 'created_by', type: 'string', map: '12' },
      { name: 'lastupdated', type: 'string', map: '13' },
      { name: 'updatedby', type: 'string', map: '14' },
    ],
    datatype: 'array'
  };

  dataAdapter: any = new jqx.dataAdapter(this.source);

  columns = [
    { text: '', datafield: 'id', width: 50 },
    { text: '', datafield: 'bill_period', width: 90 },
    { text: '', datafield: 'created_date', width: 100 },
    { text: '', datafield: 'discount_id', width: 100 },
    { text: '', datafield: 'discount_narrative', width: 130 },
    { text: '', datafield: 'alert_type', width: 100 },
    { text: '', datafield: 'alert_level', width: 100 },
    { text: '', datafield: 'usage_level', width: 120 },
    { text: '', datafield: 'usage_amount', width: 130 },
    { text: '', datafield: 'bundle_amount', width: 130 },
    { text: '', datafield: 'narrative', width: 100 },
    { text: '', datafield: 'created', width: 80 },
    { text: '', datafield: 'created_by', width: 100 },
    { text: '', datafield: 'lastupdated', width: 100 },
    { text: '', datafield: 'updatedby', width: 100 },
  ];

  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    private sNHService: SpendNotificationHistoryService,
    
    private cdr: ChangeDetectorRef,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('spend_notification_history').subscribe(value => {
      this.pageTitle = value;
    });
    

    this.setGridWidth();

    for (let i = 0; i < this.columns.length; i++) {
      this.tranService.convertText(this.columns[i].datafield).subscribe(value => {
        this.columns[i].text = value;
      });
    }
    this.getNotHistory();
  }

  ngOnInit() {
  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  async getNotHistory() {
    this.notHistory = [];
    await this.loading.present();
    this.sNHService.getHistory().subscribe(async (result: NotificationHistoryItem[]) => {
      
      await this.loading.dismiss();
      if (result === null) {
        this.tranService.errorMessage('no_notification_history');
      } else {
        for (const list of result) {
          this.notHistory.push(list);
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
    this.selectIndex = this.myGridNotHistory.getselectedrowindex();
    this.selectedData = this.myGridNotHistory.getrowdata(this.selectIndex);
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
    this.myGridNotHistory.exportview('xlsx', 'Spend Notificatin History');
  }

  setGridData() {
    for (const list of this.notHistory) {
      const tempData = [
        list.Id, list.BillPeriod, list.CreatedDate, list.DiscountId, list.DiscountNarrative,
        list.AlertType, list.AlertLevel, list.UsageAmount, list.BundleAmount, list.Narrative,
        list.Created, list.CreatedBy, list.LastUpdated, list.UpdatedBy
      ];
      this.source.localdata.push(tempData);
    }

    this.myGridNotHistory.updatebounddata();

    this.source.localdata.length = 0;
  }

  goBack() {
    this.navCtrl.pop();
  }

  configration() {

  }

}
