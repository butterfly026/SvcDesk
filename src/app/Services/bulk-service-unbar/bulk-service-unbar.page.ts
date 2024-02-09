import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';



import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { BulkServiceUnbarService } from './services/bulk-service-unbar.service';
import { NavController, AlertController } from '@ionic/angular';
import { LoadingService, TranService } from 'src/services';

import { ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ConfigureResourceService } from 'src/services/configure-resource.service';
import { ConfigurationItem, BulkChangeServiceSelectionItem, PlanDisplayItem, StatusDisplayItem, GroupDisplayItem, CostCentreItem, ServiceTypeItem } from 'src/app/model';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { GlobalService } from 'src/services/global-service.service';


@Component({
  selector: 'app-bulk-service-unbar',
  templateUrl: './bulk-service-unbar.page.html',
  styleUrls: ['./bulk-service-unbar.page.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: navigator.language },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class BulkServiceUnbarPage implements OnInit {

  @ViewChild('myGridBulkServiceUnbar') myGridBulkServiceUnbar: jqxGridComponent;

  pageTitle: string = '';
  

  searchData: string = '';
  searchForm: UntypedFormGroup;
  bulkList: Array<BulkChangeServiceSelectionItem> = [];
  debitRunTitle = '';

  selectIndex: number;
  selectedData: any;
  gridWidth: any;
  gridContentWidth = '';

  enableAddList: boolean = false;
  enableDeleteItem: boolean = false;
  enableClearList: boolean = false;
  debitRunId: string = '';

  showBarPart = true;

  unBarForm: UntypedFormGroup;

  source = {
    localdata: [],
    datafields: [
      { name: 'number', type: 'string', map: '0' },
      { name: 'label', type: 'string', map: '1' },
      { name: 'service_status', type: 'string', map: '2' },
      { name: 'connected', type: 'string', map: '3' },
      { name: 'action_status', type: 'string', map: '4' },
    ],
    datatype: 'array'
  };

  dataAdapter: any = new jqx.dataAdapter(this.source);

  columns = [
    { text: '', datafield: 'number', width: 90 },
    { text: '', datafield: 'label', width: 90 },
    { text: '', datafield: 'service_status', width: 120 },
    { text: '', datafield: 'connected', width: 180 },
    { text: '', datafield: 'action_status', width: 120 },
  ];

  planList: Array<PlanDisplayItem> = [];
  statusList: Array<StatusDisplayItem> = [];
  groupList: Array<GroupDisplayItem> = [];
  costCentreList: Array<CostCentreItem> = [];
  serviceTypeList: Array<ServiceTypeItem> = [];

  enableSearch: boolean = false;

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


  noteData: string = '';

  barTypeList = [
    {
      text: 'administration_bar',
      value: ''
    }
  ];

  barReasonList = [
    {
      text: 'credit_alent',
      value: ''
    },
    {
      text: 'customer_request',
      value: ''
    }
  ];

  all: boolean = false;
  children: boolean = false;
  sameServiceType: boolean = false;
  sibiling: boolean = false;
  cNEvent: boolean = false;
  unBarState: boolean = false;

  configState: boolean = false;

  listStatus = {
    plan: false,
    status: false,
    group: false,
    costcentre: false,
    servicetye: false,
  }

  barData = {
    BarType: '',
    BarReason: '',
    DateToBarService: '',
    DateFromBarService: '',
    note: ''
  }

  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    private bSUService: BulkServiceUnbarService,
    
    private cdr: ChangeDetectorRef,
    private router: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private resourceConf: ConfigureResourceService,
    private alertController: AlertController,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('bulk_service_unbar').subscribe(value => {
      this.pageTitle = value;
    });
    

    this.setGridWidth();

    for (let i = 0; i < this.columns.length; i++) {
      this.tranService.convertText(this.columns[i].datafield).subscribe(value => {
        this.columns[i].text = value;
      });
    }

    this.searchForm = this.formBuilder.group({
      searchCtrl: ['', Validators.required],
      plan: [''],
      status: [''],
      group: [''],
      costCentre: [''],
      serviceType: [''],
    });

    this.unBarForm = this.formBuilder.group({
      BarType: [''],
      BarReason: [''],
      DateToBarService: [''],
      DateFromBarService: [''],
      note: ['']
    });

    this.getAllList();
    this.setUnbarOption();
  }

  ngOnInit() {
    this.unBarStateChange();
  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  setUnbarOption() {
    for (const list of this.barTypeList) {
      this.tranService.convertText(list.text).subscribe(value => {
        list.value = value;
      });
    }

    for (const list of this.barReasonList) {
      this.tranService.convertText(list.text).subscribe(value => {
        list.value = value;
      });
    }
    this.resourceConf.getConfResource('UNBAR_SHOW_BULK_OPTIONS').subscribe((result: ConfigurationItem[]) => {
      
      if (result === null) {
        this.configState = false;
      } else {
        if (result[0].Key === 'UNBAR_SHOW_BULK_OPTIONS' && result[0].Value === 'YES') {
          this.configState = true;
        } else {
          this.configState = false;
        }
      }
    }, (error: any) => {
      
      this.tranService.errorMessage(error);
    }, () => {
    });
  }

  unBarStateChange() {

    if (this.unBarState) {
      this.unBarForm.get('DateFromBarService').enable();
    } else {
      this.unBarForm.get('DateFromBarService').disable();
    }
  }


  async getAllList() {
    this.planList = [];
    this.statusList = [];
    this.groupList = [];
    this.costCentreList = [];
    this.serviceTypeList = [];

    await this.loading.present();

    this.bSUService.getPlanList().subscribe((result: PlanDisplayItem[]) => {
      
      if (result === null) {
        this.tranService.errorMessage('no_plans');
      } else {
        for (const list of result) {
          this.planList.push(list);
        }
      }
      this.listStatus.plan = true;
      this.checkLoadingDismiss();
    }, (error: any) => {
      
      this.tranService.errorMessage(error);
    });

    this.bSUService.getStatusList().subscribe((result: StatusDisplayItem[]) => {
      
      if (result === null) {
        this.tranService.errorMessage('no_status');
      } else {
        for (const list of result) {
          this.statusList.push(list);
        }
      }
      this.listStatus.status = true;
      this.checkLoadingDismiss();
    }, (error: any) => {
      
      this.tranService.errorMessage(error);
    });

    this.bSUService.getGroupList().subscribe((result: GroupDisplayItem[]) => {
      
      if (result === null) {
        this.tranService.errorMessage('no_groups');
      } else {
        for (const list of result) {
          this.groupList.push(list);
        }
      }
      this.listStatus.group = true;
      this.checkLoadingDismiss();
    }, (error: any) => {
      
      this.tranService.errorMessage(error);
    });

    this.bSUService.getCostCentreList().subscribe((result: CostCentreItem[]) => {
      
      if (result === null) {
        this.tranService.errorMessage('no_cost_centres');
      } else {
        for (const list of result) {
          this.costCentreList.push(list);
        }
      }
      this.listStatus.costcentre = true;
      this.checkLoadingDismiss();
    }, (error: any) => {
      
      this.tranService.errorMessage(error);
    });

    this.bSUService.getServiceTypeList().subscribe((result: ServiceTypeItem[]) => {
      
      if (result === null) {
        this.tranService.errorMessage('no_service_types');
      } else {
        for (const list of result) {
          this.serviceTypeList.push(list);
        }
      }
      this.listStatus.servicetye = true;
      this.checkLoadingDismiss();
    }, (error: any) => {
      
      this.tranService.errorMessage(error);
    });

  }

  async checkLoadingDismiss() {
    if (this.listStatus.plan && this.listStatus.status && this.listStatus.group
      && this.listStatus.costcentre && this.listStatus.servicetye) {
      await this.loading.dismiss();
    }
  }

  async searchItem() {
    await this.loading.present();
    this.bSUService.getPlanList().subscribe(async (result: PlanDisplayItem[]) => {
      

      await this.loading.dismiss();
      if (result === null) {
        this.tranService.errorMessage('no_plans');
      } else {
        this.enableAddList = true;
        this.presentAlert();
      }
    },async  (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  searchKeyUp() {
    if (this.searchData === '') {
      this.enableAddList = false;
    }
  }



  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Searched Items Number',
      message: '20',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            
          }
        },
        {
          text: 'Yes',
          handler: () => {
            
            this.addList();
          }
        }
      ]
    });

    await alert.present();
  }

  async addList() {
    this.bulkList = [];

    const reqPara = {
      'SkipRecords': this.startIndex,
      'TakeRecords': parseInt(this.rowStep, 10)
    };

    await this.loading.present();
    this.bSUService.getBulkChangeServiceList(reqPara).subscribe(async (result: any) => {
      

      await this.loading.dismiss();
      if (result === null) {
      } else {
        this.enableAddList = true;
        for (const list of result.data) {
          this.bulkList.push(list);
        }
        this.totalLength = result.totalLength;
        if (this.totalLength % parseInt(this.rowStep, 10) === 0) {
          this.maxPageRow = this.totalLength / parseInt(this.rowStep, 10);
        } else {
          this.maxPageRow = Math.floor(this.totalLength / parseInt(this.rowStep, 10)) + 1;
        }
        this.setGridData();
      }
    },async  (error: any) => {
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
    this.selectIndex = this.myGridBulkServiceUnbar.getselectedrowindex();
    this.selectedData = this.myGridBulkServiceUnbar.getrowdata(this.selectIndex);
    if (typeof (this.selectedData) === 'undefined') {
      this.enableDeleteItem = false;
    } else {
      this.enableDeleteItem = true;
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
    this.myGridBulkServiceUnbar.exportview('xlsx', 'Bulk Service Unbar');
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

    for (const list of this.bulkList) {
      const tempData = [
        list.Number, list.Label, list.ServiceStatus, list.Connected, list.ActionStatus
      ];
      this.source.localdata.push(tempData);
    }

    this.myGridBulkServiceUnbar.updatebounddata();
    this.myGridBulkServiceUnbar.clearselection();
    this.selectRow();

    this.source.localdata.length = 0;
  }

  deleteItem() {
    let currentIndex;
    for (let i = 0; i < this.bulkList.length; i++) {
      if (this.selectedData.number === this.bulkList[i].Number) {
        currentIndex = i;
      }
    }
    this.bulkList.splice(currentIndex, 1);
    this.setGridData();
  }

  clearList() {
    this.bulkList = [];
    this.setGridData();
  }

  goBack() {
    this.navCtrl.pop();
  }

  enableSearchButton() {
    this.enableAddList = true;
  }

  reduceList() {
    if (this.startIndex - parseInt(this.rowStep, 10) > -1) {
      this.startIndex = this.startIndex - parseInt(this.rowStep, 10);
    } else {
      this.startIndex = 0;
    }
    if (this.pageRowNumber > 0) {
      this.pageRowNumber = this.pageRowNumber - 1;
      this.addList();
    }
  }

  increaseList() {
    if (this.startIndex + parseInt(this.rowStep, 10) < this.totalLength) {
      this.startIndex = this.startIndex + parseInt(this.rowStep, 10);
    } else {
    }
    this.pageRowNumber = this.pageRowNumber + 1;
    this.addList();
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
      this.addList();
    }
  }

  focusChangePage() {

  }

  focusOutChangePage() {
    if (!this.keyPress) {
      this.startIndex = (this.pageRowNumber - 1) * parseInt(this.rowStep, 10);
      this.addList();
    }
  }

  changeRowStep() {
    this.startIndex = 0;
    this.pageRowNumber = 1;
    this.addList();
  }

  enableBar() {
    this.showBarPart = true;
  }

  submitTrigger() {
    document.getElementById('submitButton').click();
  }

  unBarSubmit() {
    if (this.unBarForm.valid) {
      this.showBarPart = false;
      this.barData.BarType = this.unBarForm.controls.BarType.value;
      this.barData.BarReason = this.unBarForm.controls.BarReason.value;
      let temDateFromBarService = this.unBarForm.controls.DateToBarService.value
      this.barData.DateToBarService = temDateFromBarService.toISOString().split('T')[0];
      if (this.unBarState) {
        let temDateToBarService = this.unBarForm.controls.DateFromBarService.value
        this.barData.DateFromBarService = temDateToBarService.toISOString().split('T')[0];
      } else {
        this.barData.DateFromBarService = new Date().toISOString().split('T')[0];
      }
    }
  }

  cancelBulk() {
    this.showBarPart = true;
  }


}
