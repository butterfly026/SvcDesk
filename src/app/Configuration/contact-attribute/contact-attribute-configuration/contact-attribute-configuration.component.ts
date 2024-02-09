import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, Validators } from '@angular/forms';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { ContactAttributeService } from './services/contact-attribute-service';

@Component({
  selector: 'app-contact-attribute-configuration',
  templateUrl: './contact-attribute-configuration.component.html',
  styleUrls: ['./contact-attribute-configuration.component.scss'],
})
export class ContactAttributeConfigurationComponent implements OnInit {

  @Input() ContactCode: string = '';
  

  @Output('ContactAttributeComponent') public ContactAttributeComponent: EventEmitter<string> = new EventEmitter<string>();

  groupList: any[] = [];
  groupForm: UntypedFormGroup;

  groupState: string = 'view';
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

  contactTypeStrList: any[] = [
    { value: 'Person', name: 'person' },
    { value: 'Corporate', name: 'corporate' },
    { value: 'Both', name: 'both' },
  ];

  accountTypeList: any[] = [
    { value: 'Account', name: 'account' },
    { value: 'Both', name: 'both' },
    { value: 'None Account', name: 'none_account' },
  ];

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private attrService: ContactAttributeService,
    
    public globService: GlobalService,
    private formBuilder: UntypedFormBuilder,
  ) {
    
    this.groupForm = this.formBuilder.group({
      Display: ['', Validators.required],
      ContactType: ['', Validators.required],
      AccountType: ['', Validators.required],
      Label: ['', Validators.required],
      DisplayOrder: ['', [Validators.required, Validators.min(1)]],
      Editable: ['', Validators.required],
      NavigationURL: [''],
      Tooltip: [''],
    });
  }

  get f() {
    return this.groupForm.controls;
  }

  async ngOnInit() {
    // This is tempority value
    if (this.ContactCode != '') {

    } else {
      if (localStorage.getItem('ContactCode')) {
        this.ContactCode = localStorage.getItem('ContactCode');
      } else {
        this.ContactCode = '40000022'
      }
    }
    await this.loading.present();
    this.getGroupLists();
  }

  getGroupLists() {
    this.groupState = 'view';
    this.ContactAttributeComponent.emit('view');
    this.groupList = [];
    this.attrService.getAllAttributes().subscribe(async (result: any) => {
      
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
    this.ContactAttributeComponent.emit('view');
  }

  async updateGroupElement() {
    if (this.groupForm.valid) {
      let reqparam = {
        Display: this.groupForm.get('Display').value,
        ContactType: this.groupForm.get('ContactType').value,
        Label: this.groupForm.get('Label').value,
        DisplayOrder: parseFloat(this.groupForm.get('DisplayOrder').value),
        Editable: this.groupForm.get('Editable').value,
        NavigationURL: this.groupForm.get('NavigationURL').value,
        Tooltip: this.groupForm.get('Tooltip').value,
        AccountType: this.groupForm.get('AccountType').value,
      };

      await this.loading.present();
      this.attrService.updateAttribute(this.globService.convertRequestBody(reqparam), this.currentGroup.id).subscribe(async (result: any) => {
        
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
    this.ContactAttributeComponent.emit('edit');
    this.currentGroup = this.groupList[index];

    this.groupForm.reset();

    this.groupForm.get('Display').setValue(this.currentGroup.display);
    this.groupForm.get('ContactType').setValue(this.currentGroup.contacttype);
    this.groupForm.get('Label').setValue(this.currentGroup.label);
    this.groupForm.get('DisplayOrder').setValue(this.currentGroup.displayorder);
    this.groupForm.get('Editable').setValue(this.currentGroup.editable);
    this.groupForm.get('NavigationURL').setValue(this.currentGroup.navigationurl);
    this.groupForm.get('Tooltip').setValue(this.currentGroup.tooltip);
    this.groupForm.get('AccountType').setValue(this.currentGroup.accounttype);
  }

  checkUpdateState() {
    if (this.currentGroup.display !== this.groupForm.get('Display').value || this.currentGroup.contacttype !== this.groupForm.get('ContactType').value ||
      this.currentGroup.label !== this.groupForm.get('Label').value || this.currentGroup.displayorder !== this.groupForm.get('DisplayOrder').value ||
      this.currentGroup.editable !== this.groupForm.get('Editable').value || this.currentGroup.navigationurl !== this.groupForm.get('NavigationURL').value
      || this.currentGroup.tooltip !== this.groupForm.get('Tooltip').value || this.currentGroup.accounttype !== this.groupForm.get('AccountType').value) {
      return true;
    } else {
      return false;
    }
  }

}
