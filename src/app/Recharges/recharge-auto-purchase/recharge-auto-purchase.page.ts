import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RechargeAutoPurchaseService } from './services/recharge-auto-purchase.service';
import { NavController } from '@ionic/angular';
import { ToastService, LoadingService, TranService } from 'src/services';

import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DeviceListItem, RechargeSimpleNewItem, AutoPurchaseConfiguration } from 'src/app/model';

import * as moment from 'moment';
import { ConvertDateFormatService } from 'src/services/convert-dateformat.service';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-recharge-auto-purchase',
  templateUrl: './recharge-auto-purchase.page.html',
  styleUrls: ['./recharge-auto-purchase.page.scss'],
})
export class RechargeAutoPurchasePage implements OnInit {

  
  pageTitle: string = '';

  RechargeForm: UntypedFormGroup;

  typeList: Array<RechargeSimpleNewItem> = [];
  purchaseType: string = 'LowBalance';
  monthList = [];
  rechargeList = [];
  deviceList: Array<DeviceListItem> = [];

  thresholdList: Array<number> = [];

  autoRechargeList: Array<AutoPurchaseConfiguration> = [];
  currentAutoRecharge: AutoPurchaseConfiguration = {
    Id: 0,
    ContactCode: '',
    ContactName: '',
    ServiceReference: '',
    ServiceNumber: '',
    AutoPurchaseType: '',
    RechargeTypeId: 0,
    RechargeType: '',
    AutoPurchaseElementThresholds: [
      {
        Id: 0,
        AutoRechargeConfigurationId: 0,
        RechargeElementId: 0,
        RechargeElement: '',
        MinimumQuantity: 0,
        CreatedBy: '',
        CreatedDateTime: '',
        LastUpdatedBy: '',
        LastUpdatedDateTime: ''
      }
    ],
    MaxRechargeNumber: 0,
    MinimumValue: 0,
    DayOfMonth: 0,
    FromDateTime: '',
    ToDateTime: '',
    Active: false,
    Note: '',
    CreatedBy: '',
    CreatedDateTime: '',
    LastUpdatedBy: '',
    LastUpdatedDateTime: ''
  };

  availeSave: boolean = false;
  onGoingStr: string = '';
  availSubmit: boolean = true;

  constructor(
    private navCtrl: NavController,
    private toast: ToastService,
    private loading: LoadingService,
    private tranService: TranService,
    private rechargeService: RechargeAutoPurchaseService,
    
    private cdr: ChangeDetectorRef,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private convertDate: ConvertDateFormatService,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    
    this.tranService.convertText('recharge_auto_purchase').subscribe(result => {
      this.pageTitle = result;
    });

    this.RechargeForm = this.formBuilder.group({
      Device: ['', Validators.required],
      RechargeType: ['', Validators.required],
      FromDateTime: [''],
      ToDateTime: [''],
      LowBalanceThreshold: ['', Validators.required],
      DateOfMonth: ['', Validators.required],
      MaxNumberOfRecharge: [''],
      Note: ['']
    });

    for (let i = 1; i < 101; i++) {
      this.rechargeList.push(i);
    }
    this.switchPurchaseType();
    this.getDeviceList();

    for (let i = 1; i < 101; i++) {
      this.thresholdList.push(i);
    }

    for (let i = 1; i < 32; i++) {
      this.monthList.push(i);
    }

    this.tranService.convertText('on_going').subscribe(result => {
      this.onGoingStr = result;
    });

  }

