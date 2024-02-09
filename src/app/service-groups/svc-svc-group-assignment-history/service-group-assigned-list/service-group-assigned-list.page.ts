import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { ServiceGroupItem, ServiceGroupServiceAssignment, ServiceGroup } from 'src/app/model';
import { NavController } from '@ionic/angular';
import { LoadingService, TranService } from 'src/services';

import { ActivatedRoute } from '@angular/router';
import { ServiceGroupAssignedListService } from './services/service-group-assigned-list.service';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-service-group-assigned-list',
  templateUrl: './service-group-assigned-list.page.html',
  styleUrls: ['./service-group-assigned-list.page.scss'],
})
export class ServiceGroupAssignedListPage implements OnInit {

  @Input() serviceId: any = '';
  @Output('AssignedListComponentValue') AssignedListComponentValue: EventEmitter<string> = new EventEmitter<string>();
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

  source = {
    localdata: [],
    datafields: [
      { name: 'Id', type: 'string', map: '0' },
      { name: 'ServiceId', type: 'string', map: '1' },
      { name: 'ServiceNumber', type: 'string', map: '2' },
      { name: 'StartDateTime', type: 'string', map: '3' },
      { name: 'EndDateTime', type: 'string', map: '4' },
      { name: 'Created', type: 'string', map: '5' },
      // { name: 'remove', type: 'boolean', map: '6' },
    ],
    datatype: 'array'
  };

  dataAdapter: any = new jqx.dataAdapter(this.source);

  columns = [
    { text: '', datafield: 'Id', width: 80, editable: false },
    { text: '', datafield: 'ServiceId', width: 80, editable: false },
    { text: '', datafield: 'ServiceNumber', width: 120, editable: false },
    { text: '', datafield: 'StartDateTime', width: 150, editable: false },
    { text: '', datafield: 'EndDateTime', width: 120, editable: false },
    { text: '', datafield: 'Created', width: 150, editable: false },
    // {
    //   text: '', datafield: 'remove', width: 100, columntype: 'checkbox', align: 'center',
    // },
  ];

  ServiceGroupId: string = '';
  ServiceGroupName: string = '';

  showAddNew: string = '';

  checkValueList: any[] = [];

  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    private sGService: ServiceGroupAssignedListService,
    
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    public globService: GlobalService,
  ) {

    this.tranService.translaterService();
    this.tranService.convertText('service_group_assignment').subscribe(value => {
      this.pageTitle = value;
    });
    this.tranService.convertText('remove').subscribe(result => {
      this.removeStr = result;
    });

    this.serviceId = this.route.snapshot.params['Id'];

    

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
    this.AssignedListComponentValue.emit('close');
  }

  getGroupDetail() {

    this.sGService.GetServiceGroupListGroupId(this.serviceId).subscribe((result: ServiceGroup) => {
      
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
      serviceId: this.serviceId,
      SkipRecords: this.startIndex,
      TakeRecords: this.rowStep,
    }
    this.sGService.ServiceServiceGroupAssignment(reqData).subscribe(async (result: ServiceGroupItem[]) => {
      
      await this.loading.dismiss();

      if (result === null) {
      } else {
        for (const list of result) {
          if (this.checkCancelledDate(new Date(list.EndDateTime))) {
            this.groupList.push(list);
          }
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
    return Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.documentElement.clientWidth
    );
  }

  selectRow() {
    this.selectIndex = this.SvcSvcGroupAssignGrid.getselectedrowindex();
    this.selectedData = this.SvcSvcGroupAssignGrid.getrowdata(this.selectIndex);
    // if (typeof (this.selectedData) === 'undefined') {
    //   this.availDeleteState = false;
    // } else {
    //   this.availDeleteState = true;
    // }
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
    this.SvcSvcGroupAssignGrid.exportview('xlsx', 'Servic Service Group Assignment List');
  }

  setGridData() {

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
      tempData = [
        list.Id, list.ServiceId, list.ServiceNumber,
        list.StartDateTime, list.EndDateTime, list.Created,
        // list.CreatedBy, list.LastUpdated, list.UpdatedBy, 
        false
      ];
      this.source.localdata.push(tempData);
    }

    // this.source.localdata = this.groupList;


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
    this.AssignedListComponentValue.emit(this.ServiceGroupId);
  }

  removeService() {

  }

}
