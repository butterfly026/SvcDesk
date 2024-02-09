import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ComponentOutValue } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { ChargeGroupDisplayFormService } from './services/charge-display-form.service';

@Component({
  selector: 'app-charge-display-form',
  templateUrl: './charge-display-form.component.html',
  styleUrls: ['./charge-display-form.component.scss'],
})
export class ChargeDisplayFormComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Input() GroupId: string = '';

  @Output('ChargeDisplayFormComponent') ChargeDisplayFormComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();


  chargeForm: UntypedFormGroup;

  groupList: any[] = [];
  parentGroupList: any[] = [];
  currentGroup: any;

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService,
    private chargeService: ChargeGroupDisplayFormService,
  ) {
    this.chargeForm = this.formBuilder.group({
      Id: [null,],
      Name: ['', Validators.required],
      DisplayOrder: ['', [Validators.required, Validators.min(0), Validators.max(1000)]],
    });
  }

  ngOnInit() {
    if (this.GroupId !== '') {
      this.getChargeGroupDetail();
    }
  }

  async getChargeGroupDetail() {
    this.parentGroupList = [];
    await this.loading.present();
    this.chargeService.getChargeDetail(this.GroupId).subscribe(async (result: any) => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.currentGroup = convResult;
      this.chargeForm.get('Id').setValue(convResult?.id);
      this.chargeForm.get('Id').disable();
      this.chargeForm.get('Name').setValue(convResult?.name);
      this.chargeForm.get('DisplayOrder').setValue(convResult?.displayorder);
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
      Id: this.chargeForm.get('Id').value,
      Name: this.chargeForm.get('Name').value,
      DisplayOrder: this.chargeForm.get('DisplayOrder').value,
    }
    this.chargeService.createChargeGroup(reqBody).subscribe(async (result: any) => {
      await this.loading.dismiss();
      this.ChargeDisplayFormComponent.emit({ type: 'list' });
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  async updateChargeGroup() {
    const reqBody = {
      Name: this.chargeForm.get('Name').value,
      DisplayOrder: this.chargeForm.get('DisplayOrder').value,
    }
    await this.loading.present();
    this.chargeService.updateChargeGroup(reqBody, this.GroupId).subscribe(async (result: any) => {
      await this.loading.dismiss();
      this.ChargeDisplayFormComponent.emit({ type: 'list' });
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  submitTrigger() {
    document.getElementById('accountChargeDisplayGroupFormSubmitButton').click();
  }

  goBack() {
    this.ChargeDisplayFormComponent.emit({ type: 'list' });
  }

  get f() {
    return this.chargeForm.controls;
  }
}
