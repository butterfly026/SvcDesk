import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ServiceItem, ServiceGroupItem } from 'src/app/model';
import { NavController } from '@ionic/angular';
import { TranService, LoadingService, ToastService } from 'src/services';

import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { ActivatedRoute } from '@angular/router';
import { ServiceGroupServiceAddService } from './services/service-add.service';
import { GlobalService } from 'src/services/global-service.service';


var temGroupList = [];
var disabledRow;

var selectedGroup = [];
var rowData: any;

@Component({
  selector: 'app-service-add',
  templateUrl: './service-add.page.html',
  styleUrls: ['./service-add.page.scss'],
})
export class ServiceAddPage implements OnInit {

  @ViewChild('ServiceAddGrid') ServiceAddGrid: jqxGridComponent;
  
  pageTitle: string = '';

  groupList: Array<ServiceItem> = [];

  ServiceGroupId: string = '';

  addedStr: string = '';
  addServiceStr: string = '';

  addedServiceList: Array<ServiceGroupItem> = [];

  initeditor = function (row, column, editor) {
  }

  cellbeginedit = function (row) {
    if (typeof (temGroupList[row]) !== 'undefined' && temGroupList[row] !== null) {
      return temGroupList[row];
    }
  }

  private scheduleTemplate = (row, column: any, value: string, htmlElement: HTMLElement): any => {
    const container = document.createElement('div');
    container.style.border = 'none';
    container.classList.add('full-height');
    container.classList.add('center-item');

    const container1 = document.createElement('div');
    const id = 'myButton' + row.uniqueid.replace(/-/g, '') + '0';
    container1.id = id;
    container1.style.border = 'none';

    container.appendChild(container1);

    // const container2 = document.createElement('div');
    // container2.id = 'scheduleButton' + row.uniqueid.replace(/-/g, '') + '0';
    // container2.style.border = 'none';

    // container.appendChild(container2);

    htmlElement.appendChild(container);

    const currentIndex = row.bounddata.uid;

    if (typeof (temGroupList[currentIndex]) !== 'undefined' && temGroupList[currentIndex] !== null) {
      if (temGroupList[currentIndex]) {
        const options1 = {
          theme: this.globService.themeColor,
          // groupName: this.addedStr,
          enableContainerClick: true,
        };
        container1.classList.add('center-item');

        const myButton1 = jqwidgets.createInstance('#' + container1.id, 'jqxCheckBox', options1);

        myButton1.addEventHandler('click', function (): void {
          if (myButton1.checked) {
            selectedGroup.push(row.bounddata);
          } else {
            let availIndex = 0;
            for (let i = 0; i < selectedGroup.length; i++) {
              if (selectedGroup[i].Id === row.bounddata.Id) {
                availIndex = i;
              }
            }
            selectedGroup.splice(availIndex, 1);
          }
          document.getElementById('checkBox').click();
        });


        // const options2 = {
        //   theme: this.globService.themeColor,
        //   value: this.addServiceStr,
        // };

        // const myButton2 = jqwidgets.createInstance('#' + container2.id, 'jqxButton', options2);

        // myButton2.addEventHandler('click', function (): void {
        //   rowData = row;
      
        //   // document.getElementById('downloadButton').click();
        // });

      } else {
        container1.classList.add('center-item', 'full-width');

        var ionicRow = document.createElement('ion-row');
        ionicRow.classList.add('bill-usage-detail', 'full-height');
        var span1 = document.createElement('span');
        span1.classList.add('margin-auto');
        var text1 = document.createTextNode(this.addedStr);
        span1.appendChild(text1);

        ionicRow.appendChild(span1);
        container1.appendChild(ionicRow);
      }
    }


  };

  cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties) {
    if (typeof (temGroupList[row]) !== 'undefined' && temGroupList[row] !== null && !temGroupList[row]) {
      return '<div style="height: 100%; background-color: #BBBBBB; display: flex; align-items: center; justify-content: start;"><span style="position: relative; margin-left: 4px;">' + value + '</span></div>';
    }
  };

  source = {
    datafields: [
      { name: 'Id', type: 'string' },
      { name: 'Label', type: 'date' },
      { name: 'ServiceType', type: 'string' },
      { name: 'Status', type: 'string' },
    ],
    datatype: 'array',
    localdata: []
  };

  dataAdapter: any = new jqx.dataAdapter(this.source);

  columns = [
    { text: '', datafield: 'Id', width: 80, editable: false, initeditor: this.initeditor, cellbeginedit: this.cellbeginedit, cellsrenderer: this.cellsrenderer },
    { text: '', datafield: 'Label', width: 100, editable: false, initeditor: this.initeditor, cellbeginedit: this.cellbeginedit, cellsrenderer: this.cellsrenderer },
    { text: '', datafield: 'ServiceType', width: 120, editable: false, initeditor: this.initeditor, cellbeginedit: this.cellbeginedit, cellsrenderer: this.cellsrenderer },
    { text: '', datafield: 'Status', width: 100, editable: false, initeditor: this.initeditor, cellbeginedit: this.cellbeginedit, cellsrenderer: this.cellsrenderer },
    {
      text: '', datafield: 'add', width: 150, align: 'center',
      initeditor: this.initeditor, cellbeginedit: this.cellbeginedit, cellsrenderer: this.cellsrenderer,
      initwidget: (row: number, column: any, value: any, htmlElement: HTMLElement): void => {
      },
      createwidget: this.scheduleTemplate
    }
  ];

  selectIndex: number;
  selectedData: any;
  gridWidth: any;
  gridContentWidth = '';

  availableAdd: boolean = false;

  currentSelGroup: any[] = [];


  constructor(
    public navCtrl: NavController,
    private tranService: TranService,
    private loading: LoadingService,
    private toast: ToastService,
    private sGService: ServiceGroupServiceAddService,
    
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    
    this.tranService.convertText('add_service').subscribe(result => {
      this.pageTitle = result;
    });
    this.ServiceGroupId = this.route.snapshot.params['Id'];
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
    this.setGridWidth();
    this.getAddedService();
  }

  async getAddedService() {
    this.addedServiceList = [];
    await this.loading.present();
    this.sGService.ServiceServiceGroupAssignment(this.ServiceGroupId).subscribe((result: ServiceGroupItem[]) => {
      

      if (result === null) {
        this.tranService.errorMessage('no_service_group');
      } else {
        this.addedServiceList = result;
      }
      this.getServiceList();
    }, (error: any) => {
      this.getServiceList();
      
      // this.tranService.errorMessage(error);
    }, () => {
    });
  }

  async getServiceList() {
    temGroupList = [];
    this.sGService.getServiceList().subscribe(async (result: ServiceItem[]) => {
      
      await this.loading.dismiss();

      if (result === null) {
        this.tranService.errorMessage('no_services');
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
        // this.totalLength = result.length;
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
    return Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.documentElement.clientWidth
    );
  }

  selectRow() {
    let previousIndex = this.selectIndex;
    this.selectIndex = this.ServiceAddGrid.getselectedrowindex();
    this.selectedData = this.ServiceAddGrid.getrowdata(this.selectIndex);
    if (typeof (this.selectedData) !== 'undefined' && this.selectedData !== null) {
      let availAdd = true;
      for (let list of this.addedServiceList) {
        if (this.selectedData.Id === (list.ServiceId).toString()) {
          availAdd = false;
        }
      }
      if (!availAdd) {
        this.availableAdd = false;
        this.ServiceAddGrid.clearselection();
        if (typeof (previousIndex) !== 'undefined' && previousIndex !== null) {
          this.ServiceAddGrid.selectrow(previousIndex);
        }
      } else {
        this.availableAdd = true;
      }
    } else {
      this.availableAdd = false;
    }
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



  setGridData() {

    // if (this.totalLength % parseInt(this.rowStep, 10) === 0) {
    //   this.maxPageRow = this.totalLength / parseInt(this.rowStep, 10);
    // } else {
    //   this.maxPageRow = Math.floor(this.totalLength / parseInt(this.rowStep, 10)) + 1;
    // }

    // this.endIndex = this.startIndex + parseInt(this.rowStep, 10);
    // if (this.totalLength > 0) {
    //   if (this.startIndex > -1) {
    //     if (this.endIndex < this.totalLength) {
    //     } else {
    //       this.endIndex = this.totalLength;
    //     }
    //   }
    // }

    // for (const list of this.groupList) {
    //   const tempData = [
    //     this.removeSpace(list.Id), list.IsChildService, list.IsService, this.removeSpace(list.Label),
    //     this.removeSpace(list.ParentId), list.ServiceCount, list.ServiceInstanceMenuId,
    //     this.removeSpace(list.ServiceType), list.ServiceTypeCount, this.removeSpace(list.ServiceTypeId),
    //     this.removeSpace(list.ServiceTypeImage), list.ServiceTypeMenuId, this.removeSpace(list.Status),
    //     this.removeSpace(list.StatusId), this.removeSpace(list.SystemStatus), this.removeSpace(list.SystemStatusId),
    //   ];
    //   this.source.localdata.push(tempData);
    // }

    this.source.localdata = this.groupList;

    this.ServiceAddGrid.updatebounddata();
    this.ServiceAddGrid.clearselection();
    this.availableAdd = false;
    // this.source.localdata.length = 0;
  }

  removeSpace(value) {
    if (value !== null && typeof (value) !== null) {
      return value.replace(/ /g, '');
    }
  }

  goBack() {
    this.navCtrl.pop();
  }

  addNewService() {
  }

}
