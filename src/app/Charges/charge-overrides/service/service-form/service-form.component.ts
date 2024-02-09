import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { SpinnerService } from 'src/app/Shared/services';
import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { MatAlertService } from 'src/app/Shared/services/mat-alert.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChargeDefinition, ChargeOverride, DialogDataItem, OptionDefinition, PlanDefinition } from '../../charge-overrides.types';
import { ServiceChargeOverrideService } from '../services/service.service';
import { AlertService } from 'src/services/alert-service.service';
import { DatePipe } from '@angular/common';
import { debounceTime } from 'rxjs/operators';
import { Paging } from 'src/app/model';

@Component({
  selector: 'app-service-charge-override-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.scss'],
  providers: [DatePipe]
})
export class ServiceFormComponent implements OnInit {

  @Input() ServiceReference: string = '';
  @Input() ChargeOverrideToUpdate: ChargeOverride;
  @Input() EditMode: string = 'New';
  @Output('ServiceFormComponent') ServiceFormComponent: EventEmitter<string> = new EventEmitter<string>();


  optionList: OptionDefinition[] = [
  ];


  groupForm: UntypedFormGroup;

  showClearPlan: boolean = false;
  showPlanSpinner: boolean = false;
  availPlan: boolean = false;
  currentPlan: PlanDefinition = null;

  showClearCharge: boolean = false;
  showChargeSpinner: boolean = false;
  availCharge: boolean = false;
  currentCharge: ChargeDefinition = null;
  bInitOnLoad: boolean = false;
  

  filteredPlans: PlanDefinition[] = [];
  filteredCharges: ChargeDefinition[] = [];
  isModalDlg: boolean = false;

  dateStart: any;

  constructor(
    private spinnerService: SpinnerService,
    private accountService: ServiceChargeOverrideService,
    private tranService: TranService,
    private alertService: AlertService,

    public globService: GlobalService,
    private formBuilder: UntypedFormBuilder,
    private matAlert: MatAlertService,
    public datePipe: DatePipe,
    private dialogRef: MatDialogRef<ServiceFormComponent>,
    @Inject(MAT_DIALOG_DATA) private dlgData: DialogDataItem
  ) {
    this.groupForm = this.formBuilder.group({
      plan: [''],
      charge: ['', Validators.required],
      price: ['', Validators.required],
      overrideDescription: [''],
      markupRadio: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
    });
  }

  ngOnInit() {
    if (this.dlgData?.ServiceReference) {
      this.ServiceReference = this.dlgData.ServiceReference;
    }
    if(this.dlgData?.IsModal){
      this.isModalDlg = this.dlgData.IsModal;
    }
    if (this.dlgData?.EditMode) {
      this.EditMode = this.dlgData.EditMode;
    }
    if(this.dlgData?.Data){
      this.ChargeOverrideToUpdate = this.dlgData.Data;
    }
    if(this.EditMode == 'New'){
      let d = new Date();
      this.dateStart = this.datePipe.transform(d, 'yyyy-MM-dd');
    }
    

    this.groupForm.get('plan').valueChanges.pipe(debounceTime(1000)).subscribe(result => {
      if (result?.length > 2) {
        this.getPlanDefinitions(result);
        this.availPlan = true;
      }
    })

    this.groupForm.get('charge').valueChanges.pipe(debounceTime(1000)).subscribe(result => {
      if (result?.length > 2) {
        this.getChargeDefinitions(result);
        this.availCharge = true;
      }
    })
    if (this.EditMode == 'New') {
      this.getPermission('/Services/Charges/Overrides/New');
    } else if (this.EditMode == 'Update') {
      this.getPermission('/Services/Charges/Overrides/Update');
    } else if (this.EditMode == 'View') {
      this.getPermission('/Services/Charges/Overrides/Details');
    }
  }

