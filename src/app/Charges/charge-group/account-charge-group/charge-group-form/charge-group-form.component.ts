import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ComponentOutValue } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { ChargeGroupFormService } from './services/charge-group-form.service';

@Component({
  selector: 'app-charge-group-form',
  templateUrl: './charge-group-form.component.html',
  styleUrls: ['./charge-group-form.component.scss'],
})
export class ChargeGroupFormComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Input() GroupId: string = '';

  @Output('ChargeGroupFormComponent') ChargeGroupFormComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();


  chargeForm: UntypedFormGroup;

  groupList: any[] = [];
  parentGroupList: any[] = [];
  currentGroup: any;

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService,
    private chargeService: ChargeGroupFormService,
  ) {
    this.chargeForm = this.formBuilder.group({
      GroupId: [null, [Validators.min(0), Validators.max(1000)]],
      ParentGroupId: [null],
      Name: ['', Validators.required],
      DisplayOrder: ['', [Validators.required, Validators.min(0), Validators.max(1000)]],
      ServiceProviderChargeGroupId: [''],
    });
  }

  ngOnInit() {
    this.getChargeList();
    if (this.GroupId !== '') {
      this.getChargerGroupDetail();
    }
  }

  async getChargerGroupDetail() {
    this.parentGroupList = [];
    await this.loading.present();
    this.chargeService.getChargeDetail(this.GroupId).subscribe(async (result: any) => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.currentGroup = convResult;
      this.chargeForm.get('GroupId').setValue(convResult?.groupid);
      this.chargeForm.get('GroupId').disable();
      if (convResult?.parentgroupid) {
        this.chargeForm.get('ParentGroupId').setValue((convResult?.parentgroupid).toString());
      }
      this.chargeForm.get('Name').setValue(convResult?.name);
      this.chargeForm.get('DisplayOrder').setValue(convResult?.displayorder);
      this.chargeForm.get('ServiceProviderChargeGroupId').setValue(convResult?.serviceproviderchargegroupid);
      // const tempList = this.groupList.filter(it => it.parentgroupid !== null && it.parentgroupid !== this.currentGroup?.parentgroupid);
      this.parentGroupList = this.groupList.filter(it => it.groupid !== this.currentGroup?.groupid);
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  submitForm() {
    if (this.chargeForm.valid) {
      if (this.GroupId) {
        this.updateChargeGroup();
      } else {
        this.createChargeGroup();
      }
    }
  }

  async createChargeGroup() {
    await this.loading.present();
    const reqBody = {
      GroupId: this.chargeForm.get('GroupId').value,
      ParentGroupId: parseInt(this.chargeForm.get('ParentGroupId').value),
      Name: this.chargeForm.get('Name').value,
      DisplayOrder: this.chargeForm.get('DisplayOrder').value,
      ServiceProviderChargeGroupId: this.chargeForm.get('ServiceProviderChargeGroupId').value
    }
    this.chargeService.createChargeGroup(reqBody).subscribe(async (result: any) => {
      await this.loading.dismiss();
      this.ChargeGroupFormComponent.emit({ type: 'list' });
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  async updateChargeGroup() {
    const reqBody = {
      ParentGroupId: parseInt(this.chargeForm.get('ParentGroupId').value),
      Name: this.chargeForm.get('Name').value,
      DisplayOrder: this.chargeForm.get('DisplayOrder').value,
      ServiceProviderChargeGroupId: this.chargeForm.get('ServiceProviderChargeGroupId').value
    }
    await this.loading.present();
    this.chargeService.updateChargeGroup(reqBody, this.GroupId).subscribe(async (result: any) => {
      await this.loading.dismiss();
      this.ChargeGroupFormComponent.emit({ type: 'list' });
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  submitTrigger() {
    document.getElementById('accountChargeGroupFormSubmitButton').click();
  }

  goBack() {
    this.ChargeGroupFormComponent.emit({ type: 'list' });
  }

  get f() {
    return this.chargeForm.controls;
  }

  async getChargeList() {
    this.groupList = [];
    this.parentGroupList = [];
    await this.loading.present();
    this.chargeService.getChargeGroupList('').subscribe(async (result: any) => {
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      
      await this.loading.dismiss();
      if (result === null) {
        this.tranService.errorMessage('no_charges_group');
      } else {
        for (const list of convResult) {
          this.groupList.push(list);
        }
        // const tempList = this.groupList.filter(it => it.parentgroupid !== null && it.parentgroupid !== this.currentGroup?.parentgroupid);
        // this.parentGroupList = this.groupList.filter(it => tempList.filter(item => it.groupid === item.parentgroupid).length === 0);
        this.parentGroupList = this.groupList.filter(it => it.groupid !== this.currentGroup?.groupid);
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

}
