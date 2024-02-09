import { Component, EventEmitter, Input, OnInit, Inject, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { debounceTime } from 'rxjs/operators';
import { LoadingService, ToastService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { ChargeFormService } from './services/charge-form.service';
import { SpinnerService } from 'src/app/Shared/services';
import { MatAlertService } from 'src/app/Shared/services/mat-alert.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ServiceChargeItem, ValidateType } from '../charges.types';

@Component({
  selector: 'app-charge-form',
  templateUrl: './charge-form.component.html',
  styleUrls: ['./charge-form.component.scss'],
})
export class ChargeFormComponent implements OnInit {
  @Input() ChargeId: string = '';
  @Input() Title: string = '';
  @Input() ServiceReference: string = '';
  @Input() ServiceId: string = '';
  @Input() ReadOnly: boolean = false;
  @Input() ChargeType: string = '';
  @Input() Type: boolean = false;
  @Output('ChargeFormComponent') ChargeFormComponent: EventEmitter<string> = new EventEmitter<string>();



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
  chargeUpdate: any;

  constructor(
    private chargeService: ChargeFormService,
    private tranService: TranService,
    private spinnerService: SpinnerService,
    private formBuilder: UntypedFormBuilder,
    private matAlert: MatAlertService,
    public globService: GlobalService,
    private dialogRef: MatDialogRef<ChargeFormComponent>,
    @Inject(MAT_DIALOG_DATA) private dlgData: {
      ServiceReference: string,
      ChargeType: string,
      ChargeId: string,
      ServiceId: string,
      Title: string,
      ReadOnly: boolean,
    }
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
        this.selectType();
      }
    });

  }

  selectType() {
    const result = this.chargeForm.get('discountType').value;
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

  ngOnInit() {
    if (this.dlgData?.ServiceReference) {
      this.ServiceReference = this.dlgData.ServiceReference;
    }
    if (this.dlgData?.ChargeType) {
      this.ChargeType = this.dlgData.ChargeType;
    }
    if (this.dlgData?.ChargeId) {
      this.ChargeId = this.dlgData.ChargeId;
    }
    if (this.dlgData?.ServiceId) {
      this.ServiceId = this.dlgData.ServiceId;
    }
    if (this.dlgData?.Title) {
      this.Title = this.dlgData.Title;
    }
    if (this.dlgData?.ReadOnly) {
      this.ReadOnly = this.dlgData.ReadOnly;
    }
    this.chargeForm.get('discountType').setValue('None');
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
    this.getChargeData();
    this.selectType();

  }

  setFocusType(idName) {
    if (document.getElementById(idName) === null || typeof (document.getElementById(idName)) === 'undefined') {
      setTimeout(() => {
        this.setFocusType(idName);
      }, 500);
    } else {
      document.getElementById(idName).click();
    }
  }

  async getChargeData() {
    await this.spinnerService.loading();
    if (this.ChargeType === 'update') {
      this.chargeForm.removeControl('charge');
      await this.getCurrentCharge();
    } else {
      this.filterChargeList = this.filter('');
    }
    await this.spinnerService.end();
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

    this.setFocusType('addDescription');
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
      }
    } catch (error) {
      this.tranService.matErrorMessage(error, (title, button, content) => {
        this.matAlert.alert(content, title, button);
      });
    }
  }

  async getChargeByCode(ChargeCode) {

    try {
      const result = await this.chargeService.getLimitAccountDefinition(this.ServiceReference, ChargeCode).toPromise();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.priceLimit = convResult;
    } catch (error) {

      this.tranService.matErrorMessage(error, (title, button, content) => {
        this.matAlert.alert(content, title, button);
      });
    }
  }

  async getCurrentCharge() {
    this.spinnerService.loading();
    await this.chargeService.getCurrentCharge(this.ChargeId).subscribe(async (result) => {
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.spinnerService.end();
      if (result === null) {

        this.tranService.matErrorMessage('no_current_charge', (title, button, content) => {
          this.matAlert.alert(content, title, button);
        });
      } else {

        this.chargeUpdate = convResult;
        this.chargeForm.get('addDescription').setValue(convResult.description);
        this.chargeForm.get('startDateTime').setValue(this.globService.getDateTimeWithString('YYYY-MM-DDTHH:mm', convResult.from));
        if (this.chargeUpdate.displayenddate) {
          this.chargeForm.addControl('endDateTime', new UntypedFormControl('', Validators.required));
          if (convResult.to === 'On-going') {
          } else {
            this.chargeForm.get('endDateTime').setValue(this.globService.getDateTimeWithString('YYYY-MM-DDTHH:mm', convResult.to));
          }
        } else {
          this.chargeForm.removeControl('endDateTime');
        }
        this.chargeForm.get('retailUnitPrice').setValue(convResult.price);
        this.chargeForm.get('retailQuantity').setValue(convResult.quantity);
        // this.chargeForm.get('retailDiscount').setValue(convResult.quantity);
        if (!convResult.discountpercentage && !convResult.discountamount) {
          this.chargeForm.get('discountType').setValue('None');
          this.chargeForm.removeControl('retailDiscount');
        } else {
          if (convResult.discountpercentage && convResult.discountpercentage > 0) {
            this.chargeForm.get('discountType').setValue('Percentage');
            this.chargeForm.get('retailDiscount').setValue(convResult.discountpercentage);
          } else {
            this.chargeForm.get('discountType').setValue('Fixed');
            this.chargeForm.get('retailDiscount').setValue(convResult.discountamount);
          }
        }
        // this.chargeForm.get('discountType').setValue(convResult.quantity);
        this.chargeForm.get('Cost').setValue(convResult.cost);
        // this.chargeForm.get('NumberOfInstances').setValue(convResult.cost);
        this.chargeForm.get('CustomerReference').setValue(convResult.customerreference);
        this.chargeForm.get('Reference').setValue(convResult.reference);
        this.chargeForm.get('OtherReference').setValue(convResult.otherreference);
        if (!this.chargeUpdate.editable || this.chargeUpdate.invoicedto) {
          this.chargeForm.disable();
        } else {
        }
      }
    }, async (error: any) => {
      await this.spinnerService.end();
      this.tranService.matErrorMessage(error, (title, button, content) => {
        this.matAlert.alert(content, title, button);
      });
    });
  }

  async getChargeList() {
    const reqData = {
      SearchString: this.chargeForm.get('charge').value
    };

    try {
      const result = await this.chargeService.getSearchAccountCharge(this.ServiceReference, this.globService.convertRequestBody(reqData)).toPromise();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.chargeList = convResult;
      if (this.chargeList.length === 0) {
        this.chargeForm.get('charge').setErrors({ invalid: true });
      }
    } catch (error) {
      this.tranService.matErrorMessage(error, (title, button, content) => {
        this.matAlert.alert(content, title, button);
      });
    }
  }

  get f() {
    return this.chargeForm.controls;
  }

  async submitForm() {
    if (this.chargeForm.valid) {
      if (this.ChargeType === '') {
        await this.validateChargeData(true);
      } else {
        await this.validateChargeData(false);
      }
    }
  }

  async validateChargeData(isNew: boolean) {
    const validateData: ValidateType = {

      DefinitionId: this.chargeDetail.id, //
      From: this.chargeForm.get('startDateTime').value,
      To: (this.chargeDetail?.frequency != 'One-Off' || this.chargeUpdate?.displayenddate) ? this.chargeForm.get('endDateTime').value : this.chargeForm.get('startDateTime').value,
      Amount: this.totalCharge,
      Quantity: this.chargeForm.get('retailQuantity')?.value,
      UnitPrice: this.chargeForm.get('retailUnitPrice')?.value,
      Frequency: isNew ? this.chargeDetail?.frequency.replace('-', '').replace(' ', '') : this.chargeUpdate?.frequency.replace('-', '').replace(' ', ''),
      CheckLimits: false,
    };
    if (this.chargeForm.get('discountType').value == 'Fixed') {
      let retailDiscountValue = this.chargeForm.get('retailDiscount')?.value;
      if (typeof retailDiscountValue === 'string') {
        retailDiscountValue = retailDiscountValue.replace('$', '');
      }
      validateData.Discount = parseFloat(retailDiscountValue);
    }
    if (this.chargeForm.get('discountType').value == 'Percentage') {
      let retailDiscountValue = this.chargeForm.get('retailDiscount')?.value;
      if (typeof retailDiscountValue === 'string') {
        retailDiscountValue = retailDiscountValue.replace('$', '');
      }
      validateData.DiscountPercentage = parseFloat(retailDiscountValue);
    }
    if (this.moreState && this.chargeForm.get('Cost').value) {
      validateData.Cost = this.chargeForm.get('Cost').value;
    }
    await this.spinnerService.loading();
    if (isNew) {
      this.chargeService.validateNew(this.ServiceReference, validateData).subscribe(async (validResult: any) => {
        await this.spinnerService.end();
        if (validResult && validResult.length > 0) {
          let msgStr = '';
          validResult.forEach(val => {
            const msg = `${val.Field} : ${val.Detail}`;
            msgStr += !msgStr ? (msg + '\n') : msg;
          })
          this.matAlert.alert(this.tranService.instant('ValidationWarningsNew') + '\n' + msgStr,
            this.tranService.instant('Warning'),
            this.tranService.instant('Yes'),
            this.tranService.instant('No')).subscribe(async (result) => {
              if (result) {
                await this.createNewCharge();
              }
            });
        } else {
          await this.createNewCharge();
          
        }
      }, async (error: any) => {
        await this.spinnerService.end();
        this.tranService.matErrorMessage(error, (title, button, content) => {
          this.matAlert.alert(content, title, button);
        });
      });
    } else {
      this.chargeService.validateUpdate(this.ChargeId, validateData).subscribe(async (validResult: any) => {
        await this.spinnerService.end();
        if (validResult && validResult.length > 0) {
          let msgStr = '';
          validResult.forEach(val => {
            const msg = `${val.Field} : ${val.Detail}`;
            msgStr += !msgStr ? (msg + '\n') : msg;
          })
          this.matAlert.alert(this.tranService.instant('ValidationWarningsUpdate') + '\n' + msgStr,
            this.tranService.instant('Warning'),
            this.tranService.instant('Yes'),
            this.tranService.instant('No')).subscribe(async (result) => {
              if (result) {
                await this.updateCharge();
              }
            });
        } else {
          await this.updateCharge();
        }
      }, async (error: any) => {
        await this.spinnerService.end();
        this.tranService.matErrorMessage(error, (title, button, content) => {
          this.matAlert.alert(content, title, button);
        });
      });
    }
  }

  async createNewCharge() {

    const reqData: ServiceChargeItem = {
      DefinitionId: this.chargeDetail.id, //
      From: this.chargeForm.get('startDateTime').value,
      To: (this.chargeDetail?.frequency != 'One-Off' || this.chargeUpdate?.displayenddate) ? this.chargeForm.get('endDateTime').value : this.chargeForm.get('startDateTime').value,
      Amount: this.totalCharge,
      Units: this.chargeDetail.unit, //
      Quantity: parseInt(this.chargeForm.get('retailQuantity')?.value),
      UnitPrice: parseFloat(this.chargeForm.get('retailUnitPrice')?.value),
      UnitDiscount: parseFloat(this.chargeForm.get('retailDiscount')?.value),
      UnitDiscountPercentage: parseFloat(this.chargeForm.get('retailDiscount')?.value),
      Cost: parseFloat(this.chargeForm.get('Cost').value),
      AdjustToDisconnection: false,
      OverrideDescription: 'Paper bill  - approved by Gordon',
      InvoiceDescription: 'Paper bill  - as discussed',
      Frequency: this.chargeDetail?.frequency.replace('-', '').replace(' ', ''),
      Prorated: this.chargeDetail.prorated,  //
      ChargeInAdvance: true,
      AdvancePeriods: 3,
      PlanInstanceId: 0,
      Note: this.chargeForm.get('note').value,
      CustomerReference: this.chargeForm.get('CustomerReference').value,
      Reference: this.chargeForm.get('Reference').value,
      OtherReference: this.chargeForm.get('OtherReference').value,
      ContraIfSuspended: false,
      ETF: false,
      CheckLimits: false
    };
    if (this.chargeDetail.frequency == 'NumberOfOccurences') {
      reqData.NumberOfInstances = this.chargeForm.get('NumberOfInstances').value;
    }
    await this.spinnerService.loading();
    this.chargeService.addNewCharge(this.ServiceReference, reqData).subscribe(async (result: any) => {
      await this.spinnerService.end();
      if (!this.Type) {
        this.dialogRef.close('ok');
      } else {
        this.ChargeFormComponent.emit('close');
      }
    }, async (error: any) => {
      await this.spinnerService.end();
      this.tranService.matErrorMessage(error, (title, button, content) => {
        this.matAlert.alert(content, title, button);
      });
    });
  }

  async updateCharge() {
    await this.spinnerService.loading();
    const reqData: ServiceChargeItem = {
      From: this.chargeForm.get('startDateTime').value,
      Reference: this.chargeForm.get('Reference').value,
      CustomerReference: this.chargeForm.get('CustomerReference').value,
      Cost: parseFloat(this.chargeForm.get('Cost').value),
      Note: this.chargeForm.get('note').value,
      Frequency: this.chargeUpdate?.frequency.replace('-', '').replace(' ', ''),
      OverrideDescription: 'Paper bill  - approved by Gordon',
      InvoiceDescription: 'Paper bill  - as discussed',
      Amount: this.totalCharge,
      Quantity: parseInt(this.chargeForm.get('retailQuantity')?.value),
      UnitPrice: parseFloat(this.chargeForm.get('retailUnitPrice')?.value),
      UnitDiscount: parseFloat(this.chargeForm.get('retailDiscount')?.value),
      UnitDiscountPercentage: parseFloat(this.chargeForm.get('retailDiscount')?.value),
      Units: this.chargeUpdate.unit, //      
      To: (this.chargeDetail?.frequency != 'One-Off' || this.chargeUpdate?.displayenddate) ? this.chargeForm.get('endDateTime').value : this.chargeForm.get('startDateTime').value,
      OtherReference: this.chargeForm.get('OtherReference').value,
      CheckLimits: false
    };
    if (this.chargeUpdate.frequency == 'NumberOfOccurences') {
      reqData.NumberOfInstances = this.chargeForm.get('NumberOfInstances').value;
    }
    await this.spinnerService.loading();
    this.chargeService.updateCharge(this.ChargeId, reqData).subscribe(async (result: any) => {
      await this.spinnerService.end();
      if (!this.Type) {
        this.dialogRef.close('ok');
      } else {
        this.ChargeFormComponent.emit('close');
      }
    }, async (error: any) => {
      await this.spinnerService.end();
      this.tranService.matErrorMessage(error, (title, button, content) => {
        this.matAlert.alert(content, title, button);
      });
    });
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
    if (!this.Type) {
      this.dialogRef.close();
    } else {
      this.ChargeFormComponent.emit('close');
    }
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
  }

  changeMoreState() {
    this.moreState = !this.moreState;
  }

}
