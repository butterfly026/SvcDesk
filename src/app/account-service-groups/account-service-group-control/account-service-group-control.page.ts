import { Component, OnInit, Output, EventEmitter, ViewChild, ChangeDetectorRef, Input } from '@angular/core';

import * as moment from 'moment';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { ServiceGroup } from 'src/app/model';
import { NavController } from '@ionic/angular';
import { LoadingService, TranService } from 'src/services';

import { ConvertDateFormatService } from 'src/services/convert-dateformat.service';
import * as $ from 'jquery';
import { AccountServiceGroupControlService } from './services/account-service-group-control.service';
import { GlobalService } from 'src/services/global-service.service';

var accountServiceGroupControl = [];

@Component({
  selector: 'app-account-service-group-control',
  templateUrl: './account-service-group-control.page.html',
  styleUrls: ['./account-service-group-control.page.scss'],
})
export class AccountServiceGroupControlPage implements OnInit {

  @Input() ContactCode: string = '';
  @Output('AccountServiceGroupComponentValue') AccountServiceGroupComponentValue: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('ServiceGroupListGrid') ServiceGroupListGrid: jqxGridComponent;

  groupList: Array<ServiceGroup> = [];
  isDisabled: boolean = true;

  pageTitle: string = '';
  

  selectIndex: number;
  selectedData: any;
  gridWidth: any;
  gridContentWidth = '';
  customDate: Date;

  availDeleteState = false;


  // initeditor = function (row, column, editor) {
  // }

  // cellbeginedit = function (row) {
  //   if (typeof (accountServiceGroupControl[row]) !== 'undefined' && accountServiceGroupControl[row] !== null) {
  //     return accountServiceGroupControl[row];
  //   }
  // }

  // cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties) {
  //   if (typeof (accountServiceGroupControl[row]) !== 'undefined' && accountServiceGroupControl[row] !== null && !accountServiceGroupControl[row]) {
  //     return '<div style="height: 100%; background-color: #BBBBBB; display: flex; align-items: center; justify-content: start;"><span style="position: relative; margin-left: 4px;">' + value + '</span></div>';
  //   }
  // };

  source = {
    localdata: [],
    datafields: [
      { name: 'name', type: 'string', map: '0' },
      { name: 'status', type: 'string', map: '1' },
      { name: 'code', type: 'string', map: '2' },
      { name: 'email', type: 'string', map: '3' },
      { name: 'additional_information1', type: 'string', map: '4' },
      { name: 'additional_information2', type: 'string', map: '5' },
      { name: 'additional_information3', type: 'string', map: '6' },
      { name: 'end_date_time', type: 'string', map: '7' },
      { name: 'parent_id', type: 'string', map: '8' },
      { name: 'id', type: 'string', map: '9' },
      { name: 'lastupdated', type: 'string', map: '10' },
      { name: 'updatedby', type: 'string', map: '11' },
      { name: 'created_by', type: 'string', map: '12' },
      { name: 'created', type: 'string', map: '13' },
    ],
    datatype: 'array'
  };

  dataAdapter: any = new jqx.dataAdapter(this.source);

  columns = [
    { text: '', datafield: 'name', width: 180, },
    { text: '', datafield: 'status', width: 70, },
    { text: '', datafield: 'code', width: 100, },
    { text: '', datafield: 'email', width: 150, },
    { text: '', datafield: 'additional_information1', width: 170, },
    { text: '', datafield: 'additional_information2', width: 170, },
    { text: '', datafield: 'additional_information3', width: 170, },
    { text: '', datafield: 'end_date_time', width: 150, },
    { text: '', datafield: 'parent_id', width: 80, },
    { text: '', datafield: 'id', width: 50, },
    { text: '', datafield: 'lastupdated', width: 150, },
    { text: '', datafield: 'updatedby', width: 80, },
    { text: '', datafield: 'created_by', width: 80, },
    { text: '', datafield: 'created', width: 150, },
  ];
  onGoingStr: string = '';

  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    private aSGLService: AccountServiceGroupControlService,
    
