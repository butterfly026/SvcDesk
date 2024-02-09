import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { AccountOnboardingConfigurationService } from './services/account-onboarding.service';


@Component({
  selector: 'app-account-onboarding',
  templateUrl: './account-onboarding.component.html',
  styleUrls: ['./account-onboarding.component.scss'],
})
export class AccountOnboardingComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Output('AccountOnboardingComponent') AccountOnboardingComponent: EventEmitter<string> = new EventEmitter<string>();

  configurationForm: UntypedFormGroup;
  configurationData: any;

  idList: any[] = [
    'Mandatory', 'ReadOnly', 'Optional', 'AutoPopulated'
  ];

  constructor(
    private loading: LoadingService,
    
    private tranService: TranService,
    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService,
    private configurationService: AccountOnboardingConfigurationService,
  ) {
    this.configurationForm = this.formBuilder.group({
      IdState: ['', Validators.required],
      FinancialOptionsRequired: ['', Validators.required],
      AddressesRequired: ['', Validators.required],
      IdentificationRequired: ['', Validators.required],
      MinimumIdentificationPoints: ['', Validators.required],
      ContactsRequired: ['', Validators.required],
      PlanRequired: ['', Validators.required],
      ContractsRequired: ['', Validators.required],
      AttributesRequired: ['', Validators.required],
      AuthenticationRequired: ['', Validators.required],
      SitesRequired: ['', Validators.required],
      ChargesRequired: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getConfiguration();
  }

  // async getConfiguration() {
  //   await this.loading.present();
  //   const reqBody = {
  //     OperationId: '/Accounts/OnBoarding/Configuration#get',
  //   }

  //   this.globService.operationAPIService(reqBody).subscribe(async (result: any) => {
  //     await this.loading.dismiss();
  //     const convResult = this.globService.convertRequestBody(JSON.parse(result));
      
  //   }, async (error: any) => {
  //     await this.loading.dismiss();
  //     this.tranService.errorMessage(error);
  //   })
  // }

  async getConfiguration() {
    await this.loading.present();

    this.configurationService.onboardingConfiguration('/accounts/OnBoarding/Configuration/Default').subscribe(async (result: any) => {
      await this.loading.dismiss();
      this.configurationData = this.globService.ConvertKeysToLowerCase(result);
    }, async error => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

}
