import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ComponentOutValue } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { AlertService } from 'src/services/alert-service.service';
import { GlobalService } from 'src/services/global-service.service';
import { TerminationConfigurationService } from './services/termination-configuration.service';
import { TerminationConfiguration } from './termination-configuration.component.types';

@Component({
  selector: 'app-service-termination-configuration',
  templateUrl: './termination-configuration.component.html',
  styleUrls: ['./termination-configuration.component.scss'],
})
export class TerminationConfigurationComponent implements OnInit {
  @Input() ServiceType: string = '';

  @Output('TerminationConfigurationComponent') TerminationConfigurationComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  configForm: FormGroup;
  showForm: boolean = false;
  serviceTypeList: any[] = [];
  defaultConfig: TerminationConfiguration = {
    PayOutOverride: {
      Enabled: true,
      Minimum: 0,
      Maximum: 0
    },
    NetworkOptions: {
      CloseNetworkEvent: {
        Enabled: true,
        Default: true
      },
      CancelOpenEvents: {
        Enabled: true,
        Default: true
      }
    },
    ChargeOptions: {
      CreditBackFutureCharges: {
        Enabled: true,
        Default: true
      },
      BillFutureCharges: {
        Enabled: true,
        Default: true
      },
      UnloadFutureUsage: {
        Enabled: true,
        Default: true
      }
    },
    BulkApplyOptions: {
      ApplyAll: {
        Enabled: true,
        Default: true
      },
      ApplySameServiceType: {
        Enabled: true,
        Default: true
      },
      ApplyChildren: {
        Enabled: true,
        Default: true
      },
      ApplySiblings: {
        Enabled: true,
        Default: true
      }
    }
  }
  termConfig: TerminationConfiguration = {
    PayOutOverride: {
      Enabled: true,
      Minimum: 0,
      Maximum: 0
    },
    NetworkOptions: {
      CloseNetworkEvent: {
        Enabled: true,
        Default: true
      },
      CancelOpenEvents: {
        Enabled: true,
        Default: true
      }
    },
    ChargeOptions: {
      CreditBackFutureCharges: {
        Enabled: true,
        Default: true
      },
      BillFutureCharges: {
        Enabled: true,
        Default: true
      },
      UnloadFutureUsage: {
        Enabled: true,
        Default: true
      }
    },
    BulkApplyOptions: {
      ApplyAll: {
        Enabled: true,
        Default: true
      },
      ApplySameServiceType: {
        Enabled: true,
        Default: true
      },
      ApplyChildren: {
        Enabled: true,
        Default: true
      },
      ApplySiblings: {
        Enabled: true,
        Default: true
      }
    }
  }

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private fomBuilder: FormBuilder,
    public globService: GlobalService,
    private planService: TerminationConfigurationService,
    private alertService: AlertService,
  ) {
    this.configForm = this.fomBuilder.group({
      ServiceType: ['', Validators.required],
      PayOutOverride_Enabled: [],
      PayOutOverride_Minimum: [],
      PayOutOverride_Maximum: [],
      CloseNetworkEvent_Enabled: [],
      CloseNetworkEvent_Default: [],
      CancelOpenEvents_Enabled: [],
      CancelOpenEvents_Default: [],
      CreditBackFutureCharges_Enabled: [],
      CreditBackFutureCharges_Default: [],
      BillFutureCharges_Enabled: [],
      BillFutureCharges_Default: [],
      UnloadFutureUsage_Enabled: [],
      UnloadFutureUsage_Default: [],
      ApplyAll_Enabled: [],
      ApplyAll_Default: [],
      ApplySameServiceType_Enabled: [],
      ApplySameServiceType_Default: [],
      ApplyChildren_Enabled: [],
      ApplyChildren_Default: [],
      ApplySiblings_Enabled: [],
      ApplySiblings_Default: [],
    });

    this.configForm.get('ServiceType').valueChanges.subscribe((result: string) => {
      if (result) {
        this.getTerminationConfigurations();
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

  async getPermission() {
    this.showForm = false;
    await this.loading.present();
    this.globService.getAuthorization('/Services/Configurations/Terminations').subscribe(async (_result) => {
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
        this.showForm = true;
      }
    });
  }

  goBack() {
    this.TerminationConfigurationComponent.emit({ type: 'close' });
  }

  async getTerminationConfigurations() {
    await this.loading.present();
    this.planService.getTerminationsConfigurations(this.configForm.get('ServiceType').value).subscribe(async (result: any) => {
      await this.loading.dismiss();      
      if(!result)
        this.termConfig = this.defaultConfig;
      else{
        this.termConfig = result;
        Object.keys(result).forEach(key => {
          if(result[key] == null)
            this.termConfig[key] = this.defaultConfig[key];
        });
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  async putTerminationConfigurations() {
    await this.loading.present();
    this.planService.putTerminationsConfigurations(this.configForm.get('ServiceType').value, this.termConfig).subscribe(async (result: any) => {
      await this.loading.dismiss();
      this.goBack();
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  submitTrigger() {
    this.putTerminationConfigurations();
  }

}
