import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef } from '@angular/core';



import * as moment from 'moment';
import { ConvertDateFormatService } from 'src/services/convert-dateformat.service';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { ServiceGroupItem, ServiceGroup } from 'src/app/model';
import { NavController } from '@ionic/angular';
import { LoadingService, TranService } from 'src/services';

import { ServiceGroupAssignedService } from './services/service-group-assigned.service';
import { GlobalService } from 'src/services/global-service.service';

var accountTempList = [];

@Component({
  selector: 'app-service-group-assigned-services',
  templateUrl: './service-group-assigned-services.page.html',
  styleUrls: ['./service-group-assigned-services.page.scss'],
})
export class ServiceGroupAssignedServicesPage implements OnInit {

  @Input() ContactCode: string = '';
  @Input() ServiceId: any = '';
  @Output('ServiceAssignGroupComponent') ServiceAssignGroupComponent: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('SvcSvcGroupAssignGrid') SvcSvcGroupAssignGrid: jqxGridComponent;

  groupList: Array<ServiceGroupItem> = [];
  isDisabled: boolean = true;

  pageTitle: string = '';
  

  selectIndex: number;
  selectedData: any;
  gridWidth: any;
  gridContentWidth = '';

  gridWidth2: any;
  gridContentWidth2 = '';


  rowList = ['10', '20', '50', '100'];
  maxPageRow: any;
  rowStep = '10';

  backSymbol = '⮜';
  forwardSymbol = '⮞';
  pageRowNumber = 1;


  SkipRecords = 0;
  TakeRecords = 10;
  stepCount = 1;
  pageNumber = 1;

  startIndex = 0;
  endIndex: number;
  totalLength: number;
  keyPress: boolean = false;

  availDeleteState = false;
  removeStr: string = '';

  onGoingStr: string = '';

  source = {
    localdata: [],
    datafields: [
      // { name: 'Id', type: 'string', map: '0' },
      { name: 'ServiceNumber', type: 'string', map: '0' },
      { name: 'StartDateTime', type: 'string', map: '1' },
      { name: 'EndDateTime', type: 'string', map: '2' },
      { name: 'Created', type: 'string', map: '3' },
      { name: 'ServiceId', type: 'string', map: '4' },
      // { name: 'remove', type: 'boolean', map: '6' },
    ],
    datatype: 'array'
  };

  dataAdapter: any = new jqx.dataAdapter(this.source);

  columns = [
    // { text: '', datafield: 'Id', width: 80, editable: false },
    {
      text: '', datafield: 'ServiceNumber', width: 120, editable: false,
    },
    {
      text: '', datafield: 'StartDateTime', width: 150, editable: false,
    },
    {
      text: '', datafield: 'EndDateTime', width: 120, editable: false,
    },
    {
      text: '', datafield: 'Created', width: 150, editable: false,
    },
    {
      text: '', datafield: 'ServiceId', width: 80, editable: false,
    },
  ];

  ServiceGroupId: string = '';
  ServiceGroupName: string = '';

  showAddNew: string = '';

  checkValueList: any[] = [];

  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    private sGALService: ServiceGroupAssignedService,
    
