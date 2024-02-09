import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { DeviceListItem } from 'src/app/model';
import { DeviceListService } from './services/device-list.service';
import { NavController, AlertController } from '@ionic/angular';
import { LoadingService, TranService } from 'src/services';

import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.page.html',
  styleUrls: ['./device-list.page.scss'],
})
export class DeviceListPage implements OnInit {

  @ViewChild('myGridDeviceList') myGridDeviceList: jqxGridComponent;

  pageTitle: string = '';
  

  deviceList: Array<DeviceListItem> = [];
  debitRunTitle = '';

  selectIndex: number;
  selectedData: any;
  gridWidth: any;
  gridContentWidth = '';

  source = {
    localdata: [],
    datafields: [
      { name: 'id', type: 'number', map: '0' },
      { name: 'service_provider_id1', type: 'string', map: '1' },
      { name: 'service_provider_id2', type: 'string', map: '2' },
      { name: 'status_id', type: 'string', map: '3' },
      { name: 'status', type: 'string', map: '4' },
      { name: 'type_id', type: 'string', map: '5' },
      { name: 'type', type: 'string', map: '6' },
      { name: 'note', type: 'string', map: '7' },
      { name: 'password', type: 'string', map: '8' },
      { name: 'created', type: 'string', map: '9' },
      { name: 'created_by', type: 'string', map: '10' },
      { name: 'lastupdated', type: 'string', map: '11' },
      { name: 'updatedby', type: 'string', map: '12' },
    ],
    datatype: 'array'
  };

  dataAdapter: any = new jqx.dataAdapter(this.source);

  columns = [
    { text: '', datafield: 'id', width: 70 },
    { text: '', datafield: 'service_provider_id1', width: 120 },
    { text: '', datafield: 'service_provider_id2', width: 120 },
    { text: '', datafield: 'status_id', width: 80 },
    { text: '', datafield: 'status', width: 80 },
    { text: '', datafield: 'type_id', width: 90 },
    { text: '', datafield: 'type', width: 80 },
    { text: '', datafield: 'note', width: 100 },
    { text: '', datafield: 'password', width: 120 },
    { text: '', datafield: 'created', width: 120 },
    { text: '', datafield: 'created_by', width: 90 },
    { text: '', datafield: 'lastupdated', width: 90 },
    { text: '', datafield: 'updatedby', width: 120 },
  ];

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

  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    private deviceService: DeviceListService,
    
    private cdr: ChangeDetectorRef,
    private alertController: AlertController,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('device_list').subscribe(value => {
      this.pageTitle = value;
    });
    

    this.setGridWidth();

    for (let i = 0; i < this.columns.length; i++) {
      this.tranService.convertText(this.columns[i].datafield).subscribe(value => {
        this.columns[i].text = value;
      });
    }

    this.getDeviceList();

  }

  ngOnInit() {
  }

  scrollContent(even) {
    this.globService.resetTimeCounter();
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
    this.selectIndex = this.myGridDeviceList.getselectedrowindex();
    this.selectedData = this.myGridDeviceList.getrowdata(this.selectIndex);
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
    this.myGridDeviceList.exportview('xlsx', 'Device List');
  }

  setGridData() {

    if (this.totalLength % parseInt(this.rowStep, 10) === 0) {
      this.maxPageRow = this.totalLength / parseInt(this.rowStep, 10);
    } else {
      this.maxPageRow = Math.floor(this.totalLength / parseInt(this.rowStep, 10)) + 1;
    }

    this.endIndex = this.startIndex + this.deviceList.length;
    // if (this.totalLength > 0) {
    //   if (this.startIndex > -1) {
    //     if (this.endIndex < this.totalLength) {
    //     } else {
    //       this.endIndex = this.totalLength;
    //     }
    //   }
    // }

    for (const list of this.deviceList) {
      const tempData = [
        list.DeviceId, list.ServiceProviderId1, list.ServiceProviderId2, list.StatusId,
        list.Status, list.TypeId, list.Type, list.Note, list.Password, list.Created,
        list.CreatedBy, list.LastUpdated, list.UpdatedBy
      ];
      this.source.localdata.push(tempData);
    }

    this.myGridDeviceList.updatebounddata();

    this.source.localdata.length = 0;
    this.myGridDeviceList.clearselection();
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
      this.getDeviceList();
    }
  }

  increaseList() {
    // if (this.startIndex + parseInt(this.rowStep, 10) < this.totalLength) {
    this.startIndex = this.startIndex + parseInt(this.rowStep, 10);
    // } else {
    // }
    this.pageRowNumber = this.pageRowNumber + 1;
    this.getDeviceList();
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
      this.getDeviceList();
    }
  }

  focusChangePage() {

  }

  focusOutChangePage() {
    if (!this.keyPress) {
      this.startIndex = (this.pageRowNumber - 1) * parseInt(this.rowStep, 10);
      this.getDeviceList();
    }
  }

  changeRowStep() {
    this.startIndex = 0;
    this.pageRowNumber = 1;
    this.getDeviceList();
  }

  async getDeviceList() {
    this.deviceList = [];

    const reqPara = {
      'SkipRecords': this.startIndex,
      'TakeRecords': parseInt(this.rowStep, 10)
    };

    await this.loading.present();
    this.deviceService.getDeviceList(reqPara).subscribe(async (result: DeviceListItem[]) => {
      

      await this.loading.dismiss();
      if (result === null) {
        this.tranService.errorMessage('no_devices_list');
      } else {
        for (const list of result) {
          this.deviceList.push(list);
        }
        this.totalLength = result.length;

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

  gotoNew() {
    this.navCtrl.navigateForward(['Devices/device-add']);
  }

  update() {
    this.navCtrl.navigateForward(['Devices/device-update', this.selectedData.id]);
  }

  // delete() {
  //   let currentIndex;
  //   for (let i = 0; i < this.deviceList.length; i++) {
  //     if (this.selectedData.Id === this.deviceList[i].Id) {
  //       currentIndex = i;
  //     }
  //   }
  //   this.deviceList.splice(currentIndex, 1);
  //   this.setGridData();
  // }

  goBack() {
    this.navCtrl.pop();
  }

  async delete() {
    const alert = await this.alertController.create({
      header: 'Confirm Deletion',
      message: 'Are you sure to delete?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            
          }
        },
        {
          text: 'Yes',
          handler: async () => {
            
            await this.loading.present();
            this.deviceService.DeviceDelete(this.selectedData.id).subscribe(async (result: any) => {
              
              await this.loading.dismiss();
              let currentIndex;
              for (let i = 0; i < this.deviceList.length; i++) {
                if (this.selectedData.id === this.deviceList[i].DeviceId) {
                  currentIndex = i;
                }
              }
              this.deviceList.splice(currentIndex, 1);
              this.endIndex = this.startIndex + this.deviceList.length;
              this.setGridData();
            }, async (error: any) => {
              await this.loading.dismiss();
              this.tranService.errorMessage(error);
            })
          }
        }
      ]
    });

    await alert.present();
  }



}
