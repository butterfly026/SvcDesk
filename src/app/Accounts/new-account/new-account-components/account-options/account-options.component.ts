import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { GlobalService } from 'src/services/global-service.service';
import { LoadingService, TranService } from 'src/services';
import { AccountNewService } from '../../../new-account/services/new-account.service';
import { debounceTime } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';


@Component({
  selector: 'app-account-options',
  templateUrl: './account-options.component.html',
  styleUrls: ['./account-options.component.scss'],
})
export class AccountOptionsComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Input() OnboardingConfiguration: string = '';
  @Output('AccountOptionsComponent') AccountOptionsComponent: EventEmitter<any> = new EventEmitter<any>();


  optionsForm: UntypedFormGroup;

  billCycleList: any[] = [];

  taxrateList: any[] = [];

  timezoneList: any[] = [];

  credittermsList: any[] = [];
  _CurrenciesList: any[] = [];
  defaultTaxrates: any[] = [];
  creditStatusList: any[] = [];
  billFormatList: any[] = [];
  channelPartnerList: any[] = [];
  salesPersonList: any[] = [];
  curTaxRate: number = 0;

  availableCallTimezone: boolean = false;
  availableChannelPartner: boolean = false;
  availableSalesPerson: boolean = false;
  showTimeZoneSpinner: boolean = false;
  showChannelSpinner: boolean = false;
  showSalesSpinner: boolean = false;
  curChannelPartnerId: string = '';


  constructor(
    private formBuilder: UntypedFormBuilder,
    private accountSvc: AccountNewService,
    private loading: LoadingService,
    private tranService: TranService,
    public globService: GlobalService,
  ) {

    this.optionsForm = this.formBuilder.group({
      BillingCycle: ['', Validators.required],
      Currency: ['', Validators.required],
      Taxrate: ['', Validators.required],
      Timezone: ['', Validators.required],
      CreditLimit: ['', Validators.required],
      CreditTerms: ['', Validators.required],
      BillFormat: [''],
      CreditStatus: [''],
      ChannelPartner: [''],
      SalesPerson: [''],
      PaperBill: [false],
      EmailBill: [false]
    });

    this.optionsForm.valueChanges.subscribe(() => {
      this.globService.globSubject.next('validForm&&Options&&' + this.optionsForm.valid);
    });
    this.optionsForm.get('Timezone').valueChanges.pipe(debounceTime(1000)).subscribe((result: any) => {
      if (result && this.availableCallTimezone) {
        this.getTimezoneList();
      }
      this.availableCallTimezone = true;
    });

    this.optionsForm.get('Currency').valueChanges.subscribe((result: any) => {
      if (result) {
        let defaultVal = 0;
        this.defaultTaxrates.forEach(element => {
          if (element.id == result) {
            defaultVal = element.defaulttaxid;
          }
        });
        if (this.taxrateList && this.taxrateList.length > 0) {
          let bExist = false;
          this.taxrateList.forEach(tax => {
            if (tax.id == defaultVal)
              bExist = true;
          });
          if (bExist && defaultVal){
            this.optionsForm.get('Taxrate').setValue('' + defaultVal);            
          }
        }
      }
    });
    this.optionsForm.get('ChannelPartner').valueChanges.pipe(debounceTime(1000)).subscribe((result: any) => {
      if (result && this.availableChannelPartner) {
        this.getChannelPartnerList();
      }
      this.availableChannelPartner = true;
    });
    this.optionsForm.get('ChannelPartner').valueChanges.subscribe((result: any) =>{
      if(result){
        this.channelPartnerList.forEach(channel => {
          if(channel.name == result){
            this.curChannelPartnerId = channel.id;
          }
        });
      }else{
        this.curChannelPartnerId = '';
      }
    });
    this.optionsForm.get('SalesPerson').valueChanges.pipe(debounceTime(1000)).subscribe((result: any) => {
      if (result && this.availableSalesPerson) {
        if(this.curChannelPartnerId)
          this.getSalesPersonList(this.curChannelPartnerId);
        else
          this.getContactSalesPersonList();
      }
      this.availableSalesPerson = true;
    });
  }

  ngOnInit() {
    this.getDefaultTimeZone();
    this.getCreditTerms();
    this.getTaxList();
    this.setDefaultTaxrate();
    this.getCreditStatusList();
    this.getBillFormatList();
    
  }
  async getDefaultTimeZone() {
    await this.loading.present();
    this.accountSvc.getDefaultTimeZone().subscribe(async (_result) => {
      await this.loading.dismiss();
      if (_result) {
        const result = this.globService.ConvertKeysToLowerCase(_result);
        // this.timezoneList = result;
        this.optionsForm.get('Timezone').setValue(result[0].name);
      }
      // this.showForm = true;            
    }, async (err) => {
      await this.loading.dismiss();
      const errResult = this.globService.ConvertKeysToLowerCase(err);
      this.tranService.errorMessage('resource_forbidden');
    });
  }

  async getTimezoneList() {
    const reqBody = {
      TypeId: 'Timezone',
      SearchString: this.optionsForm.get('Timezone').value,
    }
    this.showTimeZoneSpinner = true;
    this.accountSvc.getTimeZoneList(reqBody).subscribe(async (_result) => {
      const result = this.globService.ConvertKeysToLowerCase(_result);
      this.timezoneList = result;      
      this.showTimeZoneSpinner = false;
      // this.showForm = true;            
    }, async (err) => {
      this.showTimeZoneSpinner = false;
      const errResult = this.globService.ConvertKeysToLowerCase(err);
      this.tranService.errorMessage('resource_forbidden');
    });
  }

  async getTaxList() {
    await this.loading.present();
    this.accountSvc.getTaxesList().subscribe(async (_result) => {
      await this.loading.dismiss();
      const result = this.globService.ConvertKeysToLowerCase(_result);
      this.taxrateList = result;
      // this.showForm = true;            
    }, async (err) => {
      await this.loading.dismiss();
      const errResult = this.globService.ConvertKeysToLowerCase(err);
      this.tranService.errorMessage('resource_forbidden');
    });
  }

  async getCreditTerms() {
    await this.loading.present();
    this.accountSvc.getCreditTerms().subscribe(async (_result) => {
      await this.loading.dismiss();
      const result = this.globService.ConvertKeysToLowerCase(_result);
      this.credittermsList = result;
      let defaultVal = '';
      result.forEach(element => {
        if (element.enabled == true && element.default == true) {
          defaultVal = element.id;
        }
      });
      if (defaultVal) {
        this.optionsForm.get('CreditTerms').setValue(defaultVal);
      }

      // this.showForm = true;            
    }, async (err) => {
      await this.loading.dismiss();
      const errResult = this.globService.ConvertKeysToLowerCase(err);
      this.tranService.errorMessage('resource_forbidden');
    });
  }

  async getBillFormatList(){
    await this.loading.present();
    this.accountSvc.getBillFormatList().subscribe(async (_result) => {
      await this.loading.dismiss();
      const result = this.globService.ConvertKeysToLowerCase(_result);
      this.billFormatList = result;     
      this.billFormatList.forEach(billFormat => {
        if(billFormat.default == true){
          this.optionsForm.get('BillFormat').setValue(billFormat.id);
        }
      });
      // this.showForm = true;            
    }, async (err) => {
      await this.loading.dismiss();
      const errResult = this.globService.ConvertKeysToLowerCase(err);
      this.tranService.errorMessage('resource_forbidden');
    });
  }

  async getCreditStatusList(){
    await this.loading.present();
    this.accountSvc.getCreditStatusList().subscribe(async (_result) => {
      await this.loading.dismiss();
      const result = this.globService.ConvertKeysToLowerCase(_result);
      this.creditStatusList = result;      
      // this.showForm = true;            
    }, async (err) => {
      await this.loading.dismiss();
      const errResult = this.globService.ConvertKeysToLowerCase(err);
      this.tranService.errorMessage('resource_forbidden');
    });
  }

  async getChannelPartnerList(){
    this.showChannelSpinner = true;
    this.accountSvc.getChannelPartnerList(this.optionsForm.get('ChannelPartner').value).subscribe(async (_result) => {
      this.showChannelSpinner = false;
      const result = this.globService.ConvertKeysToLowerCase(_result);
      this.channelPartnerList = result.items;      
      // this.showForm = true;            
    }, async (err) => {
      this.showChannelSpinner = false;
      const errResult = this.globService.ConvertKeysToLowerCase(err);
      this.tranService.errorMessage('resource_forbidden');
    });    
  }

  async getSalesPersonList(Id: string){
    this.showSalesSpinner = true;
    let salesVal = this.optionsForm.get('SalesPerson').value;
    this.accountSvc.getSalesPersonList(Id, salesVal).subscribe(async (_result) => {
      this.showSalesSpinner = false;
      const result = this.globService.ConvertKeysToLowerCase(_result);
      this.salesPersonList = result.items;      
      // this.showForm = true;            
    }, async (err) => {
      this.showSalesSpinner = false;
      const errResult = this.globService.ConvertKeysToLowerCase(err);
      this.tranService.errorMessage('resource_forbidden');
    });    
  }

  async getContactSalesPersonList(){
    this.showSalesSpinner = true;
    let salesVal = this.optionsForm.get('SalesPerson').value;
    this.accountSvc.getContactSalesPersonList(salesVal).subscribe(async (_result) => {
      this.showSalesSpinner = false;
      const result = this.globService.ConvertKeysToLowerCase(_result);
      this.salesPersonList = result.items;      
      // this.showForm = true;            
    }, async (err) => {
      this.showSalesSpinner = false;
      const errResult = this.globService.ConvertKeysToLowerCase(err);
      this.tranService.errorMessage('resource_forbidden');
    });    
  }

  get f() {
    return this.optionsForm.controls;
  }

  prevForm() {
    this.AccountOptionsComponent.emit('before');
  }

  nextForm() {
    document.getElementById('optionsSubmitButton').click();
  }

  submitOptionsForm() {
    if (this.optionsForm.valid) {
      this.AccountOptionsComponent.emit(this.optionsForm.value);
    }
  }
  async setDefaultTaxrate() {
    await this.loading.present();
    this.accountSvc.getDefaultTaxId().subscribe(async (_result) => {
      await this.loading.dismiss();
      const result = this.globService.ConvertKeysToLowerCase(_result);


      if (result && result.length > 0) {
        this.defaultTaxrates = result;
      }else{
        this.defaultTaxrates = [];
      }
      // this.showForm = true;            
    }, async (err) => {
      await this.loading.dismiss();
      const errResult = this.globService.ConvertKeysToLowerCase(err);
      this.tranService.errorMessage('resource_forbidden');
    });
  }
  public setDefaultCurrency() {
    if (this.CurrenciesList && this.CurrenciesList.length > 0) {
      let val = null;
      this.CurrenciesList.forEach(cur => {
        if (cur.default == true && cur.display == true) {
          val = cur.id;
          this.optionsForm.get('Currency').setValue(cur.id);
        }
      });
    }
  }
  public setDefaultBillCycle() {
    if (this.billCycleList && this.billCycleList.length > 0) {
      let val = null;
      this.billCycleList.forEach(cur => {
        if (!val && cur.default == true && cur.display == true) {
          val = cur.id;
          this.optionsForm.get('BillingCycle').setValue(cur.id);
        }
      });
    }
  }
  @Input() set CurrenciesList(value: any) {
    this._CurrenciesList = value;
    this.setDefaultCurrency();
  }
  get CurrenciesList(): any {
    return this._CurrenciesList;
  }
  @Input() set BillCycleList(value: any) {
    this.billCycleList = [];
    if (typeof (value) === 'object' && value.length > 0) {
      value.forEach(item => {
        if (item.display == true) {
          this.billCycleList.push(item);
        }
      });
    }

    this.setDefaultBillCycle();
  }
  get BillCycleList(): any {
    return this.billCycleList;
  }
  selectTimeZone(event: MatAutocompleteSelectedEvent): void {
    this.optionsForm.get('Timezone').setValue(event.option.viewValue);
    this.availableCallTimezone = false;    
  }
  
  selectChannelPartner(event: MatAutocompleteSelectedEvent): void {
    this.optionsForm.get('ChannelPartner').setValue(event.option.viewValue);
    this.availableChannelPartner = false;
  }

  selectSalesPerson(event: MatAutocompleteSelectedEvent): void{
    this.optionsForm.get('SalesPerson').setValue(event.option.viewValue);
    this.availableSalesPerson = false;
  }

  clearField(fieldName: string){
    this.optionsForm.get(fieldName).reset();
    
  }
}
