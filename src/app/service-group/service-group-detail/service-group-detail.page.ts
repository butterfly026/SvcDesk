import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef } from '@angular/core';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { ServiceGroupItem, ServiceGroup } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';


import * as moment from 'moment';
import { AlertService } from 'src/services/alert-service.service';
import { ConvertDateFormatService } from 'src/services/convert-dateformat.service';
import { ServiceGroupDetailService } from './services/service-group-detail.service';
import { GlobalService } from 'src/services/global-service.service';

var temGroupList = [];

@Component({
  selector: 'app-service-group-detail',
  templateUrl: './service-group-detail.page.html',
  styleUrls: ['./service-group-detail.page.scss'],
})
export class ServiceGroupDetailPage implements OnInit {

  @Input() ContactCode: string = '';
  @Input() ServiceId: string = '';
  @Output('ServiceGroupComponentValue') public ServiceGroupComponentValue: EventEmitter<string> = new EventEmitter<string>();


  @ViewChild('ServiceGroupListGrid') ServiceGroupListGrid: jqxGridComponent;

  groupList: Array<ServiceGroupItem> = [];
  
  selectIndex: number;
  selectedData: any;
  gridWidth: any;
  gridContentWidth = '';
  assignList: Array<ServiceGroupItem> = [];
  availList: Array<ServiceGroup> = [];

  availDeleteState = false;
  availableAdd: boolean = false;

  initeditor = function (row, column, editor) {
  }

  cellbeginedit = function (row) {
    if (typeof (temGroupList[row]) !== 'undefined' && temGroupList[row] !== null) {
      return temGroupList[row];
    }
  }

  cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties) {
    if (typeof (temGroupList[row]) !== 'undefined' && temGroupList[row] !== null && !temGroupList[row]) {
      return '<div style="height: 100%; background-color: #BBBBBB; display: flex; align-items: center; justify-content: start;"><span style="position: relative; margin-left: 4px;">' + value + '</span></div>';
    }
  };

  source = {
    localdata: [],
    datafields: [
      // { name: 'id', type: 'string', map: '0' },
      // { name: 'serviceid', type: 'string', map: '1' },
      // { name: 'servicenumber', type: 'string', map: '2' },
      { name: 'service_group_name', type: 'string', map: '0' },
      { name: 'startdatetime', type: 'string', map: '1' },
      { name: 'end_date_time', type: 'string', map: '2' },
      { name: 'service_group_id', type: 'string', map: '3' },
      // { name: 'created', type: 'string', map: '10' },
      // { name: 'created_by', type: 'string', map: '11' },
      // { name: 'lastupdated', type: 'string', map: '12' },
      // { name: 'updatedby', type: 'string', map: '13' },
    ],
    datatype: 'array'
  };

  dataAdapter: any = new jqx.dataAdapter(this.source);

  columns = [
    // { text: '', datafield: 'id', width: 80 },
    // { text: '', datafield: 'serviceid', width: 80 },
    // { text: '', datafield: 'servicenumber', width: 100 },
    { text: '', datafield: 'service_group_name', width: 200, initeditor: this.initeditor, cellbeginedit: this.cellbeginedit, cellsrenderer: this.cellsrenderer },
    { text: '', datafield: 'startdatetime', width: 200, initeditor: this.initeditor, cellbeginedit: this.cellbeginedit, cellsrenderer: this.cellsrenderer },
    { text: '', datafield: 'end_date_time', width: 200, initeditor: this.initeditor, cellbeginedit: this.cellbeginedit, cellsrenderer: this.cellsrenderer },
    { text: '', datafield: 'service_group_id', width: 200, initeditor: this.initeditor, cellbeginedit: this.cellbeginedit, cellsrenderer: this.cellsrenderer },
    // { text: '', datafield: 'created', width: 100 },
    // { text: '', datafield: 'created_by', width: 100 },
    // { text: '', datafield: 'lastupdated', width: 100 },
    // { text: '', datafield: 'updatedby', width: 100 },
  ];

  onGoingStr: string = '';

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    
    private cdr: ChangeDetectorRef,
    private serviceGroupService: ServiceGroupDetailService,
    private alert: AlertService,
    private convertService: ConvertDateFormatService,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    
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

  ngOnInit() {
    // this.getServiceGroupList();
    this.getAssignedServiceGrouptList();
  }

  async getAssignedServiceGrouptList() {


    this.assignList = [];
    this.groupList = [];
    await this.loading.present();
    this.serviceGroupService.ServiceAssignedServiceGroups(this.ServiceId).subscribe(async (result: ServiceGroupItem[]) => {
      
      await this.loading.dismiss();

      if (result === null) {
      } else {
        for (const list of result) {
          this.groupList.push(list);
          this.assignList.push(list);
        }
        this.getServiceGroupList();
        this.setGridData();
      }

    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  checkCancelledDate(date: Date) {
    const cancelDate = date.getTime();
    const currentDate = new Date().getTime();
    if (cancelDate > currentDate) {
      return true;
    } else {
      return false;
    }
  }

  getWidth() {
    let elements = document.getElementsByClassName('ess-service-group');
    if (elements.length > 0) {
      let element = elements[0] as HTMLInputElement;
      return element.offsetWidth;
    } else {
      return 900;
    }
  }

  selectRow() {
    let previousIndex = this.selectIndex;
    this.selectIndex = this.ServiceGroupListGrid.getselectedrowindex();
    this.selectedData = this.ServiceGroupListGrid.getrowdata(this.selectIndex);
    if (typeof (this.selectedData) !== 'undefined' && this.selectedData !== null) {
      if (this.selectedData.end_date_time !== this.onGoingStr) {
        this.availDeleteState = false;
        this.ServiceGroupListGrid.clearselection();
        if (typeof (previousIndex) !== 'undefined' && previousIndex !== null) {
          this.ServiceGroupListGrid.selectrow(previousIndex);
        }
      } else {
        this.availDeleteState = true;
      }
    } else {
      this.availDeleteState = false;
    }

    this.selectIndex = this.ServiceGroupListGrid.getselectedrowindex();
    this.selectedData = this.ServiceGroupListGrid.getrowdata(this.selectIndex);
    if (typeof (this.selectedData) !== 'undefined' && this.selectedData !== null) {
      if (this.selectedData.end_date_time !== this.onGoingStr) {
        this.availDeleteState = false;
        this.ServiceGroupListGrid.clearselection();
      } else {
        this.availDeleteState = true;
      }
    } else {
      this.availDeleteState = false;
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
    temGroupList = [];
    for (const list of this.groupList) {
      let tempData = [];
      if (this.checkCancelledDate(new Date(list.EndDateTime))) {
        tempData = [
          list.ServiceGroupName,
          // moment(list.StartDateTime).format(this.convertService.getLocalDateFormat() + ' HH:mm'),
          list.StartDateTime,
          this.onGoingStr, list.ServiceGroupId,
        ];
        temGroupList.push(true);
        this.source.localdata.push(tempData);
      }
    }

    for (const list of this.groupList) {
      let tempData = []; ``
      if (this.checkCancelledDate(new Date(list.EndDateTime))) {
      } else {
        tempData = [
          list.ServiceGroupName,
          // moment(list.StartDateTime).format(this.convertService.getLocalDateFormat() + ' HH:mm'),
          list.StartDateTime,
          // moment(list.EndDateTime).format(this.convertService.getLocalDateFormat() + ' HH:mm'),
          list.EndDateTime,
          list.ServiceGroupId,
        ];
        temGroupList.push(false);
        this.source.localdata.push(tempData);
      }
    }


    this.ServiceGroupListGrid.updatebounddata();

    this.source.localdata.length = 0;
    if (this.availDeleteState) {
      this.ServiceGroupListGrid.clearselection();
    }
    this.availDeleteState = false;
  }

  async removeService() {
    
    let currentDate = new Date();
    // currentDate.setDate(currentDate.getDate() + 1);
    let convertedDate = currentDate.toISOString();

    let reqParam = {
      ServiceGroupId: parseInt(this.selectedData.service_group_id),
      ServiceId: parseInt(this.ServiceId),
      // StartDatetime: convertedDate.split('T')[0] + ' 00:00:00',
      // EndDatetime: ''
      // StartDatetime: moment(convertedDate).format('YYYY/MM/DD') + ' ' + moment(currentDate).format('HH:mm:ss')
    }


    await this.loading.present();
    this.serviceGroupService.ServiceGroupUnAssignService(reqParam).subscribe(async (result: any) => {
      

      await this.loading.dismiss();
      // this.ServiceGroupListGrid.clear();
      this.getAssignedServiceGrouptList();
      // this.ServiceGroupComponentValue.emit('refresh');

    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  goToAddService() {
  
    this.ServiceGroupComponentValue.emit('AddService');
  }

  getServiceGroupList() {
    this.availList = [];
    this.serviceGroupService.ServiceGroupListContactCode(this.ContactCode).subscribe((result: ServiceGroup[]) => {
      

      if (result === null) {
      } else {
        for (const list of result) {
          if (this.checkCancelledDate(new Date(list.CancelledDatetime))) {
            let availPush = true;
            for (let assignlist of this.assignList) {
              if (list.Id.toString() === assignlist.ServiceGroupId.toString()) {
                availPush = false;
              }
            }
            if (availPush) {
              this.availList.push(list);
            }
          }
        }
      }

    }, (error: any) => {
      
      this.tranService.errorMessage(error);
    }, () => {
    });
  }

}