  ngOnInit() {
    this.getRechargeList();
  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  async getDeviceList() {
    await this.loading.present();
    this.rechargeService.getDeviceList().subscribe(async (result: DeviceListItem[]) => {
      // await this.loading.dismiss();
      
      if (result === null) {
        await this.loading.dismiss();
        this.tranService.errorMessage('no_devices');
      } else {
        this.deviceList = result;
        this.RechargeForm.controls.Device.setValue(this.deviceList[0].ServiceReference.toString());
        setTimeout(() => {
          this.getAutoPurchaseWithOutLoading();
        }, 1000);
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  selectDevice(index) {
    this.RechargeForm.reset();
    this.purchaseType = 'LowBalance';
    this.switchPurchaseType();
    this.RechargeForm.controls.Device.setValue(this.deviceList[index].ServiceReference.toString());
    this.AutoPurchaseConfiguration();
  }

  getAutoPurchaseWithOutLoading() {
    this.autoRechargeList = [];
    this.rechargeService.AutoPurchaseConfiguration(this.RechargeForm.controls.Device.value).subscribe(async (result: AutoPurchaseConfiguration[]) => {
      
      await this.loading.dismiss();
      if (result === null) {
        this.tranService.errorMessage('no_devices');
      } else {
        this.autoRechargeList = result;
        this.currentAutoRecharge = this.autoRechargeList[0];
        this.RechargeForm.controls.RechargeType.setValue(this.currentAutoRecharge.RechargeTypeId.toString());
        this.purchaseType = this.currentAutoRecharge.AutoPurchaseType;
        this.switchPurchaseType();
        if (this.purchaseType === 'LowBalance') {
          this.RechargeForm.controls.LowBalanceThreshold.setValue(this.currentAutoRecharge.AutoPurchaseElementThresholds[0].MinimumQuantity.toString());
        } else if (this.purchaseType === 'Scheduled') {
          this.RechargeForm.controls.DateOfMonth.setValue(this.currentAutoRecharge.DayOfMonth.toString());
        }
        if (this.currentAutoRecharge.MaxRechargeNumber !== null) {
          this.RechargeForm.controls.MaxNumberOfRecharge.setValue(this.currentAutoRecharge.MaxRechargeNumber.toString());
        }
        this.RechargeForm.controls.Note.setValue(this.currentAutoRecharge.Note);
        this.setToAndFromDate();
        this.RechargeForm.controls.FromDateTime.setValue(moment(this.currentAutoRecharge.FromDateTime).format(this.convertDate.getLocalDateFormat()));
        if (this.checkCancelledDate(new Date(this.currentAutoRecharge.ToDateTime))) {
          this.RechargeForm.controls.ToDateTime.setValue(this.onGoingStr);
        } else {
          this.RechargeForm.controls.ToDateTime.setValue(moment(this.currentAutoRecharge.ToDateTime).format(this.convertDate.getLocalDateFormat()));
        }
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  async AutoPurchaseConfiguration() {
    this.autoRechargeList = [];
    await this.loading.present();
    this.rechargeService.AutoPurchaseConfiguration(this.RechargeForm.controls.Device.value).subscribe(async (result: AutoPurchaseConfiguration[]) => {
      
      await this.loading.dismiss();
      if (result === null) {
        this.tranService.errorMessage('no_devices');
      } else {
        this.autoRechargeList = result;
        this.currentAutoRecharge = this.autoRechargeList[0];
        this.RechargeForm.controls.RechargeType.setValue(this.currentAutoRecharge.RechargeTypeId.toString());
        this.purchaseType = this.currentAutoRecharge.AutoPurchaseType;
        this.switchPurchaseType();
        if (this.purchaseType === 'LowBalance') {
          this.RechargeForm.controls.LowBalanceThreshold.setValue(this.currentAutoRecharge.AutoPurchaseElementThresholds[0].MinimumQuantity.toString());
        } else if (this.purchaseType === 'Scheduled') {
          this.RechargeForm.controls.DateOfMonth.setValue(this.currentAutoRecharge.DayOfMonth.toString());
        }
        if (this.currentAutoRecharge.MaxRechargeNumber !== null) {
          this.RechargeForm.controls.MaxNumberOfRecharge.setValue(this.currentAutoRecharge.MaxRechargeNumber.toString());
        }
        this.RechargeForm.controls.Note.setValue(this.currentAutoRecharge.Note);
        this.setToAndFromDate();
        this.RechargeForm.controls.FromDateTime.setValue(moment(this.currentAutoRecharge.FromDateTime).format(this.convertDate.getLocalDateFormat()));
        if (this.checkCancelledDate(new Date(this.currentAutoRecharge.ToDateTime))) {
          this.RechargeForm.controls.ToDateTime.setValue(this.onGoingStr);
        } else {
          this.RechargeForm.controls.ToDateTime.setValue(moment(this.currentAutoRecharge.ToDateTime).format(this.convertDate.getLocalDateFormat()));
        }
      }
    },async  (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  getRechargeList() {
    this.rechargeService.getRechargeList().subscribe((result: RechargeSimpleNewItem[]) => {
      
      if (result === null) {
        this.tranService.errorMessage('no_recharges');
      } else {
        this.typeList = result;
      }
    }, (error: any) => {
      
      this.tranService.errorMessage(error);
    }, () => {
    });
  }

  rechargeItem(index) {
    this.checkSaveState();
  }

  switchPurchaseType() {
    if (this.purchaseType === 'LowBalance') {
      this.RechargeForm.addControl('LowBalanceThreshold', new UntypedFormControl('', Validators.required));

      this.RechargeForm.removeControl('DateOfMonth');
    } else if (this.purchaseType === 'Scheduled') {
      this.RechargeForm.removeControl('LowBalanceThreshold');

      this.RechargeForm.addControl('DateOfMonth', new UntypedFormControl('', Validators.required));
    } else {

    }
    this.checkSaveState();
  }

  submitTrigger() {
    document.getElementById('submitButton').click();
  }

  checkSaveState() {
    let reqParam = {
      RechargeTypeId: this.RechargeForm.controls.RechargeType.value,
      AutoPurchaseType: this.purchaseType,
      AutoPurchaseElementThresholds: [{
        RechargeElementId: 1,
      }],
      MaxRechargeNumber: (this.RechargeForm.controls.MaxNumberOfRecharge.value),
      Note: this.RechargeForm.controls.Note.value,
    };
    if (this.purchaseType === 'LowBalance') {
      if (this.checkTwoValue(this.currentAutoRecharge.RechargeTypeId, reqParam.RechargeTypeId) ||
        this.checkTwoValue(this.currentAutoRecharge.AutoPurchaseType, reqParam.AutoPurchaseType) ||
        this.checkTwoValue(this.currentAutoRecharge.AutoPurchaseElementThresholds[0].MinimumQuantity, (this.RechargeForm.controls.LowBalanceThreshold.value)) ||
        this.checkTwoValue(this.currentAutoRecharge.MaxRechargeNumber, reqParam.MaxRechargeNumber) ||
        this.checkTwoValue(this.currentAutoRecharge.Note, reqParam.Note)
      ) {
        this.availeSave = true;
      } else {
        this.availeSave = false;
      }
    } else if (this.purchaseType === 'Scheduled') {
      if (this.checkTwoValue(this.currentAutoRecharge.RechargeTypeId, reqParam.RechargeTypeId) ||
        this.checkTwoValue(this.currentAutoRecharge.AutoPurchaseType, reqParam.AutoPurchaseType) ||
        this.checkTwoValue(this.currentAutoRecharge.DayOfMonth, this.RechargeForm.controls.DateOfMonth.value) ||
        this.checkTwoValue(this.currentAutoRecharge.MaxRechargeNumber, reqParam.MaxRechargeNumber) ||
        this.checkTwoValue(this.currentAutoRecharge.Note, reqParam.Note)
      ) {
        this.availeSave = true;
      } else {
        this.availeSave = false;
      }
    }

    if (this.RechargeForm.valid && this.availeSave) {
      this.availeSave = true;
    } else {
      this.availeSave = false;
    }
  }

  checkTwoValue(value1, value2) {
    if (value1 !== null) {
      if (typeof (value2) !== 'undefined' && value2 !== null && value2 !== '' && value1.toString() !== value2.toString()) {
        return true;
      } else {
        return false;
      }
    } else {
      if (typeof (value2) !== 'undefined' && value2 !== null && value2 !== '') {
        return true;
      } else {
        return false;
      }
    }
  }

  setToAndFromDate() {
    if (this.autoRechargeList.length > 0) {
      this.RechargeForm.addControl('FromDateTime', new UntypedFormControl(''));
      this.RechargeForm.addControl('ToDateTime', new UntypedFormControl(''));
      this.RechargeForm.get('FromDateTime').disable();
      this.RechargeForm.get('ToDateTime').disable();
    } else {
      this.RechargeForm.removeControl('FromDateTime');
      this.RechargeForm.removeControl('ToDateTime');
    }
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

  async RechargeSubmit() {
    let reqParam;

    let maxRechargenumber = this.RechargeForm.controls.MaxNumberOfRecharge.value;

    if (this.autoRechargeList.length > 0) {

      if (this.purchaseType === 'LowBalance') {
        if (typeof (maxRechargenumber) !== undefined && maxRechargenumber !== null && maxRechargenumber !== '') {
          reqParam = {
            Id: this.currentAutoRecharge.Id,
            ServiceReference: this.RechargeForm.controls.Device.value,
            RechargeTypeId: this.RechargeForm.controls.RechargeType.value,
            AutoPurchaseType: 'LowBalance',
            AUtoPurchaseElementThresholds: [{
              RechargeElementId: 1,
              MinimumQuantity: parseInt(this.RechargeForm.controls.LowBalanceThreshold.value),
            }],
            MaxRechargeNumber: parseInt(this.RechargeForm.controls.MaxNumberOfRecharge.value),
            Note: '',
          };
        } else {
          reqParam = {
            Id: this.currentAutoRecharge.Id,
            ServiceReference: this.RechargeForm.controls.Device.value,
            RechargeTypeId: this.RechargeForm.controls.RechargeType.value,
            AutoPurchaseType: 'LowBalance',
            AUtoPurchaseElementThresholds: [{
              RechargeElementId: 1,
              MinimumQuantity: parseInt(this.RechargeForm.controls.LowBalanceThreshold.value)
            }],
            Note: '',
          };
        }

      } else if (this.purchaseType === 'Scheduled') {
        if (typeof (maxRechargenumber) !== undefined && maxRechargenumber !== null && maxRechargenumber !== '') {
          reqParam = {
            Id: this.currentAutoRecharge.Id,
            ServiceReference: this.RechargeForm.controls.Device.value,
            RechargeTypeId: this.RechargeForm.controls.RechargeType.value,
            AutoPurchaseType: 'Scheduled',
            AUtoPurchaseElementThresholds: [{
              RechargeElementId: 1,
            }],
            MaxRechargeNumber: parseInt(this.RechargeForm.controls.MaxNumberOfRecharge.value),
            DayofMonth: parseInt(this.RechargeForm.controls.DateOfMonth.value),
            Note: '',
          };
        } else {
          reqParam = {
            Id: this.currentAutoRecharge.Id,
            ServiceReference: this.RechargeForm.controls.Device.value,
            RechargeTypeId: this.RechargeForm.controls.RechargeType.value,
            AutoPurchaseType: 'Scheduled',
            AUtoPurchaseElementThresholds: [{
              RechargeElementId: 1,
            }],
            DayofMonth: parseInt(this.RechargeForm.controls.DateOfMonth.value),
            Note: '',
          };
        }
      }

      if (typeof (this.RechargeForm.controls.Note.value) === 'undefined'
        || this.RechargeForm.controls.Note.value === null ||
        this.RechargeForm.controls.Note.value === ''
      ) {
      } else {
        reqParam.Note = this.RechargeForm.controls.Note.value;
      }

      if (this.availSubmit) {
        this.availSubmit = false;
        await this.loading.present();
        this.rechargeService.AutoPurchaseConfigurationUpdate(reqParam).subscribe(async (result: any) => {
          await this.loading.dismiss();
          
          this.tranService.convertText('auto_purchase_update').subscribe(result => {
            this.toast.present(result);
            setTimeout(() => {
              this.navCtrl.pop();
            }, 3000);
          });
        }, async (error: any) => {
          await this.loading.dismiss();
          
          this.tranService.errorMessage(error);
        });
      }
    } else {

      if (this.purchaseType === 'LowBalance') {
        if (typeof (maxRechargenumber) !== undefined && maxRechargenumber !== null && maxRechargenumber !== '') {
          reqParam = {
            ServiceReference: this.RechargeForm.controls.Device.value,
            RechargeTypeId: this.RechargeForm.controls.RechargeType.value,
            AutoPurchaseType: 'LowBalance',
            AUtoPurchaseElementThresholds: [{
              RechargeElementId: 1,
              MinimumQuantity: parseInt(this.RechargeForm.controls.LowBalanceThreshold.value)
            }],
            // MaxRechargeNumber: parseInt(this.RechargeForm.controls.MaxNumberOfRecharge.value),
            Note: '',
          };
        } else {
          reqParam = {
            ServiceReference: this.RechargeForm.controls.Device.value,
            RechargeTypeId: this.RechargeForm.controls.RechargeType.value,
            AutoPurchaseType: 'LowBalance',
            AUtoPurchaseElementThresholds: [{
              RechargeElementId: 1,
              MinimumQuantity: parseInt(this.RechargeForm.controls.LowBalanceThreshold.value)
            }],
            Note: '',
          };
        }

      } else if (this.purchaseType === 'Scheduled') {
        if (typeof (maxRechargenumber) !== undefined && maxRechargenumber !== null && maxRechargenumber !== '') {
          reqParam = {
            ServiceReference: this.RechargeForm.controls.Device.value,
            RechargeTypeId: this.RechargeForm.controls.RechargeType.value,
            AutoPurchaseType: 'Scheduled',
            AUtoPurchaseElementThresholds: [{
              RechargeElementId: 1,
            }],
            // MaxRechargeNumber: parseInt(this.RechargeForm.controls.MaxNumberOfRecharge.value),
            DayoftheMonth: parseInt(this.RechargeForm.controls.DateOfMonth.value),
            Note: '',
          };
        } else {
          reqParam = {
            ServiceReference: this.RechargeForm.controls.Device.value,
            RechargeTypeId: this.RechargeForm.controls.RechargeType.value,
            AutoPurchaseType: 'Scheduled',
            AUtoPurchaseElementThresholds: [{
              RechargeElementId: 1,
            }],
            DayoftheMonth: parseInt(this.RechargeForm.controls.DateOfMonth.value),
            Note: '',
          };
        }
      }

      if (typeof (this.RechargeForm.controls.Note.value) === 'undefined'
        || this.RechargeForm.controls.Note.value === null ||
        this.RechargeForm.controls.Note.value === ''
      ) {
      } else {
        reqParam.Note = this.RechargeForm.controls.Note.value;
      }

      if (this.availSubmit) {
        this.availSubmit = false;
        await this.loading.present();
        this.rechargeService.AutoPurchaseConfigurationAdd(reqParam).subscribe(async (result: any) => {
          await this.loading.dismiss();
          
          this.tranService.convertText('auto_purchase_save').subscribe(result => {
            this.toast.present(result);
            setTimeout(() => {
              this.navCtrl.pop();
            }, 3000);
          });
        }, async (error: any) => {
          await this.loading.dismiss();
          
          this.tranService.errorMessage(error);
        });
      }
    }
  }

  goBack() {
    this.navCtrl.pop();
  }

  async deleteRecharge() {
    if (this.availSubmit) {
      this.availSubmit = false;
      await this.loading.present();

      this.rechargeService.AutoPurchaseConfigurationDelete(this.currentAutoRecharge.Id).subscribe(async (result: any) => {
        await this.loading.dismiss();
        
        this.tranService.convertText('auto_purchase_delete').subscribe(result => {
          this.toast.present(result);
          setTimeout(() => {
            this.navCtrl.pop();
          }, 3000);
        });
      }, async (error: any) => {
        await this.loading.dismiss();
        
        this.tranService.errorMessage(error);
      });
    }

  }

}