    private cdr: ChangeDetectorRef,
    private convertService: ConvertDateFormatService,
    public globService: GlobalService,
  ) {

    this.tranService.translaterService();
    this.tranService.convertText('remove').subscribe(result => {
      this.removeStr = result;
    });

    

    this.tranService.convertText('on_going').subscribe(result => {
      this.onGoingStr = result;
    });

    this.setGridWidth();
    for (let i = 0; i < this.columns.length; i++) {
      this.tranService.convertText(this.columns[i].datafield).subscribe(value => {
        if (value !== 'buttons') {
          this.columns[i].text = value;
        } else {
          this.columns[i].text = ''
        }
      });
    }

  }
  ngOnInit() {
    this.getGroupDetail();
    this.getList();
    this.cellChange();

    this.tranService.convertText('empty_service_group_grid_text').subscribe(result => {
      let localizationObj = {};
      localizationObj['emptydatastring'] = result;
      this.SvcSvcGroupAssignGrid.localizestrings(localizationObj);
    });
  }

  goBack() {
    this.ServiceAssignGroupComponent.emit('closeServices');
  }

  getGroupDetail() {

    this.sGALService.GetServiceGroupListGroupId(this.ServiceId).subscribe((result: ServiceGroup) => {
      
      if (result === null) {
      } else {
        this.ServiceGroupId = (result.Id).toString();
        this.ServiceGroupName = result.Name;
      }

    }, (error: any) => {
      
      this.tranService.errorMessage(error);
    }, () => {
    });
  }

  async getList() {

    this.groupList = [];
    await this.loading.present();
    const reqData = {
      serviceId: this.ServiceId,
      SkipRecords: this.startIndex,
      TakeRecords: this.rowStep,
    }
    this.sGALService.ServiceServiceGroupAssignment(reqData).subscribe(async (result: ServiceGroupItem[]) => {
      
      setTimeout(async () => {
        await this.loading.dismiss();
        this.ServiceAssignGroupComponent.emit('setMinHeight');
      }, 2000);

      setTimeout(() => {
        this.ServiceAssignGroupComponent.emit('setMinHeight');
      }, 1000);

      if (result === null) {
      } else {
        for (const list of result) {
          this.groupList.push(list);
        }
        this.totalLength = this.groupList.length;
        if (this.totalLength % parseInt(this.rowStep, 10) === 0) {
          this.maxPageRow = this.totalLength / parseInt(this.rowStep, 10);
        } else {
          this.maxPageRow = Math.floor(this.totalLength / parseInt(this.rowStep, 10)) + 1;
        }
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
    let element = document.getElementById('accountAssignService');
    if (typeof (element) !== 'undefined' && element !== null) {
      return element.offsetWidth;
    } else {
      return 900;
    }
  }

  selectRow() {
    this.selectIndex = this.SvcSvcGroupAssignGrid.getselectedrowindex();
    this.selectedData = this.SvcSvcGroupAssignGrid.getrowdata(this.selectIndex);
    if (typeof (this.selectedData) !== 'undefined' && this.selectedData !== null) {
      this.availDeleteState = true;
    } else {
      this.availDeleteState = false;
    }
  }

  cellChange() {
    this.checkValueList = [];
    for (let list of this.dataAdapter.records) {
      if (list.remove) {
        this.checkValueList.push(list);
      }
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
    this.SvcSvcGroupAssignGrid.exportview('xlsx', 'Servic Service Group Assignment List');
  }

  setGridData() {

    accountTempList = [];
    if (this.totalLength % parseInt(this.rowStep, 10) === 0) {
      this.maxPageRow = this.totalLength / parseInt(this.rowStep, 10);
    } else {
      this.maxPageRow = Math.floor(this.totalLength / parseInt(this.rowStep, 10)) + 1;
    }

    this.endIndex = this.startIndex + parseInt(this.rowStep, 10);
    if (this.totalLength > 0) {
      if (this.startIndex > -1) {
        if (this.endIndex < this.totalLength) {
        } else {
          this.endIndex = this.totalLength;
        }
      }
    }

    for (const list of this.groupList) {
      let tempData = [];
      if (this.checkCancelledDate(new Date(list.EndDateTime))) {
        tempData = [
          list.ServiceNumber,
          // moment(list.StartDateTime).format(this.convertService.getLocalDateFormat() + ' HH:mm'),
          this.convertService.newDateFormat(list.StartDateTime),
          this.onGoingStr,
          // moment(list.Created).format(this.convertService.getLocalDateFormat() + ' HH:mm'), 
          list.Created,
          list.ServiceId,
        ];
        accountTempList.push(true);
        this.source.localdata.push(tempData);
      }
    }

    for (const list of this.groupList) {
      let tempData = [];
      if (!this.checkCancelledDate(new Date(list.EndDateTime))) {
        tempData = [
          list.ServiceNumber,
          // moment(list.StartDateTime).format(this.convertService.getLocalDateFormat() + ' HH:mm'),
          this.convertService.newDateFormat(list.StartDateTime),
          // moment(list.EndDateTime).format(this.convertService.getLocalDateFormat() + ' HH:mm'),
          this.convertService.newDateFormat(list.EndDateTime),
          // moment(list.Created).format(this.convertService.getLocalDateFormat() + ' HH:mm'),
          list.Created,
          list.ServiceId,
        ];
        accountTempList.push(false);
        this.source.localdata.push(tempData);
      }
    }

    this.SvcSvcGroupAssignGrid.updatebounddata();
    this.source.localdata.length = 0;
    if (this.availDeleteState) {
      this.SvcSvcGroupAssignGrid.clearselection();
    }
    this.availDeleteState = false;
  }

  reduceList() {
    if (this.startIndex - parseInt(this.rowStep, 10) > -1) {
      this.startIndex = this.startIndex - parseInt(this.rowStep, 10);
    } else {
      this.startIndex = 0;
    }
    if (this.pageRowNumber > 0) {
      this.pageRowNumber = this.pageRowNumber - 1;
      this.getList();
    }
  }

  increaseList() {
    if (this.startIndex + parseInt(this.rowStep, 10) < this.totalLength) {
      this.startIndex = this.startIndex + parseInt(this.rowStep, 10);
    } else {
    }
    this.pageRowNumber = this.pageRowNumber + 1;
    this.getList();
  }

  changePageNumber(event: any) {
    if (this.pageRowNumber < 1) {
      if (event != null && typeof (event.srcElement) !== 'undefined') {
        event.srcElement.value = 1;
        this.pageRowNumber = 1;
      }
    }
    if (this.pageRowNumber > this.maxPageRow) {
      if (event != null && typeof (event.srcElement) !== 'undefined') {
        event.srcElement.value = this.maxPageRow;
        this.pageRowNumber = this.maxPageRow;
      }
    }

    this.startIndex = (this.pageRowNumber - 1) * parseInt(this.rowStep, 10);
    if (event.key === 'Enter') {
      this.keyPress = true;
      this.getList();
    }
  }

  focusChangePage() {

  }

  focusOutChangePage() {
    if (!this.keyPress) {
      this.startIndex = (this.pageRowNumber - 1) * parseInt(this.rowStep, 10);
      this.getList();
    }
  }

  changeRowStep() {
    this.startIndex = 0;
    this.pageRowNumber = 1;
    this.getList();
  }

  goToAddService() {
    this.ServiceAssignGroupComponent.emit(this.ServiceGroupId);
  }

  async removeService() {
    let currentDate = new Date();
    let convertedDate = currentDate.toISOString();

    let reqParam = {
      // Id: this.groupList[this.selectIndex].Id,
      serviceGroupId: parseInt(this.ServiceGroupId),
      serviceId: parseInt(this.selectedData.ServiceId),
      // EndDatetime: moment(convertedDate).format('YYYY/MM/DD') + ' ' + moment(currentDate).format('HH:mm:ss')
      endDateTime: convertedDate
    }

    await this.loading.present();
    this.sGALService.ServiceGroupUnAssignService(reqParam).subscribe((result: any) => {
      
      this.getList();

    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

}
