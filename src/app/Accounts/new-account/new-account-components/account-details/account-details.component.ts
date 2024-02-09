import { Component, EventEmitter, Input, OnInit, Output, ViewChild,ChangeDetectorRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { GlobalService } from 'src/services/global-service.service';
import { TranService, LoadingService } from 'src/services';
import { AccountNewService } from '../../../new-account/services/new-account.service';
import { AccountNamesComponent } from '../account-names/account-names.component';
import { AccountAddressComponent } from '../account-address/account-address.component';
import { AccountPhoneComponent } from '../account-phone/account-phone.component';
import { AccountEmailsComponent } from '../account-emails/account-emails.component';
import { ValidationResponse } from '../../new-account.types';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss'],
})
export class AccountDetailsComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Input() OnboardingConfiguration: string = '';
  @Input() AccountDetailOptions: any = null;  
  @ViewChild (AccountAddressComponent) private addressComponent: AccountAddressComponent;
  @ViewChild (AccountNamesComponent) private aliasComponent: AccountNamesComponent;
  @ViewChild (AccountPhoneComponent) private phoneComponent: AccountPhoneComponent;
  @ViewChild (AccountEmailsComponent) private emailsComponent: AccountEmailsComponent;

  @Output('AccountDetailsComponent') AccountDetailsComponent: EventEmitter<any> = new EventEmitter<any>();


  detailForm: UntypedFormGroup;

  typeList = [
    { id: 'corporation', name: 'Corporate' },
    { id: 'person', name: 'Person' },
  ];
  bsnsUnitList = [];
  statusList: any[] = [];
  subTypeList: any[] = [];
  
  curSelStatus: any = null;
  curBsnsUnit: any = null;
  
  titleList = [
    { id: 'Mr', value: 'Mr' },
    { id: 'Mrs', value: 'Mrs' },
    { id: 'Miss', value: 'Miss' },
    { id: 'Ms', value: 'Ms' },
    { id: 'Dr', value: 'Dr' },
    { id: 'Mr/s', value: 'Mr/s' },
    { id: 'Count', value: 'Count' },
    { id: 'Fr', value: 'Fr' },
    { id: 'Judge', value: 'Judge' },
    { id: 'Lady', value: 'Lady' },
    { id: 'Lord', value: 'Lord' },
    { id: 'Major', value: 'Major' },
    { id: 'MP', value: 'MP' },
    { id: 'Prof', value: 'Prof' },
    { id: 'Rev', value: 'Rev' },
    { id: 'Sir', value: 'Sir' },
  ];
  isEmailValid: boolean = true;
  isPhoneValid: boolean = true;
  isAddressValid: boolean = true;  
  isNamesValid: boolean = true;
  isAuthorized: boolean = false;
  isIdReadOnly: boolean = true;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private loading: LoadingService,
    private accountSvc: AccountNewService,
    public globService: GlobalService,
    private tranService: TranService,
    private cdr: ChangeDetectorRef,
    private changeDetectorRef: ChangeDetectorRef,
  ) {

    this.detailForm = this.formBuilder.group({
      AccountType: ['', Validators.required],
    });

    this.detailForm.get('AccountType').valueChanges.subscribe(result => {
      if (result) {
        switch (result) {
          case 'corporation':
            this.getOperation('/Accounts/OnBoarding/Configuration/Corporate');
            break;
          case 'person':
            this.getOperation('/Accounts/OnBoarding/Configuration/Person');
            break;
        }

      }
    });

    this.detailForm.valueChanges.subscribe(() => {
      this.globService.globSubject.next('validForm&&Details&&' + (this.detailForm.valid && this.isEmailValid && this.isPhoneValid
        && this.isAddressValid && this.isNamesValid));
    });
    // this.globService.globSubject.subscribe((result: any) => {
    //   if (result && result.type && result.type=='DetailsAttribute') {
        
    //     this.AccountDetailOptions = result.data;
    //   }
    // });
  }
  async getStatusList(): Promise<void>{
    await this.loading.present();
    this.accountSvc.getStatusList().subscribe(async (_result) => {
      await this.loading.dismiss();
      const res = this.globService.ConvertKeysToLowerCase(_result);      
      this.statusList = res;
      // this.showForm = true;            
    }, async (err) => {
      await this.loading.dismiss();
      const errResult = this.globService.ConvertKeysToLowerCase(err);
      this.tranService.errorMessage('resource_forbidden');
      this.statusList = [];
    });
  }

  private async getSubTypeList(accountType: string): Promise<void> {
    await this.loading.present();
    this.accountSvc.getSubTypeList(accountType).subscribe(async (_result) => {
      await this.loading.dismiss();
      this.subTypeList = _result;
      let isDefault = false;
      this.subTypeList.forEach((sub) => {
        if(!isDefault && sub.Default == true){
          this.detailForm.get('SubType').setValue(sub.Id);
          isDefault = true;
        }
      })
    }, async (err) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(err);
      this.subTypeList = [];
    });
  }

  async setNamesType(){

  }

  async getOperation(api){
    await this.loading.present();
    this.accountSvc.getNewAccountAuthorization(api).subscribe(async (_result) => {
      await this.loading.dismiss();
      this.isAuthorized = true;
      this.dsetDetailForms(this.detailForm.get('AccountType').value);
      let AccountTypeSelRes = {
        type: 'AccountTypeSelected',
        data: _result
      }      
      if(_result.Details?.AccountId?.Method === 'Automatic'){
        this.isIdReadOnly = true;
        this.getNextAccountId();
      }else if(_result.Details?.AccountId?.Method == 'AutomaticAndManual'){
        this.isIdReadOnly = false;
        this.getNextAccountId();
      }else if(_result.Details?.AccountId?.Method == 'Manual'){
        this.isIdReadOnly = false;
      }
      this.AccountDetailsComponent.emit(AccountTypeSelRes);
      // this.namesComponent.NameAccountType = this.detailForm.get('AccountType').value;
      // this.showForm = true;            
    }, async (err) => {
      await this.loading.dismiss();
      const errResult = this.globService.ConvertKeysToLowerCase(err);
      this.tranService.errorMessage('resource_forbidden');
      console.log('errResult', errResult);
      this.detailForm.get('AccountType').setValue('');
      this.AccountDetailsComponent.emit('close');
      this.AccountDetailsComponent.emit('AccountTypeNull');
    });
  }

  ngOnInit() {
    this.globService.getBusinessUnits().subscribe(async (result: any) => {
      const toResult = this.globService.ConvertKeysToLowerCase(result);
      this.bsnsUnitList = toResult;
    }, async (error: any) => {
      this.tranService.errorMessage(error);
    });
    this.getStatusList();
  }

  get f() {
    return this.detailForm.controls;
  }

  async getNextAccountId(){
    await this.loading.present();
    this.accountSvc.getNextAccountId().subscribe(async (_result) => {
      const res = this.globService.ConvertKeysToLowerCase(_result);
      await this.loading.dismiss();
      this.detailForm.get('AccountId').setValue(res.userid);
    }, async (err) => {
      await this.loading.dismiss();
      const errResult = this.globService.ConvertKeysToLowerCase(err);
      this.tranService.errorMessage('resource_forbidden');      
      this.detailForm.get('AccountId').setValue('');      
    });
  }
  dsetDetailForms(accountType) {
    const controlNames: string[] = ['BusinessUnit', 'AccountId', 'FamilyName', 'Key', 'SubType', 
      'Name', 'CorporationNumber', 'Title', 'FirstName'];
    controlNames.forEach(ctrlName => {
      this.removeFormControl(ctrlName);
    });
    this.addFormControl('BusinessUnit', false);
    this.addFormControl('AccountId', false);
    this.addFormControl('FamilyName', true);
    this.addFormControl('Key', true);
    this.addFormControl('SubType', true);
    switch (accountType) {
      case 'corporation':
        this.addFormControl('Name', false);
        this.addFormControl('CorporationNumber', true);

        break;
      case 'person':
        this.addFormControl('Title', false);
        this.addFormControl('FirstName', false);
        break;
      default:
        break;
    }
    this.getSubTypeList(accountType);
    if(this.bsnsUnitList && this.bsnsUnitList.length > 0){
      let val = '';
      this.bsnsUnitList.forEach(function(bsns){
        if(bsns.default == true){
          val = bsns.id;
        }
      })
      if(!val)
        val = this.bsnsUnitList[0].id;   
      this.detailForm.get('BusinessUnit').valueChanges.subscribe(bsnsCode=>{
        this.getCurrenciesList(bsnsCode);
        this.getAvailableBillCylce(bsnsCode);
      });
      this.detailForm.get('BusinessUnit').setValue(val);
    }    
    if(this.isAvailable('EnquiryPassword')){
      this.addFormControl('EnquiryPassword', true);
    }
    if(this.isAvailable('Status')){
      this.addFormControl('Status', false);
      if(this.statusList && this.statusList.length > 0){
        let val = '';
        this.statusList.forEach(function(status){
          if(status.default == true){
            val = status.id;
          }
        })
        this.detailForm.get('Status').setValue(val);
      }
    }
    this.cdr.detectChanges();
    
  }

  async getCurrenciesList(bsnsCode){
    this.accountSvc.getCurrenyList(bsnsCode).subscribe(async (_result) => {
      await this.loading.dismiss();
      const res = this.globService.ConvertKeysToLowerCase(_result);      
      let CurrenciesList = {
        type: 'CurrencySelected',
        data: res
      };
      if(!res || res.length == 0){
        this.tranService.errorToastMessage('no_currencies');
      }
      
      this.AccountDetailsComponent.emit(CurrenciesList);
      // this.showForm = true;            
    }, async (err) => {
      await this.loading.dismiss();
      const errResult = this.globService.ConvertKeysToLowerCase(err);
      this.tranService.errorMessage('resource_forbidden');
      this.statusList = [];
    });
  }

  async getAvailableBillCylce(bsnsCode){
    await this.loading.present();
    this.accountSvc.getAvailableBillCylce(bsnsCode).subscribe(async (_result) => {
      await this.loading.dismiss();   
      const res = this.globService.ConvertKeysToLowerCase(_result);      
      let CurrenciesList = {
        type: 'BillCycleSelected',
        data: res
      };
      if(!res || res.length == 0){
        this.tranService.errorToastMessage('no_bill_cycle');
      }
      
      this.AccountDetailsComponent.emit(CurrenciesList);
      // this.showForm = true;            
    }, async (err) => {
      await this.loading.dismiss();
      const errResult = this.globService.ConvertKeysToLowerCase(err);
      this.tranService.errorMessage('resource_forbidden');      
    });
  }
  addFormControl(ctrlName, optional) {
    if (!this.detailForm.contains(ctrlName)) {
      if (optional) {
        this.detailForm.addControl(ctrlName, new UntypedFormControl(''));
      } else {
        this.detailForm.addControl(ctrlName, new UntypedFormControl('', Validators.required));
      }
    }
  }

  removeFormControl(ctrlName) {
    if (this.detailForm.contains(ctrlName)) {
      this.detailForm.removeControl(ctrlName);
    }
  }

  public submitDetailForm() {
    let addresses = this.addressComponent.getSubmitData();
    let aliases = this.aliasComponent.getSubmitData();
    let emails = this.emailsComponent.getSubmitData();
    let phones = this.phoneComponent.getSubmitData();

    let submitData = {
      Addresses: addresses.Addresses,
      Aliases: aliases.Aliases,
      Emails: emails,
      ContactPhones: phones
    }
    
    if (this.detailForm.valid) {
      this.AccountDetailsComponent.emit(this.detailForm.value);
    }
  }

  nextForm() {
    document.getElementById('accountDetailsSubmit').click();
  }

  processComponents(event, componentName) {
    if (componentName == 'Emails') {
      if (event.type == 'valueChange') {
        this.isEmailValid = event.data;
      }
    } else if (componentName == 'Phone') {
      if (event.type == 'valueChange') {
        this.isPhoneValid = event.data;
      }
    } else if (componentName == 'Addresses') {
      if (event.type == 'valueChange') {
        this.isAddressValid = event.data;
      }
    } else if (componentName == 'Names') {
      if (event.type == 'valueChange') {
        this.isNamesValid = event.data;
      }
    }
  }
  isAvailable(elementName){
    if(this.AccountDetailOptions && this.AccountDetailOptions.length > 0){
      var bAvail = false;
      this.AccountDetailOptions.forEach(element => {
        if(element.elementName == elementName &&
           element.data.Enabled == true){
              bAvail = true;
           }
      });
      return bAvail;
    }
    return false;
  }

}
