import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { ServiceAttributeService } from './services/service-attribute-service';

@Component({
  selector: 'app-service-attribute-configuration',
  templateUrl: './service-attribute-configuration.component.html',
  styleUrls: ['./service-attribute-configuration.component.scss'],
})
export class ServiceAttributeConfigurationComponent implements OnInit {

  @Input() ContactCode: string = '';


  @Output('ServiceAttributeComponent') public ServiceAttributeComponent: EventEmitter<string> = new EventEmitter<string>();

  groupList: any[] = [];
  groupForm: UntypedFormGroup;

  groupState: string = '';
  currentGroup: any;

  boolList: any[] = [
    { value: true, name: 'yes' },
    { value: false, name: 'no' }
  ];

  displayStrList: any[] = [
    { value: 'Always', name: 'always' },
    { value: 'ActivatedOnly', name: 'active_only' },
    { value: 'No', name: 'no' }
  ];

  serviceTypeStrList: any[] = [
    { value: 'ALL', name: 'all_service_types' },
    { value: 'This', name: 'this_service_type' },
  ];

  serviceTypeId: any;
  serviceTypeList: any[] = [];

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private attrService: ServiceAttributeService,

    public globService: GlobalService,
    private formBuilder: UntypedFormBuilder,
  ) {

    this.groupForm = this.formBuilder.group({
      Display: ['', Validators.required],
      Label: ['', Validators.required],
      DisplayOrder: ['', Validators.required],
      Editable: ['', Validators.required],
      NavigationURL: ['',],
      Tooltip: ['',],
    });
  }

  ngOnInit() {
    this.getServiceTypeList();
  }

  async selectServiceType(index) {
    this.serviceTypeId = this.serviceTypeList[index].id;
    await this.loading.present();
    this.getGroupLists();
  }

  async getServiceTypeList() {
    await this.loading.present();
    this.serviceTypeList = [];
    this.attrService.getServiceTypes().subscribe(async (result: any) => {
      
      await this.loading.dismiss();
      const convertResult = this.globService.ConvertKeysToLowerCase(result);
      if (convertResult === null) {
        this.tranService.errorToastMessage('no_data');
      } else {
        this.serviceTypeList = convertResult;
      }
    }, async (error: any) => {
      
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  getGroupLists() {
    this.groupState = 'view';
    this.ServiceAttributeComponent.emit('view');
    this.groupList = [];
    this.attrService.getAllAttributes(this.serviceTypeId).subscribe(async (result: any) => {
      
      await this.loading.dismiss();
      const convertResult = this.globService.ConvertKeysToLowerCase(result);
      if (convertResult.documents === null) {
        this.tranService.errorToastMessage('no_data');
      } else {
        this.groupList = convertResult;

        for (let list of this.groupList) {
          list.mode = false;
        }
      }
    }, async (error: any) => {
      
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  backMain() {
    this.groupState = 'view';
    this.ServiceAttributeComponent.emit('view');
  }

  async updateGroupElement() {
    if (this.groupForm.valid) {
      let reqparam = {
        Display: this.groupForm.get('Display').value,
        ServiceType: this.currentGroup.servicetypeid,
        Label: this.groupForm.get('Label').value,
        DisplayOrder: parseFloat(this.groupForm.get('DisplayOrder').value),
        Editable: this.groupForm.get('Editable').value,
        NavigationURL: this.groupForm.get('NavigationURL').value,
        Tooltip: this.groupForm.get('Tooltip').value,
      };

      await this.loading.present();
      this.attrService.updateAttribute(this.globService.convertRequestBody(reqparam), this.currentGroup.id, this.currentGroup.servicetypeid).subscribe(async (result: any) => {
        
        this.getGroupLists();
      }, async (error: any) => {
        
        await this.loading.dismiss();
        this.tranService.errorMessage(error);
      });
    }
  }

  submitTrigger() {
    document.getElementById('submitButton').click();
  }

  goToGroupDetail(index) {
    this.groupState = 'edit';
    this.ServiceAttributeComponent.emit('edit');
    this.currentGroup = this.groupList[index];

    this.groupForm.reset();

    this.groupForm.get('Display').setValue(this.currentGroup.display);
    this.groupForm.get('Label').setValue(this.currentGroup.label);
    this.groupForm.get('DisplayOrder').setValue(this.currentGroup.displayorder);
    this.groupForm.get('Editable').setValue(this.currentGroup.editable);
    this.groupForm.get('NavigationURL').setValue(this.currentGroup.navigationurl);
    this.groupForm.get('Tooltip').setValue(this.currentGroup.tooltip);
  }
}
