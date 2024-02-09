import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { DiscountEditService } from './services/discount-edit.service';
import { LoadingService, TranService } from 'src/services';

import { NavController } from '@ionic/angular';
import { DiscountItem } from 'src/app/model';
import { ActivatedRoute } from '@angular/router';

import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-discount-edit',
  templateUrl: './discount-edit.page.html',
  styleUrls: ['./discount-edit.page.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: navigator.language },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class DiscountEditPage implements OnInit {

  

  selectIndex: number;
  selectedData: any;
  gridWidth: any;
  gridContentWidth = '';

  pageTitle: string = '';

  discountForm: UntypedFormGroup;
  timeType: string = 'end_date';
  discountId: string = '';

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
  endTimeList = [
    {
      'text': 'end_of_day',
      'value': ''
    },
    {
      'text': 'later',
      'value': ''
    }
  ];
  endDateCheck: boolean = false;


  constructor(
    private loading: LoadingService,
    private discountService: DiscountEditService,
    private tranService: TranService,
    
    private cdr: ChangeDetectorRef,
    private navCtrl: NavController,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('edit_discount').subscribe(value => {
      this.pageTitle = value;
    });
    

    for (const list of this.startTime) {
      this.tranService.convertText(list.text).subscribe(value => {
        list.value = value;
      });
    }

    for (const list of this.endTimeList) {
      this.tranService.convertText(list.text).subscribe(value => {
        list.value = value;
      });
    }

    this.discountId = this.route.snapshot.params['id'];

    this.discountForm = this.formBuilder.group({
      'startDate': ['', Validators.required],
      'startTime': ['', Validators.required],
      'endDate': [''],
      'endTime': [''],
    });
    this.getCurrentDiscount();
  }

  ngOnInit() {
  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  goBack() {
    this.navCtrl.pop();
  }

  async getCurrentDiscount() {
    await this.loading.present();
    this.discountService.getCurrentDiscount(this.discountId).subscribe(async (result: DiscountItem[]) => {
      
      await this.loading.dismiss();
      if (result === null) {
        this.tranService.errorMessage('no_discounts');
      } else {
        for (const list of result) {
          if (list.DiscountId === this.discountId) {
            
          }
        }
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  async updateDiscount() {
    await this.loading.present();
    this.discountService.updateDiscount().subscribe(async (result: DiscountItem[]) => {
      
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
