import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { ServiceItem, ServiceGroupItem, ServiceGroup } from 'src/app/model';
import { NavController } from '@ionic/angular';
import { TranService, LoadingService, ToastService } from 'src/services';

import { ActivatedRoute } from '@angular/router';
import { AccountServiceGroupService } from '../../services/account-service-group.service';
import * as $ from 'jquery';
import { AccountServiceAddService } from './services/account-service-add.service';
import { GlobalService } from 'src/services/global-service.service';



var temGroupList = [];
var disabledRow;

var selectedGroup = [];
var rowData: any;


@Component({
  selector: 'app-account-service-add',
  templateUrl: './account-service-add.page.html',
  styleUrls: ['./account-service-add.page.scss'],
})
export class AccountServiceAddPage implements OnInit {

  @Input() ServiceId: string = '';
  @Output('AccountAssignServiceAddComponent') AccountAssignServiceAddComponent: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('ServiceAddGrid') ServiceAddGrid: jqxGridComponent;
  
  pageTitle: string = '';

  groupList: Array<ServiceItem> = [];



  addedStr: string = '';
  addServiceStr: string = '';

  addedServiceList: Array<ServiceGroupItem> = [];
  ServiceGroupName: string = '';
  minDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());
  maxDate = new Date(2100, 12, 31);
  startDate: Date;

  source = {
    localdata: [],
    datafields: [
      { name: 'ServiceNumber', type: 'date', map: '0' },
      { name: 'ServiceType', type: 'string', map: '1' },
      { name: 'Status', type: 'string', map: '2' },
      { name: 'Id', type: 'string', map: '3' },
    ],
    datatype: 'array'
  };

  dataAdapter: any = new jqx.dataAdapter(this.source);

  columns = [
    {
      text: '', datafield: 'ServiceNumber', width: 100, editable: false,
    },
    {
      text: '', datafield: 'ServiceType', width: 120, editable: false,
    },
    {
      text: '', datafield: 'Status', width: 100, editable: false,
    },
    {
      text: '', datafield: 'Id', width: 80, editable: false,
    },
  ];

  selectIndex: number;
  selectedData: any;
  gridWidth: any;
  gridContentWidth = '';

  availableAdd: boolean = false;

  currentSelGroup: any[] = [];



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


  constructor(
    public navCtrl: NavController,
    private tranService: TranService,
    private loading: LoadingService,
    private toast: ToastService,
    private sGService: AccountServiceAddService,
    
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    
    this.tranService.convertText('add_service').subscribe(result => {
      this.pageTitle = result;
    });
    // this.ServiceGroupId = this.route.snapshot.params['Id'];
    this.startDate = this.minDate;
    for (let list of this.columns) {
      this.tranService.convertText(list.datafield).subscribe(result => {
        if (list.datafield !== 'button') {
          list.text = result;
        }
      });
    }

    this.tranService.convertText('already_added').subscribe(result => {
      this.addedStr = result;
    });

    this.tranService.convertText('add_service').subscribe(result => {
      this.addServiceStr = result;
    });
  }

  async getAddedService() {
    this.addedServiceList = [];
    await this.loading.present();
    const reqData = {
      serviceId: this.ServiceId,
      SkipRecords: this.startIndex,
      TakeRecords: this.rowStep,
    }
    this.sGService.ServiceServiceGroupAssignment(reqData).subscribe(async (result: ServiceGroupItem[]) => {
      

      if (result === null) {
      } else {
        this.addedServiceList = result;
      }
      this.getServiceList();
    }, (error: any) => {
      this.getServiceList();
      
      this.tranService.errorMessage(error);
    });
  }

  getServiceList() {
    temGroupList = [];
    this.sGService.getServiceList().subscribe(async (result: ServiceItem[]) => {
      
      await this.loading.dismiss();

      if (result === null) {
        this.tranService.errorMessage('no_service_list');
      } else {
        for (const list of result) {
          if (Math.abs(parseInt(this.removeSpace(list.Id))) > 0) {
            let availPush = true;
            for (let availList of (this.addedServiceList)) {
              if (this.removeSpace(list.Id).toString() === (availList.ServiceId).toString() && !this.checkCancelledDate(new Date(availList.EndDateTime))) {
                availPush = false;
              }
            }
            list.Id = this.removeSpace(list.Id);
            list.Label = this.removeSpace(list.Label);
            list.ServiceType = this.removeSpace(list.ServiceType);
            list.Status = this.removeSpace(list.Status);
            this.groupList.push(list);
            temGroupList.push(availPush);
          }
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

  ngOnInit() {
    this.setGridWidth();
    this.getAddedService();
    this.getGroupDetail();
  }

  getGroupDetail() {

    this.sGService.GetServiceGroupListGroupId(this.ServiceId).subscribe((result: ServiceGroup) => {
      
      if (result === null) {
      } else {
        this.ServiceGroupName = result.Name;
      }

    }, (error: any) => {
      
      this.tranService.errorMessage(error);
    }, () => {
    });
  }

  cellChange(event) {
  }

  checkedBox() {
    this.currentSelGroup = selectedGroup;
  }

  exportData() {
    this.ServiceAddGrid.exportview('xlsx', 'Servic Service Group Assignment List');
  }

  getWidth() {
    let element = document.getElementById('accountServiceAdd');
    if (typeof (element) !== 'undefined' && element !== null) {
      return element.offsetWidth;
    } else {
      return 900;
    }
  }

  selectRow() {
    this.selectIndex = this.ServiceAddGrid.getselectedrowindex();
    this.selectedData = this.ServiceAddGrid.getrowdata(this.selectIndex);
    if (typeof (this.selectedData) !== 'undefined' && this.selectedData !== null) {
      this.availableAdd = true;
    } else {
      this.availableAdd = false;
    }
  }

  setGridWidth() {
    this.getGridWidth();
    if (this.getWidth() > this.gridWidth + 32) {
      const tempData = this.gridContentWidth;
      let scrollId = $('#jqxGridOption .jqx-scrollbar').attr('id');
      let visibility = $('#jqxGridOption .jqx-scrollbar').attr('style');
      if (scrollId.includes('vertical') && !visibility.includes('visibility: hidden;')) {
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



  setGridData() {

    // this.source.localdata = this.groupList;

    for (const list of this.groupList) {
      let tempData = [];
      tempData = [
        list.Label, list.ServiceType, list.Status, list.Id
      ];
      this.source.localdata.push(tempData);
    }

    this.ServiceAddGrid.updatebounddata();
    this.source.localdata.length = 0;
    if (this.availableAdd) {
      this.ServiceAddGrid.clearselection();
    }
    this.availableAdd = false;
    // this.source.localdata.length = 0;
  }

  reduceList() {
    if (this.startIndex - parseInt(this.rowStep, 10) > -1) {
      this.startIndex = this.startIndex - parseInt(this.rowStep, 10);
    } else {
      this.startIndex = 0;
    }
    if (this.pageRowNumber > 0) {
      this.pageRowNumber = this.pageRowNumber - 1;
      this.getAddedService();
    }
  }

  increaseList() {
    if (this.startIndex + parseInt(this.rowStep, 10) < this.totalLength) {
      this.startIndex = this.startIndex + parseInt(this.rowStep, 10);
    } else {
    }
    this.pageRowNumber = this.pageRowNumber + 1;
    this.getAddedService();
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
      this.getAddedService();
    }
  }

  focusChangePage() {

  }

  focusOutChangePage() {
    if (!this.keyPress) {
      this.startIndex = (this.pageRowNumber - 1) * parseInt(this.rowStep, 10);
      this.getAddedService();
    }
  }

  changeRowStep() {
    this.startIndex = 0;
    this.pageRowNumber = 1;
    this.getAddedService();
  }

  removeSpace(value) {
    if (value !== null && typeof (value) !== null) {
      return value.replace(/ /g, '');
    }
  }

  goBack() {
    // this.navCtrl.pop();
    this.AccountAssignServiceAddComponent.emit('close');
  }

  addNewService() {
  }

}
