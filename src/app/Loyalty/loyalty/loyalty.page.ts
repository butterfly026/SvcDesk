import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { LoyaltyService } from './services/loyalty.service';
import { Loyalty, ServiceGroup, ServiceGroupItem } from 'src/app/model';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { NavController } from '@ionic/angular';
import { LoadingService, TranService } from 'src/services';


import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoyaltyDetailPage } from './loyalty-detail/loyalty-detail.page';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-loyalty',
  templateUrl: './loyalty.page.html',
  styleUrls: ['./loyalty.page.scss'],
})
export class LoyaltyPage implements OnInit {

  @Input() ContactCode: any = '';
  @Output('LoyaltyComponent') LoyaltyComponent: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('LoyaltyGrid') LoyaltyGrid: jqxGridComponent;

  groupList: Array<Loyalty> = [];
  isDisabled: boolean = true;

  pageTitle: string = '';
  

  selectIndex: number;
  selectedData: any;
  gridWidth: any;
  gridContentWidth = '';


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
      { name: 'id', type: 'string', map: '0' },
      { name: 'tran_date', type: 'string', map: '1' },
      { name: 'expiry_date', type: 'string', map: '2' },
      { name: 'status', type: 'string', map: '3' },
      { name: 'source', type: 'string', map: '4' },
      { name: 'type', type: 'string', map: '5' },
      { name: 'total_points', type: 'string', map: '6' },
      { name: 'earnt_points', type: 'string', map: '7' },
      { name: 'consumed_points', type: 'string', map: '8' },
      { name: 'unused_points', type: 'string', map: '9' },
    ],
    datatype: 'array'
  };

  dataAdapter: any = new jqx.dataAdapter(this.source);

  columns = [
    { text: '', datafield: 'id', width: 80, },
    { text: '', datafield: 'tran_date', width: 120, },
    { text: '', datafield: 'expiry_date', width: 120, },
    { text: '', datafield: 'status', width: 100, },
    { text: '', datafield: 'source', width: 120, },
    { text: '', datafield: 'type', width: 100, },
    { text: '', datafield: 'total_points', width: 100, },
    { text: '', datafield: 'earnt_points', width: 100, },
    { text: '', datafield: 'consumed_points', width: 120, },
    { text: '', datafield: 'unused_points', width: 120, }
  ];

  ServiceGroupId: string = '';
  ServiceGroupName: string = '';

  showAddNew: string = '';

  checkValueList: any[] = [];
  LoyaltyType: string = '';

  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    private loyaltyService: LoyaltyService,
    
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    public globService: GlobalService,
  ) {

    this.tranService.translaterService();
    this.tranService.convertText('service_group_assignment').subscribe(value => {
      this.pageTitle = value;
    });
    this.tranService.convertText('remove').subscribe(result => {
      this.removeStr = result;
    });

    

    this.setGridWidth();
    for (let i = 0; i < this.columns.length; i++) {
      this.tranService.convertText(this.columns[i].datafield).subscribe(value => {
        this.columns[i].text = value;
      });
    }

  }

  ngOnInit() {
    this.getList();
  }

  async getList() {

    this.groupList = [];
    await this.loading.present();
    const reqData = {
      ContactCode: this.ContactCode,
      SkipRecords: this.startIndex,
      TakeRecords: this.rowStep,
    }
    this.loyaltyService.getLoyaltyList(reqData).subscribe(async (result: Loyalty[]) => {
      
      await this.loading.dismiss();

      if (result === null) {
      } else {
        this.groupList = result;
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
    // return Math.max(
    //   document.body.scrollWidth,
    //   document.documentElement.scrollWidth,
    //   document.body.offsetWidth,
    //   document.documentElement.offsetWidth,
    //   document.documentElement.clientWidth
    // );

    let element = document.getElementById('loyalty-row');
    if (typeof (element) !== 'undefined' && element !== null) {
      return element.offsetWidth;
    } else {
      return 900;
    }
  }

  selectRow() {
    this.selectIndex = this.LoyaltyGrid.getselectedrowindex();
    this.selectedData = this.LoyaltyGrid.getrowdata(this.selectIndex);
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
    this.LoyaltyGrid.exportview('xlsx', 'Loyalty List');
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
        list.Id, list.TranDate, list.ExpiryDate, list.Status, list.Source,
        list.Type, list.TotalPoints, list.EarntPoints, list.ConsumedPoints, list.UnusedPoints
      ];
      this.source.localdata.push(tempData);
    }

    // this.source.localdata = this.groupList;


    this.LoyaltyGrid.updatebounddata();
    this.source.localdata.length = 0;
    if (this.availDeleteState) {
      this.LoyaltyGrid.clearselection();
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

  Rowdoubleclick(event) {
    
    this.selectedData = event.args.row.bounddata;
    if (this.selectedData.type === 'Credit') {
      this.LoyaltyType = 'Credit';
    } else if (this.selectedData.type === 'Debit') {
      this.LoyaltyType = 'Debit';
    }
    this.openDialog();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(LoyaltyDetailPage, {
      // width: '250px',
      panelClass: 'loyalty-modal-content',
      data: { ContactCode: this.ContactCode, LoyaltyType: this.LoyaltyType }
    });

    dialogRef.afterClosed().subscribe(result => {
      
      this.LoyaltyType = result;
    });
  }

  goBack() {
    this.LoyaltyComponent.emit('close');
  }

}
