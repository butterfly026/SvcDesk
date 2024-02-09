import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { debounceTime } from 'rxjs/operators';
import { LoadingService, ToastService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { AccountChargeAddService } from './services/account-charge-add.service';

@Component({
  selector: 'app-account-charge-add',
  templateUrl: './account-charge-add.component.html',
  styleUrls: ['./account-charge-add.component.scss'],
})
export class AccountChargeAddComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Input() ChargeType: string = '';
  @Input() ChargeData: any;
  @Output('AccountChargeAddComponent') AccountChargeAddComponent: EventEmitter<any> = new EventEmitter<any>();

  

  chargeForm: UntypedFormGroup;
  desList = [
    { 'text': 'dial_usage', 'value': '' },
    { 'text': 'dial_isdn_usage', 'value': '' },
    { 'text': 'installation', 'value': '' }
  ];
  startTime = [
    { 'text': 'now', 'value': '' },
    { 'text': 'later', 'value': '' }
  ];
  endTimeList = [
    { 'text': 'end_of_day', 'value': '' },
    { 'text': 'later', 'value': '' }
  ];
  endDateCheck: boolean = false;
  useDefaultAmount: boolean = false;

  totalCharge: number = 0;
  totalChargeStr: string = '';

  chargeList: any[] = [];
  filterChargeList: any[] = [];

  currentCharge: any;
  availableCall: boolean = true;
  showSpinner: boolean = false;
  chargeDetail: any = {};
  priceLimit: any;

  discountTypeList: any[] = [
    { id: 'None', name: 'none' },
    { id: 'Percentage', name: 'percentage' },
    { id: 'Fixed', name: 'fixed' }
  ];

  quentityOptions = {
    align: 'left',
    allowNegative: true,
    decimal: '.',
    precision: 0,
    prefix: '',
    suffix: '',
    thousands: ',',
  };

  chargeAmount: number = 0;
  moreState: boolean = false;

  chargeUpdate: any = {};

  constructor(
    private loading: LoadingService,
    private chargeService: AccountChargeAddService,
    private tranService: TranService,
    
    private formBuilder: UntypedFormBuilder,
    private modalCtrl: ModalController,
    public globService: GlobalService
  ) {
    this.tranService.translaterService();

    
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
      charge: ['', Validators.required],
      addDescription: [''],
      startDateTime: ['', Validators.required],
      endDateTime: [''],
      retailUnitPrice: ['', Validators.required],
      retailQuantity: ['', Validators.required],
      retailDiscount: ['', Validators.required],
      discountType: [''],
      note: [''],
      Cost: [''],
      NumberOfInstances: [''],
      CustomerReference: [''],
      Reference: [''],
      OtherReference: [''],
      TotalCharge: ['',]
    });

    this.chargeForm.get('retailUnitPrice').valueChanges.subscribe((result) => {
      if (this.priceLimit) {
        if (result > this.priceLimit.maximum || result < this.priceLimit.minimum) {
          this.chargeForm.get('retailUnitPrice').setErrors({ invalid: true });
        }
      }
    });

    this.chargeForm.get('Cost').valueChanges.subscribe(result => {
      this.getTotalCharge();
    });

    this.chargeForm.get('NumberOfInstances').valueChanges.subscribe(result => {
      
      if (result > 13) {
        this.chargeForm.get('NumberOfInstances').setValue(13);
      }
    });

    this.chargeForm.get('discountType').valueChanges.subscribe((result: any) => {
      if (result) {
        this.selectType(result);
      }
    });

  }

  selectType(result) {
    if (result === 'None') {
      this.chargeForm.removeControl('retailDiscount');
    } else {
      this.chargeForm.addControl('retailDiscount', new UntypedFormControl(null, Validators.required));
      this.chargeForm.get('retailDiscount').reset();

      this.chargeForm.get('retailDiscount').valueChanges.subscribe((discount: any) => {
        if (result === 'Fixed') {
          if (discount && discount < 0) {
            this.chargeForm.get('retailDiscount').setErrors({ invalid: true });
          }
        }
      });
    }
    this.getTotalCharge();
  }

  async ngOnInit() {
    this.chargeForm.get('discountType').setValue('None');

    await this.loading.present();
    if (this.ChargeType === 'update') {
      this.chargeForm.removeControl('charge');
      await this.getCurrentCharge();
    } else {

      this.filterChargeList = this.filter('');

      this.chargeForm.get('charge').valueChanges.pipe(debounceTime(1000)).subscribe(async (result: any) => {
        
        if (result) {
          if (this.availableCall) {
            this.showSpinner = true;
            await this.getChargeList();
            this.showSpinner = false;
            this.filterChargeList = this.filter(result);
          }
          this.availableCall = true;
        }
      });

      await this.getChargeList();
    }
    await this.loading.dismiss();

  }

  filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.chargeList.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  async optionSelected(event) {
    this.availableCall = false;
    this.currentCharge = this.chargeForm.get('charge').value;
    let chargeId = '';
    for (let list of this.filterChargeList) {
      if (this.currentCharge === list.name) {
        chargeId = list.id;
      }
    }

    for (var key in this.chargeForm.controls) {
      if (key !== 'charge') {
        this.chargeForm.get(key).reset();
      }
    }

    this.totalCharge = 0;
    this.totalChargeStr = this.globService.getCurrencyConfiguration(this.totalCharge);

    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    this.chargeForm.get('startDateTime').setValue(this.globService.getDateTimeWithString('YYYY-MM-DDTHH:mm', today));
    this.chargeForm.get('retailQuantity').setValue('1');
    this.chargeForm.get('discountType').setValue('None');

    this.moreState = false;
    await this.getChargeDetail(chargeId);
    await this.getChargeByCode(chargeId);
  }

  async getChargeDetail(chargeId) {
    try {
      const result = await this.chargeService.getDefinitionCharge(chargeId).toPromise();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      

      this.chargeDetail = convResult;

      this.chargeForm.get('addDescription').setValue(convResult.billdescription);
      if (convResult.frequency === 'One-Off') {
        this.chargeForm.removeControl('endDateTime');
      } else {
        this.chargeForm.addControl('endDateTime', new UntypedFormControl('', Validators.required));
        let today = new Date();
        today.setHours(23);
        today.setMinutes(59);
        this.chargeForm.get('endDateTime').setValue(this.globService.getDateTimeWithString('YYYY-MM-DDTHH:mm', today));
        this.chargeUpdate['endDateTime'] = true;
      }
    } catch (error) {
      this.tranService.errorMessage(error);
    }
  }

  async getChargeByCode(ChargeCode) {

    try {
      const result = await this.chargeService.getLimitAccountDefinition(this.ContactCode, ChargeCode).toPromise();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.priceLimit = convResult;

    } catch (error) {
      this.tranService.errorMessage(error);
    }
  }

  async getCurrentCharge() {
    for (var keyForm in this.chargeForm.controls) {
      let available = false;
      for (var key in this.ChargeData) {
        if (keyForm.toLowerCase() === key.toLowerCase()) {
          available = true;
        }
      }

      if (available) {
        this.chargeForm.get(keyForm).setValue(this.ChargeData[keyForm.toLowerCase()]);
      } else {
        this.chargeForm.removeControl(keyForm);
        this.updateCharge[keyForm] = false;
      }
    }
  }

  async getChargeList() {
    const reqData = {
      SearchString: this.chargeForm.get('charge').value
    };

    try {
      const result = await this.chargeService.getSearchAccountCharge(this.ContactCode, reqData).toPromise();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.chargeList = convResult;
    } catch (error) {
      this.tranService.errorMessage(error);
    }
  }

  get f() {
    return this.chargeForm.controls;
  }

  async submitForm() {
    if (this.chargeForm.valid) {
      if (this.ChargeType === 'create') {
        await this.newCharge();
      } else {
        await this.updateCharge();
      }
    }
  }

  async newCharge() {
    this.modalCtrl.dismiss(this.chargeForm.value);
  }

  async updateCharge() {
    this.modalCtrl.dismiss(this.chargeForm.value);
  }

  changeDefaultAmount() {
    if (this.useDefaultAmount) {
      this.chargeForm.get('retailUnitPrice').setValue(this.chargeDetail.price);
    }
  }

  submitTrigger() {
    document.getElementById('submitButton').click();
  }

  goBack() {
    this.modalCtrl.dismiss();
  }

  getTotalCharge() {
    if (this.chargeForm.get('retailUnitPrice').valid && this.chargeForm.get('retailQuantity').valid) {
      this.totalCharge = 0;
      this.totalChargeStr = this.globService.getCurrencyConfiguration(this.totalCharge);
      const charge = parseFloat(this.chargeForm.get('retailUnitPrice').value) *
        parseFloat(this.chargeForm.get('retailQuantity').value);

      if (charge && charge.toString() !== 'Nan') {
        this.chargeAmount = charge;
      } else {
        this.chargeAmount = 0;
      }

      let retailPrice = this.chargeAmount;
      if (this.chargeForm.get('discountType').value === 'Fixed') {
        this.chargeForm.get('retailDiscount').enable();
        retailPrice = this.chargeAmount - this.chargeForm.get('retailDiscount').value;
        if (retailPrice < 0) {
          this.chargeForm.get('retailDiscount').setErrors({ invalid: true });
        }
      } else if (this.chargeForm.get('discountType').value === 'Percentage') {
        this.chargeForm.get('retailDiscount').enable();
        let discount = this.chargeForm.get('retailDiscount').value;
        if (parseFloat(discount) > 100) {
          discount = Number(discount) % 100;
        }
        retailPrice = this.chargeAmount - this.chargeAmount * parseFloat(discount) * 0.01;
      } else {
        retailPrice = this.chargeAmount;
      }

      if (retailPrice.toString() === 'NaN') {
        retailPrice = 0;
      }

      this.totalCharge = retailPrice;
      this.totalChargeStr = this.globService.getCurrencyConfiguration(this.totalCharge);
    } else {
      if (this.chargeForm.get('discountType').value === 'Fixed' || this.chargeForm.get('discountType').value === 'Percentage') {
        this.chargeForm.get('retailDiscount').disable();
      }
    }

    if (this.totalCharge) {
      if (this.chargeForm.get('Cost').value > this.totalCharge) {
        this.chargeForm.get('Cost').setErrors({ invalid: true });
      } else {
        this.chargeForm.get('Cost').setErrors(null);
      }
    }

    this.chargeForm.get('TotalCharge').setValue(this.totalCharge);
  }

  changeMoreState() {
    this.moreState = !this.moreState;
  }

}
