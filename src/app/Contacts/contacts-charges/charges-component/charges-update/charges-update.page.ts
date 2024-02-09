import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ChargesService } from '../services/charges.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { LoadingService, TranService } from 'src/services';

import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from 'src/services/global-service.service';
import { ChargeItem } from 'src/app/model';

@Component({
  selector: 'app-charges-update',
  templateUrl: './charges-update.page.html',
  styleUrls: ['./charges-update.page.scss'],
})
export class ChargesUpdatePage implements OnInit {

  @Input() ContactCode: string = '';
  @Input() Code: string = '';
  @Output('ChargeUpdateComponent') ChargeUpdateComponent: EventEmitter<string> = new EventEmitter<string>();
  

  pageTitle: string = '';
  chargeCode: string = '';

  chargeForm: UntypedFormGroup;
  desList = [
    {
      'text': 'dial_usage',
      'value': ''
    },
    {
      'text': 'dial_isdn_usage',
      'value': ''
    },
    {
      'text': 'installation',
      'value': ''
    }
  ];
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
  useDefaultAmount: boolean = false;
  applyDiscount: boolean = false;
  discountType: string = 'fixed';
  useDefaultAmountWhole: boolean = false;

  totalCharge: number = 0;
  totalChargeStr: string = '';

  constructor(
    private loading: LoadingService,
    private chargeService: ChargesService,
    private tranService: TranService,
    
    private navCtrl: NavController,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    public globService: GlobalService
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('update_charge').subscribe(value => {
      this.pageTitle = value;
    });

    
    for (const list of this.desList) {
      this.tranService.convertText(list.text).subscribe(value => {
        list.value = value;
      });
    }

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

    this.chargeCode = this.route.snapshot.params['id'];

    this.chargeForm = this.formBuilder.group({
      description: ['', Validators.required],
      addDescription: [''],
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endDate: [''],
      endTime: [''],
      retailUnitPrice: ['', Validators.required],
      retailQuantity: ['', Validators.required],
      retailDiscount: ['', Validators.required],
      disUnitPrice: [''],
      disQuantity: [''],
      disDiscount: [''],
      wholeUnitPrice: ['', Validators.required],
      wholeQuantity: ['', Validators.required],
      wholeCost: ['', Validators.required],
      note: [''],
    });
    this.getCurrentCharge();
  }

  ngOnInit() {
  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  async getCurrentCharge() {
    await this.loading.present();
    const reqParam = {
      ContactCode: this.ContactCode,
      'Code': this.chargeCode
    };
    this.chargeService.getCurrentCharge(reqParam).subscribe(async (result: ChargeItem[]) => {
      await this.loading.dismiss();
      

      if (result === null) {
        this.tranService.errorMessage('no_current_charge');
      } else {
        for (const list of result) {
          if (list.Code === this.chargeCode) {
            this.chargeForm.controls.addDescription.setValue(list.Description);
            this.chargeForm.controls.startDate.setValue(list.ChargeStart);
            this.chargeForm.controls.endDate.setValue(list.ChargeEnd);
            this.chargeForm.controls.retailUnitPrice.setValue(list.AmountDefault);
            this.chargeForm.controls.wholeUnitPrice.setValue(list.CostTax);
            if (list.Discount === 'Yes') {
              this.applyDiscount = true;
            } else {
              this.applyDiscount = false;
            }
            this.checkEndDate();
            this.changeApplyDiscount();
          }
        }
      }

    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    })
  }

  async updateCharge() {
    await this.loading.present();
    this.chargeService.updateCharge().subscribe(async (result: any) => {
      
      await this.loading.dismiss();
      this.navCtrl.navigateRoot(['Charges/charge-list', { replaceUrl: true }])
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  checkEndDate() {
    if (this.endDateCheck) {
      this.chargeForm.setControl('endDate', new UntypedFormControl(''));
    } else {
      this.chargeForm.setControl('endDate', new UntypedFormControl({ value: '', disabled: true }));
    }
  }

  changeDefaultAmount() {

  }

  changeApplyDiscount() {
    if (this.applyDiscount) {
      this.switchDiscountType();
    } else {
      this.chargeForm.setControl('disUnitPrice', new UntypedFormControl({ value: '', disabled: true }));
      this.chargeForm.setControl('disQuantity', new UntypedFormControl({ value: '', disabled: true }));
      this.chargeForm.setControl('disDiscount', new UntypedFormControl({ value: '', disabled: true }));
    }
  }

  changeDefaultAmountWhole() {

  }

  newCharge() {

  }

  submitTrigger() {
    document.getElementById('submitButton').click();
  }

  goBack() {
    this.ChargeUpdateComponent.emit('close');
  }

  getTotalCharge() {
    this.totalCharge = 0;
    this.totalChargeStr = this.globService.getCurrencyConfiguration(this.totalCharge);
    let retailPrice = parseFloat(this.chargeForm.controls.retailUnitPrice.value) *
      parseFloat(this.chargeForm.controls.retailQuantity.value) -
      parseFloat(this.chargeForm.controls.retailDiscount.value);

    let wholePrice = parseFloat(this.chargeForm.controls.wholeUnitPrice.value) *
      parseFloat(this.chargeForm.controls.wholeQuantity.value) +
      parseFloat(this.chargeForm.controls.wholeCost.value);

    let disPrice = 0;
    if (this.applyDiscount) {
      if (this.discountType === 'fixed') {
        disPrice = parseFloat(this.chargeForm.controls.disDiscount.value);
      } else {
        disPrice = parseFloat(this.chargeForm.controls.disUnitPrice.value) *
          parseFloat(this.chargeForm.controls.disQuantity.value) / 100;
      }
    }
    if (retailPrice.toString() === 'NaN') {
      retailPrice = 0;
    }

    if (wholePrice.toString() === 'NaN') {
      wholePrice = 0;
    }

    if (disPrice.toString() === 'NaN') {
      disPrice = 0;
    }

    

    this.totalCharge = retailPrice + wholePrice - disPrice;
    this.totalChargeStr = this.globService.getCurrencyConfiguration(this.totalCharge);

  }

  switchDiscountType() {
    if (this.discountType === 'fixed') {
      this.chargeForm.setControl('disUnitPrice', new UntypedFormControl({ value: '', disabled: true }));
      this.chargeForm.setControl('disQuantity', new UntypedFormControl({ value: '', disabled: true }));
      this.chargeForm.setControl('disDiscount', new UntypedFormControl(''));
    } else {
      this.chargeForm.setControl('disUnitPrice', new UntypedFormControl(''));
      this.chargeForm.setControl('disQuantity', new UntypedFormControl(''));
      this.chargeForm.setControl('disDiscount', new UntypedFormControl({ value: '', disabled: true }));
    }
  }

}
