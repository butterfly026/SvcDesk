import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { LoadingService, TranService } from 'src/services';

import { NavController } from '@ionic/angular';
import { GlobalService } from 'src/services/global-service.service';
import { ChargesService } from '../services/charges.service';
import * as moment from 'moment';

@Component({
  selector: 'app-charges-new',
  templateUrl: './charges-new.page.html',
  styleUrls: ['./charges-new.page.scss'],
})
export class ChargesNewPage implements OnInit {

  @Input() ContactCode: string = '';
  @Output('ChargesNewComponent') ChargesNewComponent: EventEmitter<string> = new EventEmitter<string>();

  

  pageTitle: string = '';

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

  minDate: Date = new Date();


  constructor(
    private loading: LoadingService,
    private chargeService: ChargesService,
    private tranService: TranService,
    
    private navCtrl: NavController,
    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('new_charge').subscribe(value => {
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

    this.chargeForm = this.formBuilder.group({
      description: ['', Validators.required],
      addDescription: [''],
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endDate: [''],
      endTime: [{ value: '', disabled: true }],
      retailUnitPrice: ['', Validators.required],
      retailQuantity: ['', Validators.required],
      retailDiscount: ['', Validators.required],
      disUnitPrice: [''],
      disQuantity: [''],
      disDiscount: [''],
      wholeUnitPrice: ['', Validators.required],
      wholeQuantity: ['', Validators.required],
      wholeCost: ['', Validators.required],
      CustomerReference: ['', Validators.maxLength(254)],
      OtherReference: ['', Validators.maxLength(254)],
      note: [''],
    });
    this.checkEndDate();
    this.changeApplyDiscount();

  }

  ngOnInit() {
  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  async newCharge() {
    let start = this.chargeForm.get('startDate').value;
    if (this.chargeForm.valid) {
      const reqData = {
        "Code": "PBF",
        "From": this.globService.getDateTimeRequest(this.chargeForm.get('startDate').value),
        "To": "",
        "AdjustToDisconnection": false,
        "Amount": "10.00",
        "Frequency": "Daily",
        "Prorated": true,
        "ChargeInAdvance": true,
        "AdvancePeriods": 3,
        "NumberOfInstances": 3,
        "OverrideDescription": "Paper bill  - approved by Gordon",
        "InvoiceDescription": "Paper bill  - as discussed",
        "Note": "Contacted customer",
        "OtherReference": this.chargeForm.get('OtherReference').value,
        "Units": "Each",
        "Quantity": "7",
        "UnitPrice": "5.00",
        "UnitDiscount": "2.50",
        "UnitDiscountPercentage": "2",
        "Cost": "9.00",
        "OverrideAnniversary": "2020-01-01 00:00:00",
        "RevenueAccount": "100-562-789",
        "ContraIfSuspended": false,
        CustomerReference: this.chargeForm.get('CustomerReference').value,
      }

      await this.loading.present();
      this.chargeService.addNewCharge(this.ContactCode, this.globService.convertRequestBody(reqData)).subscribe(async (result: any) => {
        
        await this.loading.dismiss();
        // this.navCtrl.navigateRoot(['Charges/charge-list', { replaceUrl: true }])
        this.ChargesNewComponent.emit('submit');
      }, async (error: any) => {
        await this.loading.dismiss();
        
        this.tranService.errorMessage(error);
      });
    }
  }

  checkEndDate() {
    if (this.endDateCheck) {
      // this.chargeForm.setControl('endTime', new FormControl('', Validators.required));
      this.chargeForm.setControl('endDate', new UntypedFormControl(''));
    } else {
      this.chargeForm.setControl('endDate', new UntypedFormControl({ value: '', disabled: true }));
      // this.chargeForm.setControl('endTime', new FormControl({ value: '', disabled: true }));
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

  submitTrigger() {
    document.getElementById('submitButton').click();
  }

  goBack() {
    this.ChargesNewComponent.emit('close')
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
