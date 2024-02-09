import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { LoadingService, TranService } from 'src/services';
import { ContactsConfigurationService } from '../services/contacts-configuration.service';

import { GlobalService } from 'src/services/global-service.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-configration-update',
  templateUrl: './configration-update.component.html',
  styleUrls: ['./configration-update.component.scss'],
})
export class ConfigrationUpdateComponent implements OnInit {

  @Input() InitialConfig: any;
  @Output('ConfigurationUpdateComponent') ConfigurationUpdateComponent: EventEmitter<string> = new EventEmitter<string>();

  contactKey: string = '';

  
  groupForm: UntypedFormGroup;

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private cCService: ContactsConfigurationService,
    
    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    

    this.groupForm = this.formBuilder.group({
      label: ['', Validators.required],
      menuId: ['', Validators.required],
      dataType: ['', Validators.required],
      iconURL: ['', Validators.required],
      tooltip: ['', Validators.required],
      display: ['', Validators.required],
      displayOrder: ['', Validators.required],
      displayBold: ['', Validators.required],
      displayColor: ['', Validators.required],
      displayGroup: ['', Validators.required],
      navigationPath: ['', Validators.required],
      editType: ['', Validators.required],
      apiURL: ['', Validators.required],
      attributeType: ['', Validators.required],
      objectId: ['', Validators.required]
    });
  }

  ngOnInit() {

    this.contactKey = this.InitialConfig.key;

    this.groupForm.get('label').setValue(this.InitialConfig.label);
    this.groupForm.get('menuId').setValue(this.InitialConfig.menu_id);
    this.groupForm.get('dataType').setValue(this.InitialConfig.data_type);
    this.groupForm.get('iconURL').setValue(this.InitialConfig.icon_url);
    this.groupForm.get('tooltip').setValue(this.InitialConfig.tooltip);
    this.groupForm.get('display').setValue(this.InitialConfig.display);
    this.groupForm.get('displayOrder').setValue(this.InitialConfig.display_order);
    this.groupForm.get('displayBold').setValue(this.InitialConfig.display_bold);
    this.groupForm.get('displayColor').setValue(this.InitialConfig.display_color);
    this.groupForm.get('displayGroup').setValue(this.InitialConfig.display_group);
    this.groupForm.get('navigationPath').setValue(this.InitialConfig.navigation_path);
    this.groupForm.get('editType').setValue(this.InitialConfig.edit_type);
    this.groupForm.get('apiURL').setValue(this.InitialConfig.APIURL);
    this.groupForm.get('attributeType').setValue(this.InitialConfig.attribute_type);
    this.groupForm.get('objectId').setValue(this.InitialConfig.object_id);
  }

  async configurationSubmit() {
    if (this.groupForm.valid) {
      await this.loading.present();

      let reqBody = {
        "Label": this.groupForm.get('label').value,
        "MenuId": this.groupForm.get('menuId').value,
        "DataType": this.groupForm.get('dataType').value,
        "IconURL": this.groupForm.get('iconURL').value,
        "Tooltip": this.groupForm.get('tooltip').value,
        "Display": this.groupForm.get('display').value,
        "DisplayOrder": this.groupForm.get('displayOrder').value,
        "DisplayBold": this.groupForm.get('displayBold').value,
        "DisplayColor": this.groupForm.get('displayColor').value,
        "DisplayGroup": this.groupForm.get('displayGroup').value,
        "NavigationPath": this.groupForm.get('navigationPath').value,
        "EditType": this.groupForm.get('editType').value,
        "APIURL": this.groupForm.get('apiURL').value,
        "AttributeType": this.groupForm.get('attributeType').value,
        "ObjectId": this.groupForm.get('objectId').value
      };

      this.cCService.updateConfiguratin(this.contactKey, this.globService.convertRequestBody(reqBody)).subscribe(async (result: any) => {
        
        await this.loading.dismiss();

        if (result === null) {
        } else {
          this.ConfigurationUpdateComponent.emit('close');
        }

      }, async (error: any) => {
        await this.loading.dismiss();
        
        this.tranService.errorMessage(error);
      });
    }
  }

  triggerSubmit() {
    document.getElementById('submitConfigurationButton').click();
  }

  goBack() {
    this.ConfigurationUpdateComponent.emit('close');
  }

}