  private async getPermission(resource: string): Promise<void> {
    await this.spinnerService.loading();
    this.globService.getAuthorization(resource, true)
      .subscribe({
        next: async (_result) => {
          await this.spinnerService.end();
          if (!_result) {
            this.tranService.errorMessage('resource_forbidden');
            this.alertService.closeAllAlerts();
            setTimeout(() => {
              this.goBack();
            }, 1000);
          } else {
            if (this.EditMode == 'Update' || this.EditMode == 'View') {
              if (this.ChargeOverrideToUpdate) {
                await this.getChargeOverrideDetails();
              }
            }
          }
        },
        error: async (err) => {
          await this.spinnerService.end();
          const errResult = this.globService.ConvertKeysToLowerCase(err);
          this.tranService.errorMessage('resource_forbidden');

          if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
            this.alertService.closeAllAlerts();
            setTimeout(() => {
              this.goBack();
            }, 1000);
          }
        }
      });
  }

  get f() {
    return this.groupForm.controls;
  }

  focusOutField(fieldName: string){
    let arr = [];
    let checkVal: string = this.groupForm.get(fieldName).value;
    if(fieldName == 'plan'){
      arr = this.filteredPlans;
    }else if(fieldName == 'charge'){
      arr = this.filteredCharges;
    }
    let bExist: boolean = false;
    for (let list of arr) {
      if ((fieldName == 'plan' && list.Plan === checkVal) || 
        (fieldName == 'charge' && list.Name == checkVal)) {
        bExist = true;
        break;
      }
    }
    if(!bExist){
      this.groupForm.get(fieldName).setValue('');
      this.groupForm.removeControl('option');
    }else{
      if(!this.groupForm.contains('option'))
        this.groupForm.addControl('option', new UntypedFormControl(''));
    }
  }

  planSelected(plan) {
    for (let list of this.filteredPlans) {
      if (list.PlanId === this.groupForm.get('plan').value) {
        this.currentPlan = list;
        this.groupForm.get('plan').setValue(list.Plan);
        this.optionList = list.Options ? list.Options : [];
        if(!this.groupForm.contains('option'))
          this.groupForm.addControl('option', new UntypedFormControl(''));
        break;
      }
    }
    // this.groupForm.get('plan').setValue(plan.Name);
  }
  clearPlanSearch() {
    this.groupForm.get('plan').setValue('');
    this.filteredPlans = [];
  }

  async getChargeOverrideDetails(){
    this.showPlanSpinner = true;
    this.accountService.getChargeOverride(this.ChargeOverrideToUpdate.Id.toString()).subscribe(async (result: any) => {
      this.showPlanSpinner = false;
      if(result){
        this.ChargeOverrideToUpdate = result;
        this.groupForm.get('plan').setValue(this.ChargeOverrideToUpdate.Plan);        
        this.groupForm.get('overrideDescription').setValue(this.ChargeOverrideToUpdate.ChargeOverrideDescription);
        this.groupForm.get('charge').setValue(this.ChargeOverrideToUpdate.Charge);
        this.groupForm.get('price').setValue(this.ChargeOverrideToUpdate.Price);
        this.groupForm.get('markupRadio').setValue(this.ChargeOverrideToUpdate.MarkUp);
        this.groupForm.get('startDate').setValue(new Date(this.ChargeOverrideToUpdate.From));        
        if (!this.ChargeOverrideToUpdate.To.toString().startsWith('9999')) {
          this.groupForm.get('endDate').setValue(new Date(this.ChargeOverrideToUpdate.To));
        }
      }
      
    }, async (error: any) => {
      this.showPlanSpinner = false;
      this.tranService.matErrorMessage(error, (title, button, content) => {
        this.matAlert.alert(content, title, button);
      });
    });
  }

  async getPlanDefinitions(searchString: string) {
    let reqData = new Paging();
    if (searchString) {
      reqData.SearchString = searchString;
    }
    this.showPlanSpinner = true;
    this.accountService.getPlanDefinitions(this.ServiceReference, this.globService.convertRequestBody(reqData)).subscribe(async (result: any) => {
      this.showPlanSpinner = false;
      this.filteredPlans = result?.Plans ? result.Plans : [];
      if(!this.bInitOnLoad && this.ChargeOverrideToUpdate){
        let bExist: boolean = false;
        for (let list of this.filteredPlans) {
          if (list.Plan === this.ChargeOverrideToUpdate.Plan) {
            bExist = true;
            break;
          }
        }
        if(!bExist){
          this.groupForm.get('plan').setValue('');
          this.groupForm.removeControl('option');
        }else{
          if(!this.groupForm.contains('option'))
            this.groupForm.addControl('option', new UntypedFormControl(''));
          this.groupForm.get('option').setValue(this.ChargeOverrideToUpdate.PlanOptionId);
        }
        this.bInitOnLoad = true;
      }
    }, async (error: any) => {
      this.showPlanSpinner = false;
      this.tranService.matErrorMessage(error, (title, button, content) => {
        this.matAlert.alert(content, title, button);
      });
    });
  }

  chargeSelected(plan) {
    for (let list of this.filteredCharges) {
      if (list.Id === this.groupForm.get('charge').value) {
        this.currentCharge = list;
        this.groupForm.get('charge').setValue(list.Name);
        break;
      }
    }
    // this.groupForm.get('plan').setValue(plan.Name);
  }
  clearChargeSearch() {
    this.groupForm.get('charge').setValue('');
    this.filteredCharges = [];
  }
  getChargeDefinitions(searchString: string) {
    let reqData = new Paging();
    if (searchString) {
      reqData.SearchString = searchString;
    }
    this.showChargeSpinner = true;
    this.accountService.getChargeDefinitions(this.ServiceReference, this.globService.convertRequestBody(reqData)).subscribe(async (result: any) => {
      this.showChargeSpinner = false;
      this.filteredCharges = result?.Items ? result.Items : [];
    }, async (error: any) => {
      this.showChargeSpinner = false;
      this.tranService.matErrorMessage(error, (title, button, content) => {
        this.matAlert.alert(content, title, button);
      });
    });
  }

  filter(value: string, list): any[] {
    const filterValue = value.toLowerCase();
    return list.filter(option => option.value.toLowerCase().includes(filterValue));
  }


  submitTrigger() {
    document.getElementById('submitButton').click();
  }

  async createCharge(reqData: ChargeOverride) {
    await this.spinnerService.loading();
    this.accountService.createChargeOverride(this.ServiceReference, this.globService.convertRequestBody(reqData)).subscribe(async (result: any) => {
      await this.spinnerService.end();
      if(this.isModalDlg){
        this.dialogRef.close('ok');
      }else{
        this.ServiceFormComponent.emit('go-back');
      }
    }, async (error: any) => {
      await this.spinnerService.end();
      this.tranService.matErrorMessage(error, (title, button, content) => {
        this.matAlert.alert(content, title, button);
      });
    });

  }

  async updateCharge(reqData: ChargeOverride) {
    await this.spinnerService.loading();
    this.accountService.updateChargeOverride(this.ChargeOverrideToUpdate.Id.toString(), this.globService.convertRequestBody(reqData)).subscribe(async (result: any) => {
      await this.spinnerService.end();
      if(this.isModalDlg){
        this.dialogRef.close('ok');
      }else{
        this.ServiceFormComponent.emit('go-back');
      }
    }, async (error: any) => {
      await this.spinnerService.end();
      this.tranService.matErrorMessage(error, (title, button, content) => {
        this.matAlert.alert(content, title, button);
      });
    });
  }

  async saveCharge() {
    let chargeId = null;
    this.filteredCharges.forEach(charge => {
      if(charge.Name == this.groupForm.get('charge').value){
        chargeId = charge.Id;
      }
    })
    let planId = null;
    this.filteredPlans.forEach(plan => {
      if(plan.Plan == this.groupForm.get('plan').value){
        chargeId = plan.PlanId;
      }
    })
    const reqData: ChargeOverride = {
      Type: 'AccountOnly',
      ChargeDefinitionId: chargeId,
      Price: this.groupForm.get('price').value ? parseInt(this.groupForm.get('price').value) : 0,
      MarkUp: this.groupForm.get('markupRadio').value ? parseInt(this.groupForm.get('markupRadio').value) : 0,      
      From: this.groupForm.get('startDate').value ? this.groupForm.get('startDate').value : '', 
      To: this.groupForm.get('endDate').value !== '' ? this.groupForm.get('endDate').value : new Date('9999-01-01'),      
      TerminateOnPlanChange: this.groupForm.get('endDate').value !== ''
    }
    if(this.groupForm.get('overrideDescription').value){
      reqData.ChargeOverrideDescription = this.groupForm.get('overrideDescription').value;
    }
    if(planId){
      reqData.PlanId = planId;
    }
    if(this.groupForm.contains('option') && !isNaN(parseInt(this.groupForm.get('option').value))){
      reqData.PlanOptionId = this.groupForm.get('option').value;
    }
    if (this.EditMode == 'New') {
      await this.createCharge(reqData);
    } else if (this.EditMode == 'Update') {
      await this.updateCharge(reqData);
    }
  }

  goBack() {
    if(this.isModalDlg){
      this.dialogRef.close();
    }else{
      this.ServiceFormComponent.emit('go-back');
    }
  }

}