    private cdr: ChangeDetectorRef,
    private convertService: ConvertDateFormatService,
    public globService: GlobalService,
  ) {

    this.tranService.translaterService();
    this.tranService.convertText('service_group_list').subscribe(value => {
      this.pageTitle = value;
    });

    
    this.setGridWidth();
    this.tranService.convertText('on_going').subscribe(result => {
      this.onGoingStr = result;
    });

    for (let i = 0; i < this.columns.length; i++) {
      this.tranService.convertText(this.columns[i].datafield).subscribe(value => {
        this.columns[i].text = value;
      });
    }

  }

  async getServiceGroupList() {
    this.groupList = [];
    await this.loading.present();
    this.aSGLService.ServiceGroupListContactCode(this.ContactCode).subscribe(async (result: ServiceGroup[]) => {
      
      await this.loading.dismiss();

      if (result === null) {
      } else {
        for (const list of result) {
          this.groupList.push(list);
        }
        this.bubbleSortDecrease();
        this.setGridData();
        setTimeout(() => {
          this.AccountServiceGroupComponentValue.emit('setBothHeight');
        }, 1000);
      }

    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  ngOnInit() {
    this.getServiceGroupList();
  }

  async delete() {
    await this.loading.present();
    this.aSGLService.ServiceGroupListDelete(this.selectedData.id).subscribe(async (result: ServiceGroup[]) => {
      
      await this.loading.dismiss();
      // this.ServiceGroupListGrid.refresh();
      // this.ServiceGroupListGrid.clear();
      this.customDate = new Date();
      this.customDate.setDate(this.customDate.getDate() + 1);
      this.getServiceGroupList();
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    })
  }


  bubbleSortIncrease() {
    let length = this.groupList.length;
    for (let i = 0; i < length; i++) { // Number of passes
      for (let j = 0; j < (length - i - 1); j++) { // Notice that j < (length - i)
        // Compare the adjacent positions
        if ((new Date(this.groupList[j].CancelledDatetime)).getTime()
          > (new Date(this.groupList[j + 1].CancelledDatetime)).getTime()) {
          // Swap the numbers
          let tmp = this.groupList[j];  // Temporary letiable to hold the current number
          this.groupList[j] = this.groupList[j + 1]; // Replace current number with adjacent number
          this.groupList[j + 1] = tmp; // Replace adjacent number with current number
        }
      }
    }
  }

  bubbleSortDecrease() {
    let length = this.groupList.length;
    for (let i = 0; i < length; i++) { // Number of passes
      for (let j = 0; j < (length - i - 1); j++) { // Notice that j < (length - i)
        // Compare the adjacent positions
        if ((new Date(this.groupList[j].CancelledDatetime)).getTime()
          < (new Date(this.groupList[j + 1].CancelledDatetime)).getTime()) {
          // Swap the numbers
          let tmp = this.groupList[j];  // Temporary letiable to hold the current number
          this.groupList[j] = this.groupList[j + 1]; // Replace current number with adjacent number
          this.groupList[j + 1] = tmp; // Replace adjacent number with current number
        }
      }
    }
  }

  getWidth() {
    let element = document.getElementById('accountServiceGroup');
    if (typeof (element) !== 'undefined' && element !== null) {
      return element.offsetWidth;
    } else {
      return 900;
    }
  }

  selectRow() {
    this.selectIndex = this.ServiceGroupListGrid.getselectedrowindex();
    this.selectedData = this.ServiceGroupListGrid.getrowdata(this.selectIndex);
    if (typeof (this.selectedData) !== 'undefined' && this.selectedData !== null) {
      this.availDeleteState = true;
    } else {
      this.availDeleteState = false;
    }
  }

  setGridWidth() {
    this.getGridWidth();
    if (this.getWidth() > this.gridWidth + 32) {
      const tempData = this.gridContentWidth;
      let scrollId = $('#jqxGridOption .jqx-scrollbar').attr('id');
      if (scrollId.includes('vertical')) {
        this.gridContentWidth = (this.gridWidth + 17) + 'px';
        if (tempData !== '' && tempData !== this.gridContentWidth) {
          this.cdr.detectChanges();
          this.setGridData();
          // jqx-scrollbar
        }
        return this.gridWidth + 17;
      } else {
        this.gridContentWidth = this.gridWidth + 'px';
        if (tempData !== '' && tempData !== this.gridContentWidth) {
          this.cdr.detectChanges();
          this.setGridData();
          // jqx-scrollbar
        }
        return this.gridWidth;
      }
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
      this.gridWidth = this.gridWidth + this.columns[i].width;
    }
  }

  exportData() {
    this.ServiceGroupListGrid.exportview('xlsx', 'Service Group List');
  }

  setGridData() {
    accountServiceGroupControl = [];
    for (const list of this.groupList) {
      let tempData = [];
      if (this.checkCancelledDate(new Date(list.CancelledDatetime))) {
        tempData = [
          list.Name, list.Status, list.Code, list.Email,
          list.AdditionalInformation1, list.AdditionalInformation2, list.AdditionalInformation3, this.onGoingStr,
          list.ParentId, list.Id,
          this.convertService.newDateFormat(list.LastUpdated),
          list.UpdatedBy,
          list.CreatedBy,
          this.convertService.newDateFormat(list.Created),
        ];
        accountServiceGroupControl.push(true);
        this.source.localdata.push(tempData);
      }
    }

    for (const list of this.groupList) {
      let tempData = [];
      if (this.checkCancelledDate(new Date(list.CancelledDatetime))) {
      } else {
        tempData = [
          list.Name, list.Status, list.Code,
          // moment(list.CancelledDatetime).format(this.convertService.getLocalDateFormat() + ' HH:mm'),
          list.Email,
          list.AdditionalInformation1, list.AdditionalInformation2, list.AdditionalInformation3,
          this.convertService.newDateFormat(list.CancelledDatetime),
          list.ParentId, list.Id,
          this.convertService.newDateFormat(list.LastUpdated),
          list.UpdatedBy,
          list.CreatedBy,
          this.convertService.newDateFormat(list.Created),
        ];
        accountServiceGroupControl.push(false);
        this.source.localdata.push(tempData);
      }
    }

    this.customDate = null;


    this.ServiceGroupListGrid.updatebounddata();

    this.source.localdata.length = 0;
    if (this.availDeleteState) {
      this.ServiceGroupListGrid.clearselection();
    }
    this.availDeleteState = false;
  }

  checkCancelledDate(date: Date) {
    const cancelDate = date.getTime();
    const currentDate = new Date().getTime();
    if (this.customDate !== null && typeof (this.customDate) !== 'undefined') {
      if (cancelDate > this.customDate.getTime()) {
        return true;
      } else {
        return false;
      }
    } else {
      if (cancelDate > currentDate) {
        return true;
      } else {
        return false;
      }
    }
  }

  gotoNew() {
    this.AccountServiceGroupComponentValue.emit('AddServiceGroup&');
  }

  update() {
    this.AccountServiceGroupComponentValue.emit('UpdateServiceGroup&' + this.selectedData.id);
  }

  goToServices() {
    // this.navCtrl.navigateForward(['ServiceGroups/ServiceServiceGroupAssignment', this.selectedData.id]);
    this.AccountServiceGroupComponentValue.emit('ServicesServiceGroup&' + this.selectedData.id);
  }

  goToBar() {
    // this.navCtrl.navigateForward(['ServiceGroups/ServiceGroupServiceBar', this.selectedData.id, this.selectedData.name]);
    this.AccountServiceGroupComponentValue.emit('BarServiceGroup&' + this.selectedData.id + '&' + this.selectedData.name);
  }

  goToUnbar() {
    // this.navCtrl.navigateForward(['ServiceGroups/ServiceGroupServiceUnBar', this.selectedData.id, this.selectedData.name]);
    this.AccountServiceGroupComponentValue.emit('UnbarServiceGroup&' + this.selectedData.id + '&' + this.selectedData.name);
  }

}
