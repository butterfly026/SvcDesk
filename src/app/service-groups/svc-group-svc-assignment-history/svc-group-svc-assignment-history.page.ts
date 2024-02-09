import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ServiceGroupServiceAssignListService } from './services/svc-group-svc-assign.service';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { ServiceGroupItem } from 'src/app/model';
import { NavController } from '@ionic/angular';
import { LoadingService, TranService } from 'src/services';

import { ActivatedRoute } from '@angular/router';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-svc-group-svc-assignment-history',
  templateUrl: './svc-group-svc-assignment-history.page.html',
  styleUrls: ['./svc-group-svc-assignment-history.page.scss'],
})
export class SvcGroupSvcAssignmentHistoryPage implements OnInit {


  @ViewChild('SvcSvcGroupAssignGrid') SvcSvcGroupAssignGrid: jqxGridComponent;

  groupList: Array<ServiceGroupItem> = [];
  isDisabled: boolean = true;

  pageTitle: string = '';
  

  selectIndex: number;
  selectedData: any;
  gridWidth: any;
  gridContentWidth = '';

  availDeleteState = false;

  source = {
    localdata: [],
    datafields: [
      { name: 'id', type: 'string', map: '0' },
      { name: 'serviceid', type: 'string', map: '1' },
      { name: 'servicenumber', type: 'string', map: '2' },
      { name: 'startdatetime', type: 'string', map: '3' },
      { name: 'end_date_time', type: 'string', map: '4' },
      { name: 'created', type: 'string', map: '5' },
      { name: 'created_by', type: 'string', map: '6' },
      { name: 'lastupdated', type: 'string', map: '7' },
      { name: 'updatedby', type: 'string', map: '8' },
    ],
    datatype: 'array'
  };

  dataAdapter: any = new jqx.dataAdapter(this.source);

  columns = [
    { text: '', datafield: 'id', width: 80 },
    { text: '', datafield: 'serviceid', width: 100 },
    { text: '', datafield: 'servicenumber', width: 100 },
    { text: '', datafield: 'startdatetime', width: 150 },
    { text: '', datafield: 'end_date_time', width: 150 },
    { text: '', datafield: 'created', width: 80 },
    { text: '', datafield: 'created_by', width: 100 },
    { text: '', datafield: 'lastupdated', width: 100 },
    { text: '', datafield: 'updatedby', width: 100 },
  ];

  serviceId: any = '';

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

  ServiceGroupId: string = '';
  ServiceGroupName: string = '';

  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    private sGSAService: ServiceGroupServiceAssignListService,
    
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    public globService: GlobalService,
  ) {

    this.tranService.translaterService();
    this.tranService.convertText('service_group_service_assignment').subscribe(value => {
      this.pageTitle = value;
    });

    this.serviceId = this.route.snapshot.params['Id'];

    

    this.setGridWidth();
    for (let i = 0; i < this.columns.length; i++) {
      this.tranService.convertText(this.columns[i].datafield).subscribe(value => {
        this.columns[i].text = value;
      });
    }

    this.getList();

  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  async getList() {
    this.groupList = [];
    await this.loading.present();
    this.sGSAService.ServiceGroupAssignedServices(this.serviceId).subscribe(async (result: ServiceGroupItem[]) => {
      
      await this.loading.dismiss();

      if (result === null) {
        this.tranService.errorMessage('no_service_group');
      } else {
        for (const list of result) {
          this.groupList.push(list);
        }
        this.totalLength = result.length;
        if (this.totalLength % parseInt(this.rowStep, 10) === 0) {
          this.maxPageRow = this.totalLength / parseInt(this.rowStep, 10);
        } else {
          this.maxPageRow = Math.floor(this.totalLength / parseInt(this.rowStep, 10)) + 1;
        }
        this.setGridData();
      }
      this.ServiceGroupId = this.groupList[0].ServiceGroupId;
      this.ServiceGroupName = this.groupList[0].ServiceGroupName;

    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });

  }

  ngOnInit() {
  }

  goBack() {
    this.navCtrl.pop();
  }

  gotoNew() {
    this.navCtrl.navigateForward(['ServiceGroups/ServiceGroupServiceAdd', this.ServiceGroupId]);
  }

  delete() {

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
    if (typeof (this.selectedData) === 'undefined') {
      this.availDeleteState = false;
    } else {
      this.availDeleteState = true;
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
      const tempData = [
        list.Id, list.ServiceId, list.ServiceNumber,
        // list.ServiceGroupId, list.ServiceGroupName,
        list.StartDateTime, list.EndDateTime, list.Created, list.CreatedBy, list.LastUpdated, list.UpdatedBy,
      ];
      this.source.localdata.push(tempData);
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

}
