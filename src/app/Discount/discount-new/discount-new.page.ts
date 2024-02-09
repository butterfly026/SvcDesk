import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { DiscountNewItem } from 'src/app/model';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { DiscountNewService } from './services/discount-new.service';
import { LoadingService, ToastService, TranService } from 'src/services';

import { NavController } from '@ionic/angular';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';

import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-discount-new',
  templateUrl: './discount-new.page.html',
  styleUrls: ['./discount-new.page.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: navigator.language },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class DiscountNewPage implements OnInit, AfterViewInit {

  @ViewChild('myGridDiscounNew') myGridDiscounNew: jqxGridComponent;

  discountList: Array<DiscountNewItem> = [];

  

  selectIndex: number;
  selectedData: any;
  gridWidth: any;
  gridContentWidth = '';

  pageTitle: string = '';

  discountForm: UntypedFormGroup;
  timeType: string = '';

  startTime = [
    {
      'text': 'now',
      'value': ''
    },
    {
      'text': 'later',
      'value': ''
    }
  ];

  source = {
    localdata: [],
    datafields: [
      { name: 'discount', type: 'string', map: '0' },
      { name: 'start', type: 'string', map: '1' },
      { name: 'end', type: 'string', map: '2' },
      { name: 'package', type: 'string', map: '3' },
      { name: 'package_status', type: 'string', map: '4' },
      { name: 'comment', type: 'string', map: '5' },
      { name: 'default_amount', type: 'string', map: '6' },
      { name: 'terminal_discount', type: 'string', map: '7' },
      { name: 'user_edit', type: 'string', map: '8' },
      { name: 'edit_code', type: 'string', map: '9' },
    ],
    datatype: 'array'
  };

  dataAdapter: any = new jqx.dataAdapter(this.source);

  columns = [
    { text: '', datafield: 'discount', width: 120 },
    { text: '', datafield: 'start', width: 120 },
    { text: '', datafield: 'end', width: 120 },
    { text: '', datafield: 'package', width: 130 },
    { text: '', datafield: 'package_status', width: 130 },
    { text: '', datafield: 'comment', width: 100 },
    { text: '', datafield: 'default_amount', width: 100 },
    { text: '', datafield: 'terminal_discount', width: 100 },
    { text: '', datafield: 'user_edit', width: 100 },
    { text: '', datafield: 'edit_code', width: 100 }
  ];

  endDateCheck: boolean = false;

  constructor(
    private loading: LoadingService,
    private discountService: DiscountNewService,
    private tranService: TranService,
    
    private cdr: ChangeDetectorRef,
    private navCtrl: NavController,
    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('new_discount').subscribe(value => {
      this.pageTitle = value;
    });
    

    this.setGridWidth();

    for (let i = 0; i < this.columns.length; i++) {
      this.tranService.convertText(this.columns[i].datafield).subscribe(value => {
        this.columns[i].text = value;
      });
    }

    for (const list of this.startTime) {
      this.tranService.convertText(list.text).subscribe(value => {
        list.value = value;
      });
    }

    this.discountForm = this.formBuilder.group({
      'startDate': ['', Validators.required],
      'endDate': [''],
      'time': ['', Validators.required]
    });
    this.switchTimeType();
    this.getDiscountList();
  }

  ngOnInit() {
  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  ngAfterViewInit() {
    this.myGridDiscounNew.selectrow(0);
    setTimeout(() => {
      this.selectRow();
    }, 1000);
  }

  async getDiscountList() {
    this.discountList = [];
    await this.loading.present();
    this.discountService.getDiscountList().subscribe(async (result: DiscountNewItem[]) => {
      
      await this.loading.dismiss();
      if (result === null) {
        this.tranService.errorMessage('no_discounts');
      } else {
        for (const list of result) {
          this.discountList.push(list);
        }
        this.setGridData();
      }
    }, async (error: any) => {
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
    this.selectIndex = this.myGridDiscounNew.getselectedrowindex();
    this.selectedData = this.myGridDiscounNew.getrowdata(this.selectIndex);
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
    this.myGridDiscounNew.exportview('xlsx', 'Discount New');
  }

  setGridData() {
    for (const list of this.discountList) {
      const tempData = [
        list.Discount, list.Start, list.End, list.Package, list.PackageStatus, list.Comment, list.DefaultAmount,
        list.TerminalDiscount, list.UserEdit, list.EditCode,
      ];
      this.source.localdata.push(tempData);
    }

    this.myGridDiscounNew.updatebounddata();

    this.source.localdata.length = 0;
  }

  goBack() {
    this.navCtrl.pop();
  }

  async newDiscount() {
    await this.loading.present();
    this.discountService.addNewDiscount().subscribe(async (result: DiscountNewItem[]) => {
      
      await this.loading.dismiss();
      if (result === null) {
      } else {
        this.navCtrl.navigateRoot(['Discount/discount-list', { replaceUrl: true }]);
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  submitTrigger() {
    document.getElementById('submitButton').click();
  }

  switchTimeType() {
    if (this.timeType === 'end_date') {
      this.discountForm.setControl('endDate', new UntypedFormControl(''));
    } else if (this.timeType === 'on_going') {
      this.discountForm.setControl('endDate', new UntypedFormControl({ value: '', disabled: true }));
    } else {
      this.discountForm.setControl('endDate', new UntypedFormControl(''));
    }
  }

}
