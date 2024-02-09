import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { AddressConfigurationService } from './services/address-configuration.service';

@Component({
  selector: 'app-address-configuration',
  templateUrl: './address-configuration.component.html',
  styleUrls: ['./address-configuration.component.scss'],
})
export class AddressConfigurationComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Output('AddressConfigurationComponent') AddressConfigurationComponent: EventEmitter<string> = new EventEmitter<string>();

  

  configurationForm: UntypedFormGroup;

  configurationData: any;

  selList: any[] = [
    { id: true, name: 'yes' },
    { id: false, name: 'no' },
  ];

  componentLists = ['MANUAL', 'ADDRESSIFY', 'EXTENDED'];

  constructor(
    private configurationService: AddressConfigurationService,
    private loading: LoadingService,
    private tranService: TranService,
    
    private fromBuilder: UntypedFormBuilder,
    public globService: GlobalService,
  ) {
    
    this.configurationForm = this.fromBuilder.group({
      defaultComponent: ['', Validators.required],
      alternateComponent: ['', Validators.required],
      extendedComponent: ['', Validators.required],

      defaultComponentLabel: ['', Validators.required],
      alternateComponentLabel: ['', Validators.required],
      extendedComponentLabel: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getConfiguration();
  }

  // async getConfiguration() {
  //   await this.loading.present();

  //   const reqBody = {
  //     'OperationId': '/AddressDatabases/Configuration#get'
  //   }

  //   this.globService.operationAPIService(reqBody).subscribe(async (result: any) => {
  //     await this.loading.dismiss();
  //     const convResult = this.globService.ConvertKeysToLowerCase(JSON.parse(result));
      
  //     this.configurationData = convResult;
  //     this.configurationForm.reset();

  //     this.configurationForm.get('defaultComponent').setValue(this.configurationData.defaultcomponent);
  //     this.configurationForm.get('alternateComponent').setValue(this.configurationData.alternatecomponent);
  //     this.configurationForm.get('extendedComponent').setValue(this.configurationData.extendedcomponent);

  //     this.configurationForm.get('defaultComponentLabel').setValue(this.configurationData.defaultcomponentlabel);
  //     this.configurationForm.get('alternateComponentLabel').setValue(this.configurationData.alternatecomponentlabel);
  //     this.configurationForm.get('extendedComponentLabel').setValue(this.configurationData.extendedcomponentlabel);
  //   }, async (error: any) => {
  //     await this.loading.dismiss();
  //     this.tranService.errorMessage(error);
  //   });
  // }

  async getConfiguration() {
    await this.loading.present();

    this.configurationService.addressConfiguration('/AddressDatabases/Configuration').subscribe(async (result: any) => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result); //result is in capital letter
      
      this.configurationData = convResult;
      this.configurationForm.reset();

      this.configurationForm.get('defaultComponent').setValue(this.configurationData.defaultcomponent);
      this.configurationForm.get('alternateComponent').setValue(this.configurationData.alternatecomponent);
      this.configurationForm.get('extendedComponent').setValue(this.configurationData.extendedcomponent);

      this.configurationForm.get('defaultComponentLabel').setValue(this.configurationData.defaultcomponentlabel);
      this.configurationForm.get('alternateComponentLabel').setValue(this.configurationData.alternatecomponentlabel);
      this.configurationForm.get('extendedComponentLabel').setValue(this.configurationData.extendedcomponentlabel);
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  getUpdateAvailable() {
    let disable = true;
    if (this.configurationData) {
      for (var key in this.configurationForm.controls) {
        if (this.configurationForm.get(key).value !== this.configurationData[key.toLowerCase()]) {
          disable = false;
        }
      }
    }

    return disable;
  }

  // async updateConfiguration() {
  //   if (this.configurationForm.valid) {
  //     await this.loading.present();
  //     let reqParam = {
  //       DefaultComponent: this.configurationForm.get('defaultComponent').value,
  //       AlternateComponent: this.configurationForm.get('alternateComponent').value,
  //       ExtendedComponent: this.configurationForm.get('extendedComponent').value,
  //       DefaultComponentLabel: this.configurationForm.get('defaultComponentLabel').value,
  //       AlternateComponentLabel: this.configurationForm.get('alternateComponentLabel').value,
  //       ExtendedComponentLabel: this.configurationForm.get('extendedComponentLabel').value,
  //     };

  //     const reqBody = {
  //       OperationId: '/AddressDatabases/Configuration#put',
  //       Parameters: [],
  //       RequestBody: this.globService.convertRequestBody(reqParam)
  //     }
  //     this.globService.operationAPIService(reqBody).subscribe(async (result: any) => {
  //       await this.loading.dismiss();

  //       if (this.configurationData) {
  //         for (var key in this.configurationForm.controls) {
  //           this.configurationData[key.toLowerCase()] = this.configurationForm.get(key).value;
  //         }
  //       }
  //     }, async (error: any) => {
  //       await this.loading.dismiss();
  //       this.tranService.errorMessage(error);
  //     });
  //   }
  // }

  async updateConfiguration() {
    if (this.configurationForm.valid) {
      await this.loading.present();
      let reqParam = {
        DefaultComponent: this.configurationForm.get('defaultComponent').value,
        AlternateComponent: this.configurationForm.get('alternateComponent').value,
        ExtendedComponent: this.configurationForm.get('extendedComponent').value,
        DefaultComponentLabel: this.configurationForm.get('defaultComponentLabel').value,
        AlternateComponentLabel: this.configurationForm.get('alternateComponentLabel').value,
        ExtendedComponentLabel: this.configurationForm.get('extendedComponentLabel').value,
      };

      this.configurationService.uAddressConfiguration(this.globService.convertRequestBody(reqParam), '/AddressDatabases/Configuration').subscribe(async (result: any) => {
        await this.loading.dismiss();
      
        if (this.configurationData) {
          for (var key in this.configurationForm.controls) {
            this.configurationData[key] = this.configurationForm.get(key).value;
          }
        }
      }, async (error: any) => {
        await this.loading.dismiss();
        this.tranService.errorMessage(error);
      });
    }
  }

  triggerSubmit() {
    document.getElementById('submitButton').click();
  }

  cancelForm() {
    this.AddressConfigurationComponent.emit('close');
  }

  get f() {
    return this.configurationForm.controls;
  }
}
