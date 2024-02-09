import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { debounceTime } from 'rxjs/operators';
import { ComponentOutValue } from 'src/app/model';
import { LoadingService, ToastService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { ChargeNewService } from './services/charge-new.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChargeInstance } from '../../financial-charges/charge-list/charge-list.component.type';

@Component({
  selector: 'app-charge-new',
  templateUrl: './charge-new.component.html',
  styleUrls: ['./charge-new.component.scss'],
})
export class ChargeNewComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Input() ChargeId: string = '';
  @Input() ChargeType: string = '';
  @Input() ChargeData: any;
  @Output('ChargeFormComponent') ChargeFormComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();



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

  chargeId: string = '';
  minEndDate: any;

  constructor(
    private loading: LoadingService,
    private chargeService: ChargeNewService,
    private tranService: TranService,
    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService,
    private dialogRef: MatDialogRef<ChargeNewComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { ContactCode: string; ChargeId: string; ChargeType: string; ChargeData: ChargeInstance }
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
      tax: ['',]
    });

    this.chargeForm.get('retailUnitPrice').valueChanges.subscribe((result) => {
      if (this.priceLimit) {
        if (result > this.priceLimit.maximum || result < this.priceLimit.minimum) {
          this.chargeForm.get('retailUnitPrice').setErrors({ invalid: true });
        }
      }

      if (this.chargeForm.get('retailUnitPrice').valid) {
        this.getTotalCharge();
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

      if (this.ChargeType === 'update' && this.ChargeData?.discount !== 'None') {
        if (result === 'Percentage') {
          this.chargeForm.get('retailDiscount').setValue(this.ChargeData?.discount);
        } else {
          this.chargeForm.get('retailDiscount').setValue(this.globService.getAmountFromCurrency(this.ChargeData?.discount));
        }
      }
    }
    this.getTotalCharge();
  }

  async ngOnInit() {
    this.chargeForm.get('discountType').setValue('None');

    await this.loading.present();
    if (this.ChargeType === 'update') {
      this.chargeForm.removeControl('charge');

      // this.chargeForm.get('code').setValue(this.ChargeData?.code);
      this.chargeForm.get('addDescription').setValue(this.ChargeData?.description);
      this.chargeForm.get('retailQuantity').setValue(this.ChargeData?.quantity);
      this.chargeForm.get('retailUnitPrice').setValue(this.ChargeData?.unit_price);
      this.chargeForm.get('discountType').setValue(this.ChargeData?.discount_type);
      this.chargeForm.get('note').setValue(this.ChargeData?.additional_description);
      this.chargeForm.get('Cost').setValue(this.ChargeData?.cost);
      this.chargeForm.get('NumberOfInstances').setValue(this.ChargeData?.instances);
      this.chargeForm.get('CustomerReference').setValue(this.ChargeData?.customer_reference);
      this.chargeForm.get('Reference').setValue(this.ChargeData?.reference);
      this.chargeForm.get('OtherReference').setValue(this.ChargeData?.other_reference);
      this.chargeForm.get('startDateTime').setValue(this.globService.getDateTimeWithString('YYYY-MM-DDTHH:mm', (this.ChargeData?.start)));

    } else {

      this.filterChargeList = this.filter('');

      this.chargeForm.get('charge').valueChanges.pipe(debounceTime(1000)).subscribe(async (result: any) => {
        
        if (result) {
          if (this.availableCall) {
            this.showSpinner = true;
            await this.getChargeList();
            this.showSpinner = false;
            this.filterChargeList = this.filter(result);
            if (this.filterChargeList.length === 0) {
              this.chargeForm.get('charge').setValue(null);
            } else {
            }
          }
          this.availableCall = true;
        }
      });

      // await this.getChargeList();
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
    this.chargeId = '';
    for (let list of this.filterChargeList) {
      if (this.currentCharge === list.name) {
        this.chargeId = list.id;
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
    await this.getChargeDetail(this.chargeId);
    await this.getChargeByCode(this.chargeId);
  }

  async getChargeDetail(chargeId) {
    try {
      const result = await this.chargeService.getDefinitionCharge(chargeId).toPromise();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      

      this.chargeDetail = convResult;

      this.chargeForm.get('addDescription').setValue(convResult.billdescription);

      this.chargeForm.get('retailUnitPrice').setValue(this.chargeDetail?.defaultprice);
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
    // try {
    //   const result = await this.chargeService.getCurrentCharge(this.ChargeId).toPromise();
    //   const convResult = this.globService.ConvertKeysToLowerCase(result);
    //   
    //   if (result === null) {
    //     this.tranService.errorMessage('no_current_charge');
    //   } else {
    //     
    //     this.chargeUpdate = convResult;
    //     this.chargeForm.get('addDescription').setValue(convResult.description);
    //     this.chargeForm.get('startDateTime').setValue(this.globService.getDateTimeWithString('YYYY-MM-DDTHH:mm', convResult.from));
    //     if (this.chargeUpdate.displayenddate) {
    //       this.chargeForm.addControl('endDateTime', new FormControl('', Validators.required));
    //       if (convResult.to === 'On-going') {
    //       } else {
    //         this.chargeForm.get('endDateTime').setValue(this.globService.getDateTimeWithString('YYYY-MM-DDTHH:mm', convResult.to));
    //       }
    //     } else {
    //       this.chargeForm.removeControl('endDateTime');
    //     }
    //     this.chargeForm.get('retailUnitPrice').setValue(convResult.price);
    //     this.chargeForm.get('retailQuantity').setValue(convResult.quantity);
    //     // this.chargeForm.get('retailDiscount').setValue(convResult.quantity);
    //     if (!convResult.discountpercentage && !convResult.discountamount) {
    //       this.chargeForm.get('discountType').setValue('None');
    //       this.chargeForm.removeControl('retailDiscount');
    //     } else {
    //       if (convResult.discountpercentage && convResult.discountpercentage > 0) {
    //         this.chargeForm.get('discountType').setValue('Percentage');
    //         this.chargeForm.get('retailDiscount').setValue(convResult.discountpercentage);
    //       } else {
    //         this.chargeForm.get('discountType').setValue('Fixed');
    //         this.chargeForm.get('retailDiscount').setValue(convResult.discountamount);
    //       }
    //     }
    //     // this.chargeForm.get('discountType').setValue(convResult.quantity);
    //     this.chargeForm.get('Cost').setValue(convResult.cost);
    //     // this.chargeForm.get('NumberOfInstances').setValue(convResult.cost);
    //     this.chargeForm.get('CustomerReference').setValue(convResult.customerreference);
    //     this.chargeForm.get('Reference').setValue(convResult.reference);
    //     this.chargeForm.get('OtherReference').setValue(convResult.otherreference);
    //     if (!this.chargeUpdate.editable || this.chargeUpdate.invoicedto) {
    //       this.chargeForm.disable();
    //     } else {
    //     }
    //   }
    // } catch (error) {
    //   
    //   this.tranService.errorMessage(error);
    // }
  }

  async getChargeList() {

    this.chargeList = [];
    const reqData = {
      SearchString: this.chargeForm.get('charge').value
    };

    try {
      const result = await this.chargeService.getSearchAccountCharge(this.ContactCode, this.globService.convertRequestBody(reqData)).toPromise();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      
      if (convResult.length === 0) {
        this.chargeForm.get('charge').setErrors({ invalid: true });
      } else {
        for (let list of convResult) {
          if (list.frequency === 'One-Off' && list.frequencyid === 'I') {
            this.chargeList.push(list);
          }
        }
      }
    } catch (error) {
      this.tranService.errorMessage(error);
    }
  }

  get f() {
    return this.chargeForm.controls;
  }

  async submitForm() {
    if (this.chargeForm.valid) {
      if (this.ChargeType === 'update') {
        await this.updateCharge();
      } else {
        await this.newCharge();
      }
    }
  }

  async newCharge() {
    let data = this.chargeForm.value;
    data.totalCharge = this.totalCharge;
    data.code = this.chargeId;

    data.endDateTime = await this.tranService.convertText('on_going').toPromise();

    switch (this.chargeForm.get('discountType').value) {
      case 'None':
        data.discount = await this.tranService.convertText('none').toPromise();
        break;
      case 'Percentage':
        data.discount = this.chargeForm.get('retailDiscount').value;
        break;
      case 'Fixed':
        data.discount = this.globService.getCurrencyConfiguration(this.chargeForm.get('retailDiscount').value);
        break;

      default:
        break;
    }

    this.dialogRef.close();
  }

  async updateCharge() {
    let data = this.chargeForm.value;
    data.totalCharge = this.totalCharge;
    data.code = this.ChargeData?.code;

    data.endDateTime = await this.tranService.convertText('on_going').toPromise();

    switch (this.chargeForm.get('discountType').value) {
      case 'None':
        data.discount = await this.tranService.convertText('none').toPromise();
        break;
      case 'Percentage':
        data.discount = this.chargeForm.get('retailDiscount').value;
        break;
      case 'Fixed':
        data.discount = this.globService.getCurrencyConfiguration(this.chargeForm.get('retailDiscount').value);
        break;

      default:
        break;
    }
    this.dialogRef.close();
  }

  changeDefaultAmount() {
    if (this.useDefaultAmount) {
      this.chargeForm.get('retailUnitPrice').setValue(this.chargeDetail.price);
    }
  }

  submitTrigger() {
    document.getElementById('chargeNewInvoiceForm').click();
  }

  goBack() {
    // this.ChargeFormComponent.emit({ type: 'list' });
    this.dialogRef.close();
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

      this.getChargeTax(this.totalCharge);
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
  }

  changeMoreState() {
    this.moreState = !this.moreState;
  }

  async getChargeTax(totalAmount) {
    await this.loading.present();
    this.chargeService.ChargeTax(this.ContactCode, this.chargeId, totalAmount).subscribe(async (result: any) => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

}
