import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { ComponentOutValue } from 'src/app/model';
import { LoadingService, ToastService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { ChargeDefinitionFormService } from './services/definition-form.service';

@Component({
  selector: 'app-charge-definition-form',
  templateUrl: './charge-definition-form.component.html',
  styleUrls: ['./charge-definition-form.component.scss'],
})
export class ChargeDefinitionFormComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Input() ChargeData: any;

  @Output('ChargeDefinitionFormComponent') ChargeDefinitionFormComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  chargeForm: UntypedFormGroup;
  groupList = [
  ];
  gLAList = [
  ];
  pOBList = [
    { id: 'true', name: 'Yes' },
    { id: 'false', name: 'No' },
  ];
  frequencyList = [];
  anniversaryList = [
  ];
  billGroupList = [
  ];

  chargeList: any;
  chargeGLState: boolean = true;
  showSpinner: boolean = false;

  availableCallChargeGL: boolean = false;
  UsageData: any;

  constructor(
    private loading: LoadingService,
    private toast: ToastService,
    private tranService: TranService,
    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService,
    private chargeService: ChargeDefinitionFormService,
  ) {
    this.chargeForm = this.formBuilder.group({
      Code: ['', Validators.required],
      ProductCode: ['',],
      Description: ['', Validators.required],
      Unit: ['',],
      DefaultPrice: ['', Validators.required],
      Group: ['', Validators.required],
      GLAccount: ['',],
      PrintOnBill: ['', Validators.required],
      Frequency: ['', Validators.required],
      Prorata: ['',],
      AdvancePeriods: ['', Validators.required],
      Anniversary: ['', Validators.required],
      BillGroup: ['', Validators.required],
      Consolidate: ['',],
    });

    this.chargeForm.get('GLAccount').valueChanges.pipe(debounceTime(1000)).subscribe((result: any) => {
      if (result && this.availableCallChargeGL) {
        this.getGeneralLedgerAccounts();
      }
      this.availableCallChargeGL = true;
    });
  }

  ngOnInit() {
    this.getAnniversaryTypes();
    this.getGroups();
    this.getDisplayGroups();
    this.getGeneralLedgerAccounts();
    this.getFrequencies();
    if (this.ChargeData) {
      this.getChargeDetail();
    }
  }

  submitForm() {
    if (this.chargeForm.valid) {

    }
  }

  async getChargeDetail() {
    await this.loading.present();
    this.chargeService.getChargeDetail(this.ChargeData?.id).subscribe(async (result: any) => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.chargeForm.get('Code').setValue(convResult?.id);
      this.chargeForm.get('Code').disable();
      this.chargeForm.get('ProductCode').setValue(convResult?.serviceprovidercode);
      this.chargeForm.get('Description').setValue(convResult?.billdescription);
      this.chargeForm.get('DefaultPrice').setValue(convResult?.defaultprice);
      this.chargeForm.get('Unit').setValue(convResult?.unit);
      this.chargeForm.get('Group').setValue(convResult?.groupid.toString());
      this.chargeForm.get('GLAccount').setValue(convResult?.revenueaccount);
      this.chargeForm.get('PrintOnBill').setValue(convResult?.printoninvoice.toString());
      this.chargeForm.get('AdvancePeriods').setValue(convResult?.advanceperiods);
      this.chargeForm.get('Consolidate').setValue(convResult?.consolidate);
      this.chargeForm.get('Prorata').setValue(convResult?.prorated);
      this.chargeForm.get('Frequency').setValue(convResult?.frequencyid.toString());
      this.chargeForm.get('Anniversary').setValue(convResult?.anniversarytypeid);
      this.chargeForm.get('BillGroup').setValue(convResult?.invoicegroupid.toString());

      this.UsageData = convResult?.nonplanservicetypepricing;
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  submitTrigger() {
    document.getElementById('accountChargeDefinitionSubmitButton').click();
  }

  goBack() {
    this.ChargeDefinitionFormComponent.emit({ type: 'list' });
  }

  get f() {
    return this.chargeForm.controls;
  }

  processComponent(event: ComponentOutValue) {
    switch (event.type) {
      case 'available':
        break;
      case 'close':
        break;

      default:
        break;
    }
  }

  async getAnniversaryTypes() {
    await this.loading.present();
    this.chargeService.getAnniversaryTypes().subscribe(async (result: any) => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.anniversaryList = convResult;
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  async getFrequencies() {
    await this.loading.present();
    this.chargeService.getFrequencies().subscribe(async (result: any) => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.frequencyList = convResult;
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  async getGroups() {
    await this.loading.present();
    this.chargeService.getGroups().subscribe(async (result: any) => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.groupList = convResult;
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  async getDisplayGroups() {
    await this.loading.present();
    this.chargeService.getDisplayGroups().subscribe(async (result: any) => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.billGroupList = convResult;
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  async getGeneralLedgerAccounts() {
    this.showSpinner = true;
    await this.loading.present();
    const reqBody = {
      BusinessUnitCode: '',
      TypeId: 'Revenue',
      SearchString: this.chargeForm.get('GLAccount').value,
    }
    this.chargeService.getGeneralLedgerAccounts(reqBody).subscribe(async (result: any) => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.gLAList = convResult;
      this.showSpinner = false;
    }, async (error: any) => {
      this.showSpinner = false;
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  selectGLAccount(event) {
    for (let list of this.gLAList) {
      if (list.id === this.chargeForm.get('GLAccount').value) {
        this.chargeForm.get('GLAccount').setValue(list.name);
        this.availableCallChargeGL = false;
        break;
      }
    }
  }

}
