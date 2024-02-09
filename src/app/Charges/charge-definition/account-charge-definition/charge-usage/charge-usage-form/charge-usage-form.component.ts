import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ComponentOutValue } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { ChargeUsageFormService } from './services/usage-form.service';

@Component({
  selector: 'app-charge-usage-form',
  templateUrl: './charge-usage-form.component.html',
  styleUrls: ['./charge-usage-form.component.scss'],
})
export class ChargeUsageFormComponent implements OnInit, OnDestroy {
  @Input() ContactCode: string = '';
  @Input() ChargeData: any;
  @Input() currentList: any[] = [];

  @Output('ChargeDefinitionFormComponent') ChargeDefinitionFormComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  chargeForm: UntypedFormGroup;
  serviceTypeList = [];
  serviceTypeOriginList = [];

  oneTimeCall: boolean = true;
  chargeCheckList = {
    defaultValue: false,
    warnAbove: false,
    warnBelow: false,
  }

  lowLimitCurrencyOption: any;

  subList = [];

  currentDate: Date = new Date();

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService,
    private chargeService: ChargeUsageFormService,
    private modalCtrl: ModalController,
  ) {

    this.chargeForm = this.formBuilder.group({
      ServiceType: ['', Validators.required],
      DefaultValue: [0, Validators.required],
      LowerLimit: [0, Validators.required],
      UpperLimit: [0, Validators.required],
      WarnBelow: [{ disabled: true, value: 0 }, Validators.required],
      WarnBelowCheck: ['',],
      WarnAbove: [{ disabled: true, value: 0 }, Validators.required],
      WarnAboveCheck: ['',],
      From: ['', Validators.required],
      To: [{ disabled: true, value: '' }, Validators.required],
      dateCheck: ['onGoing', Validators.required],
    });

    this.chargeForm.get('WarnBelowCheck').valueChanges.subscribe(result => {
      if (result) {
        this.chargeForm.get('WarnBelow').enable();
      } else {
        this.chargeForm.get('WarnBelow').disable();
      }
    });

    this.chargeForm.get('WarnAboveCheck').valueChanges.subscribe(result => {
      if (result) {
        this.chargeForm.get('WarnAbove').enable();
      } else {
        this.chargeForm.get('WarnAbove').disable();
      }
    });

    this.chargeForm.get('dateCheck').valueChanges.subscribe(result => {
      if (result === 'to') {
        if (this.chargeForm.get('To').disabled) {
          this.chargeForm.get('To').enable();
        }
      } else {
        this.chargeForm.get('To').disable();
      }
    });

    this.chargeForm.get('WarnAbove').valueChanges.subscribe(result => {
      if (result) {
        let checkVal = this.chargeForm.get('WarnAboveCheck').value;
        if (!checkVal && !this.chargeCheckList.warnAbove) {
          this.chargeForm.get('WarnAboveCheck').setValue(true);
        }
      }
    });

    this.chargeForm.get('WarnBelow').valueChanges.subscribe(result => {
      if (result) {
        let checkVal = this.chargeForm.get('WarnBelowCheck').value;
        if (!checkVal && !this.chargeCheckList.warnBelow) {
          this.chargeForm.get('WarnBelowCheck').setValue(true);
        }
      }
    });

    this.chargeForm.get('DefaultValue').valueChanges.subscribe(result => {
      if (result) {
        this.chargeCheckList.defaultValue = true;
      }
    });

    this.chargeForm.get('UpperLimit').valueChanges.subscribe((result: any) => {
      this.lowLimitCurrencyOption.max = result;
    });

    this.chargeForm.get('From').setValue(new Date());
    this.chargeForm.get('dateCheck').setValue('onGoing');

    this.lowLimitCurrencyOption = JSON.parse(JSON.stringify(this.globService.currencyOptions));
  }

  async ngOnInit() {
    this.getServiceTypes();
    if (this.ChargeData) {
      this.chargeForm.get('ServiceType').setValue(this.ChargeData?.servicetypeid);
      this.chargeForm.get('UpperLimit').setValue(this.ChargeData?.maximumprice);
      this.chargeForm.get('LowerLimit').setValue(this.ChargeData?.minimumprice);
      this.chargeForm.get('WarnAbove').setValue(this.ChargeData?.warningmaximumprice);
      this.chargeForm.get('WarnBelow').setValue(this.ChargeData?.warningminimumprice);
      this.chargeForm.get('DefaultValue').setValue(this.ChargeData?.price);
      const onGoStr = await this.tranService.convertText('on_going').toPromise();
      if (this.ChargeData?.to === onGoStr) {
        this.chargeForm.get('dateCheck').setValue('onGoing');
      } else {
        this.chargeForm.get('dateCheck').setValue('to');
        this.chargeForm.get('To').setValue(new Date(this.ChargeData?.to));
      }
      this.chargeForm.get('From').setValue(new Date(this.ChargeData?.from));
    } else {
      this.setServiceTypeList();
    }
  }

  setServiceTypeList() {
    if (this.serviceTypeOriginList.length > 0) {
      this.serviceTypeList = this.serviceTypeOriginList.filter(it => this.currentList.filter(item => item.servicetypeid === it.id).length === 0);
    }
  }

  ngOnDestroy(): void {
    for (let list of this.subList) {
      list.unsubscribe();
    }
  }

  async getServiceTypes() {
    await this.loading.present();
    this.chargeService.getServiceTypes().subscribe(async (result: any) => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.serviceTypeList = convResult;
      this.serviceTypeOriginList = convResult;
      if (this.ChargeData) {
        this.serviceTypeList = this.serviceTypeOriginList.filter(it => this.currentList.filter(item => item.servicetypeid === it.id).length === 0 ||
          this.currentList.filter(item => item.servicetypeid === it.id).length > 0 && it.id === this.ChargeData?.servicetypeid);
      } else {
        this.serviceTypeList = this.serviceTypeOriginList.filter(it => this.currentList.filter(item => item.servicetypeid === it.id).length === 0);
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  async submitForm() {
    if (this.chargeForm.valid) {
      let returnData = {};
      returnData = this.chargeForm.value;
      if (this.chargeForm.get('dateCheck').value !== 'to') {
        returnData['To'] = await this.tranService.convertText('on_going').toPromise();
      }
      if (this.ChargeData) {
        returnData['id'] = this.ChargeData.id;
        this.ChargeDefinitionFormComponent.emit({ type: 'updateData', data: returnData });
        this.modalCtrl.dismiss({ type: 'updateData', data: returnData });
      } else {
        returnData['id'] = undefined;
        this.ChargeDefinitionFormComponent.emit({ type: 'addData', data: returnData });
        this.modalCtrl.dismiss({ type: 'addData', data: returnData });
      }
    }
  }

  goBack() {
    this.ChargeDefinitionFormComponent.emit({ type: 'list' });
    this.modalCtrl.dismiss({ type: 'list' });
  }

  submitTrigger() {
    document.getElementById('chargeUsageFormSubmitButton').click();
  }

  get f() {
    return this.chargeForm.controls;
  }

}
