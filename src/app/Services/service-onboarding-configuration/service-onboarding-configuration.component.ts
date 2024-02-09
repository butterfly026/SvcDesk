import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComponentOutValue } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { AlertService } from 'src/services/alert-service.service';
import { GlobalService } from 'src/services/global-service.service';
import { ServiceOnboardingConfigurationService } from './services/service-onboarding-configuration.service';

@Component({
  selector: 'app-service-onboarding-configuration',
  templateUrl: './service-onboarding-configuration.component.html',
  styleUrls: ['./service-onboarding-configuration.component.scss'],
})
export class ServiceOnboardingConfigurationComponent implements OnInit {
  @Output('ServiceOnboardingConfigurationComponent') ServiceOnboardingConfigurationComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  configForm: FormGroup;
  showForm: boolean = false;

  serviceTypeList: any[] = [{id:'Default', name: 'Default'}];


  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private fomBuilder: FormBuilder,
    public globService: GlobalService,
    private planService: ServiceOnboardingConfigurationService,
    private alertService: AlertService,
  ) {
    this.configForm = this.fomBuilder.group({
      ServiceType: ['',Validators.required],
      ServiceQualification_Order: [],
      ServiceQualification_Enabled: [],
      Porting_Order: [],
      Porting_Enabled: [],
      ServiceIds_Method: [],
      ServiceIds_Preferrences_Enabled: [],
      ServiceIds_Preferrences_MaximumNumber: [],
      ServiceIds_BatchOperations_Enabled: [],
      ServiceIds_BatchOperations_ListMaximum: [],
      ServiceIds_BatchOperations_Mode: [],
      ServiceIds_BatchOperations_SkipExisting: [],
      ServiceIds_BatchOperations_RangeNumberMaximum: [],
      Status: [],
      ConnectionDate_AllowScheduled: [],
      ConnectionDate_AllowPast: [],
      ServiceEnquiryPassword: [],
      Plans_Order: [],
      Plans_Enabled: [],
      Plans_AllowMultiplePlans: [],
      Plans_Hardware_Enabled: [],
      Plans_Charges_Enabled: [],
      Plans_Discounts_Enabled: [],
      Attributes_Order: [],
      Attributes_Enabled: [],
      NetworkIdentifiers_Order: [],
      NetworkIdentifiers_Enabled: [],
      Features_Order: [],
      Features_Enabled: [],
      Contracts_Order: [],
      Contracts_Enabled: [],
      NetworkElements_Order: [],
      NetworkElements_Enabled: [],
      AdditionalHardware_Order: [],
      AdditionalHardware_Enabled: [],
      Addresses_Order: [],
      Addresses_Enabled: [],
      Sites_Order: [],
      Sites_Enabled: [],
      CostCenters_Order: [],
      CostCenters_Enabled: [],
      ServiceGroups_Order: [],
      ServiceGroups_Enabled: [],
      Charges_Order: [],
      Charges_Enabled: [],
      RelatedContacts_Order: [],
      RelatedContacts_Enabled: [],
      Documents_Order: [],
      Documents_Enabled: [],
      Notifications_Order: [],
      Notifications_Enabled: []
    });

    this.configForm.get('ServiceType').valueChanges.subscribe((result: string) => {
      if (result) {
        this.getServiceOnboardingConfigurations();
      }
    });
  }

  ngOnInit() {
    this.getPermission();
  }

  get f() {
    return this.configForm.controls;
  }

  async getServicesTypesSelect() {
    await this.loading.present();
    this.planService.getServicesTypesSelect().subscribe(async (result: any) => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.serviceTypeList = [{id: 'Default', name: 'Default'}, ...convResult];
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  async getPermission() {
    this.showForm = false;
    await this.loading.present();
    this.globService.getAuthorization('/Services/Configurations/Onboarding').subscribe(async (_result) => {
      await this.loading.dismiss();
      this.getServicesTypesSelect();
      this.showForm = true;
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
        this.tranService.errorMessage(err);
      }
    });
  }

  goBack() {
    this.ServiceOnboardingConfigurationComponent.emit({ type: 'close' });
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
      if (keyStr !== "ServiceType") {
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
    }
    return res;
  }

  async getServiceOnboardingConfigurations() {
    await this.loading.present();
    this.planService.getServiceOnboardingConfigurations(this.configForm.get('ServiceType').value).subscribe(async (result: any) => {
      await this.loading.dismiss();
      console.log(result)
      this.setConfigFormValue(result);
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  async putServiceOnboardingConfigurations() {
    let reqBody = this.getConfigFormValues();
    await this.loading.present();
    this.planService.putServiceOnboardingConfigurations(this.configForm.get('ServiceType').value, reqBody).subscribe(async (result: any) => {
      await this.loading.dismiss();
      this.goBack();
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  submitTrigger() {
    document.getElementById('serviceOnboardingConfigurationSubmitButton').click();
  }

}
