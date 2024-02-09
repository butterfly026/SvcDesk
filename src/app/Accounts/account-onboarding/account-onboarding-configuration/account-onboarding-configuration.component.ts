import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComponentOutValue } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { AlertService } from 'src/services/alert-service.service';
import { GlobalService } from 'src/services/global-service.service';
import { AccountOnboardingConfigurationService } from './services/account-onboarding-configuration.service';
import { CreditStatusItemDetail } from './models/account-onboarding-configuration.component.types';

@Component({
  selector: 'app-account-onboarding-configuration',
  templateUrl: './account-onboarding-configuration.component.html',
  styleUrls: ['./account-onboarding-configuration.component.scss'],
})
export class AccountOnboardingConfigurationComponent implements OnInit {
  @Output('AccountOnboardingConfigurationComponent') AccountOnboardingConfigurationComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  configForm: FormGroup;
  showForm: boolean = false;
  typeList: any[] = [
    { id: 'Default', name: 'DEFAULT' },
    { id: 'Corporate', name: 'CORPORATE' },
    { id: 'Person', name: 'PERSON' },
  ];

  methodList: any[] = ['Manual', 'Automatic', 'AutomaticAndManual'];
  creditStatusList: CreditStatusItemDetail[];

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private fomBuilder: FormBuilder,
    public globService: GlobalService,
    private planService: AccountOnboardingConfigurationService,
    private alertService: AlertService,
  ) {
    this.configForm = this.fomBuilder.group({
      Type: ['', Validators.required],
      Details_AccountId_Method: [],
      Details_SubType_Enabled: [],
      Details_Aliases_Enabled: [],
      Details_Key_Enabled: [],
      Details_Status_Enabled: [],
      Details_Status_Order: [],      
      Details_EnquiryPassword_Enabled: [],
      Details_ContactPhones_Order: [],
      Details_ContactPhones_Enabled: [],
      Details_Emails_Order: [],
      Details_Emails_Enabled: [],
      Details_Addresses_Order: [],
      Details_Addresses_Enabled: [],

      Options_Order: [],
      Options_Enabled: [],
      Options_DefaultCreditLimit_Enabled: [],
      Options_DefaultCreditLimit_CreditLimit: [],
      Options_PaperBill_Enabled: [],
      Options_PaperBill_Default: [],
      Options_EmailBill_Enabled: [],
      Options_EmailBill_Default: [],
      Options_CreditStatus_Enabled: [],
      Options_CreditStatus_Default: [],
      Options_BillFormat_Enabled: [],
      Options_ChannelPartner_Enabled: [],
      Options_SalesPerson_Enabled: [],

      PaymentMethods_Order: [],
      PaymentMethods_Enabled: [],
      PaymentMethods_CreditCardEnabled: [],
      PaymentMethods_BankEnabled: [],
      Plans_Order: [],
      Plans_Enabled: [],
      Plans_AllowMultiplePlans: [],
      Plans_Hardware_Enabled: [],
      Plans_Charges_Enabled: [],
      Plans_Discounts_Enabled: [],
      Attributes_Order: [],
      Attributes_Enabled: [],
      Contracts_Order: [],
      Contracts_Enabled: [],
      Sites_Order: [],
      Sites_Enabled: [],
      CostCenters_Order: [],
      CostCenters_Enabled: [],
      ServiceGroups_Order: [],
      ServiceGroups_Enabled: [],
      Charges_Order: [],
      Charges_Enabled: [],
      Identification_Order: [],
      Identification_Enabled: [],
      RelatedContacts_Order: [],
      RelatedContacts_Enabled: [],
      Documents_Order: [],
      Documents_Enabled: [],
      Notifications_Order: [],
      Notifications_Enabled: [],
      Authentication_Order: [],
      Authentication_Enabled: [],
    });

    this.configForm.get('Type').valueChanges.subscribe((result: string) => {
      if (result) {
        this.getAccountOnboardingConfigurations();
      }
    })
  }

  ngOnInit() {
    this.getPermission();
    this.getStatusesList();
  }

  get f() {
    return this.configForm.controls;
  }

  private async getStatusesList(): Promise<void> {
    this.planService.getStatusesList()
      .subscribe({
        next: async (result: CreditStatusItemDetail[]) => {
          await this.loading.dismiss();
          this.creditStatusList = result;
        },
        error: async (error: any) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      });
  }

  async putAccountOnboardingConfigurations() {
    let reqBody = this.getConfigFormValues();    
    await this.loading.present();
    this.planService.putAccountOnboardingConfigurations(this.configForm.get('Type').value, reqBody).subscribe(async (result: any) => {
      await this.loading.dismiss();
      this.goBack();
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }
  async getPermission() {
    this.showForm = false;
    await this.loading.present();
    this.globService.getAuthorization('/Accounts/Configurations/Onboarding').subscribe(async (_result) => {
      await this.loading.dismiss();
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
        this.showForm = true;
      }
    });
  }

  goBack() {
    this.AccountOnboardingConfigurationComponent.emit({ type: 'close' });
  }

  setConfigFormValue(result: any, parentName: string) {
    if(typeof result == 'object'){
      Object.keys(result).forEach(key =>{
        if(result[key]){
          if(typeof result[key] == 'object'){
            this.setConfigFormValue(result[key], (!parentName ? '' : (parentName + '_')) + key);
          }else if(parentName){          
            this.configForm.get(parentName + '_' + key).setValue(result[key]);
          }
        }
      });
    }
    
  }

  

  submitTrigger() {
    document.getElementById('serviceAccountOnboardingConfigurationSubmitButton').click();
  }

  getConfigFormValues() {
    let result = {};
    for (let keyStr in this.configForm.controls) {
      if (keyStr !== 'Type') {
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
      if((keys[0].includes('Enabled') || keys[0].includes('AllowMultiplePlans') || keys[0].includes('Default')) && !res[keys[0]])
        res[keys[0]] = false;
      if(keys[0] == 'Options_DefaultCreditLimit_CreditLimit' && !res[keys[0]])
        res[keys[0]] = 0;
    }
    return res;
  }

  async getAccountOnboardingConfigurations() {
    await this.loading.present();
    console.log(1);
    this.planService.getAccountOnboardingConfigurations(this.configForm.get('Type').value).subscribe(async (result: any) => {
      await this.loading.dismiss();      
      for (let keyStr in this.configForm.controls) {
        if(keyStr != 'Type'){
          this.configForm.get(keyStr).setValue(null);
          this.configForm.get(keyStr).markAsTouched();
        }
      }
      this.setConfigFormValue(result, null);
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

}
