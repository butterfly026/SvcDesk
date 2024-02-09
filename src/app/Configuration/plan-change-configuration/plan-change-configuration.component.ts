import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComponentOutValue } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { AlertService } from 'src/services/alert-service.service';
import { GlobalService } from 'src/services/global-service.service';
import { PlanChangeConfigurationService } from './services/plan-change-configuration.service';

@Component({
  selector: 'app-service-plan-change-configuration',
  templateUrl: './plan-change-configuration.component.html',
  styleUrls: ['./plan-change-configuration.component.scss'],
})
export class PlanChangeConfigurationComponent implements OnInit {
  @Output('PlanChangeConfigurationComponent') PlanChangeConfigurationComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  configForm: FormGroup;
  showForm: boolean = false;
  serviceTypeList: any[] = [];

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private fomBuilder: FormBuilder,
    public globService: GlobalService,
    private planService: PlanChangeConfigurationService,
    private alertService: AlertService,
  ) {
    this.configForm = this.fomBuilder.group({
      ServiceType: ['', Validators.required],
      TimeOfDay_Enabled: [],
      TimeOfDay_Default: [],
      BulkApplyOptions_ApplyAccount_Enabled: [],
      BulkApplyOptions_ApplySameServiceType_Enabled: [],
      BulkApplyOptions_ApplyChildren_Enabled: [],
      BulkApplyOptions_ApplySiblings_Enabled: [],
      BulkApplyOptions_ApplyGroup_Enabled: [],
      BulkApplyOptions_ApplyAccount_Default: [],
      BulkApplyOptions_ApplySameServiceType_Default: [],
      BulkApplyOptions_ApplyChildren_Default: [],
      BulkApplyOptions_ApplySiblings_Default: [],
      BulkApplyOptions_ApplyGroup_Default: [],
      NetworkOptions_SetPlanChange_Enabled: [],
      NetworkOptions_ForceChange_Enabled: [],
      NetworkOptions_SetPlanChange_Default: [],
      NetworkOptions_ForceChange_Default: [],
      ChargeOptions_ReprocessUsage_Enabled: [],
      ChargeOptions_ReprocessSAE_Enabled: [],
      ChargeOptions_ApplyOneOffCharges_Enabled: [],
      
    });

    this.configForm.get('ServiceType').valueChanges.subscribe((result: string) => {
      if (result) {
        this.getPlanChangesConfigurations();
      }
    })
  }

  ngOnInit() {
    this.getPermission();
  }

  get f() {
    return this.configForm.controls;
  }

  async getPermission() {
    this.showForm = false;
    await this.loading.present();
    this.globService.getAuthorization('/Services/Configurations/PlanChanges').subscribe(async (_result) => {
      await this.loading.dismiss();
      this.showForm = true;
      this.getServicesTypesSelect();
    }, async (err) => {
      await this.loading.dismiss();
      const errResult = this.globService.ConvertKeysToLowerCase(err);
      if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
        this.tranService.errorMessage('You do not have permission for this feature. Please contact your Administrator');
        this.alertService.closeAllAlerts();
        this.showForm = false;
        setTimeout(() => {
          this.goBack();
        }, 1000);
      } else {
        this.showForm = true;
      }
    });
  }

  async getServicesTypesSelect() {
    await this.loading.present();
    this.planService.getServicesTypesSelect().subscribe(async (result: any) => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.serviceTypeList = convResult;
      let defaultType = {
        id: 'Default',
        name: 'Default',
      }
      this.serviceTypeList.unshift(defaultType);
      this.configForm.get('ServiceType').setValue('Default');
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  goBack() {
    this.PlanChangeConfigurationComponent.emit({ type: 'close' });
  }

  async getPlanChangesConfigurations() {
    await this.loading.present();
    this.planService.getPlanChangesConfigurations(this.configForm.get('ServiceType').value).subscribe(async (result: any) => {
      await this.loading.dismiss();      

      for (let keyStr in this.configForm.controls) {
        if(keyStr != 'ServiceType')
          this.configForm.get(keyStr).setValue(false);
      }
      this.setConfigFormValue(result);
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  async putPlanChangesConfigurations() {
    let reqBody = this.getConfigFormValues();
    await this.loading.present();
    this.planService.putPlanChangesConfigurations(this.configForm.get('ServiceType').value, reqBody).subscribe(async (result: any) => {
      await this.loading.dismiss();
      this.goBack();
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  submitTrigger() {
    document.getElementById('servicePlanChangeConfigurationSubmitButton').click();
  }

  setConfigFormValue(result) {
    for (let key in this.configForm.controls) {
      if (key !== "ServiceType") {
        if (result) {
          let keys = key.split('_');
          let _res = result;
          for (let keyEle of keys) {
            _res = _res[keyEle];
          }
            this.configForm.get(key).setValue(_res);
        } else {
          this.configForm.get(key).setValue('');
        }
      }
    }
  }

  getConfigFormValues() {
    let result = {};
    for (let keyStr in this.configForm.controls) {
      if (keyStr !== 'ServiceType') {
        let keys = keyStr.split('_');
        if (result[keys[0]]) {
          result[keys[0]] = {...result[keys[0]], ...this.getConfigFormValue(result[keys[0]], this.configForm.get(keyStr).value, (keys.length === 1?[]:keys.slice(1, keys.length)))}
        } else {
          result[keys[0]] = this.getConfigFormValue(result[keys[0]], this.configForm.get(keyStr).value, (keys.length === 1 ? [] : keys.slice(1, keys.length)));
        }
      }
    }
    return result;
  }

  getConfigFormValue(result, value, keys) {
    let res = {};
    if (keys.length === 0) {
      return value;
    } else {
      if (result && result[keys[0]]) {
        res[keys[0]] = { ...result[keys[0]], ...this.getConfigFormValue(result[keys[0]], value, (keys.length === 1 ? [] : keys.slice(1, keys.length))) };
      } else {
        res[keys[0]] = this.getConfigFormValue(null, value, (keys.length === 1 ? [] : keys.slice(1, keys.length)));
      }
      if((keys[0].includes('Enabled') || keys[0].includes('Default')) && !res[keys[0]])
        res[keys[0]] = false;
    }
    return res;
  }

}
