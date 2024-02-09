import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';


import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { AdvancedSearchService } from './services/advanced-search.service';
import {
    ServiceTypeCode, ServiceTypes, BillingCycles, ContactSubTypes, BusinessUnits,
    NewContactSearch, PlanItem, ContactStatuses, AdvancedSearchPostItem
} from 'src/app/model';
import { TranService, ToastService, LoadingService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

@Component({
    selector: 'app-advanced-search',
    templateUrl: './advanced-search.page.html',
    styleUrls: ['./advanced-search.page.scss'],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: navigator.language },
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    ],
})
export class AdvancedSearchPage implements OnInit {
    @Output('setComponentValue') public componentValue: EventEmitter<NewContactSearch> = new EventEmitter<NewContactSearch>();

    advancedForm: UntypedFormGroup;
    advancedData: any = {};
    advancedSubmit: AdvancedSearchPostItem = {
        BusinessUnitCodes: [],
        ContactCode: '',
        Corporate: null,
        SubTypeCode: '',
        ContactStatusCode: '',
        Key: '',
        Name: '',
        CreatedDays: null,
        Service: '',
        ServiceName: '',
        ServiceReference: null,
        ServiceAttributeCode: '',
        ServiceAttribute: '',
        ServiceTypeCodeList: '',
        Email: '',
        Alias: '',
        CompanyId: '',
        FirstName: '',
        Address: '',
        Suburb: '',
        State: '',
        Postcode: '',
        ContactPhone: '',
        PaymentAccountNumber: '',
        PaymentAccountName: '',
        BillNumber: '',
        FinancialTransactionNumber: '',
        ChequeNumber: '',
        CostCentreCode: '',
        CostCentre: '',
        BillCycleCodeList: '',
        PlanCodeList: [],
        PlanName: '',
        Dealer: '',
        SIM: '',
        AccountsOnly: null,
        DeclinedReceiptsDays: null
    };

    

    serviceTypeCodeList: Array<ServiceTypeCode> = [];
    billCylcle: Array<BillingCycles> = [];
    serviceTypes: Array<ServiceTypes> = [];
    subTypes: Array<ContactSubTypes> = [];
    businessList: Array<BusinessUnits> = [];
    contactStatus: Array<ContactStatuses> = [];
    plansList: Array<PlanItem> = [];

    countSuccess = 0;

    loadingState = {
        BillCycle: false,
        ServiceTypes: false,
        SubTypes: false,
        Business: false,
        ContactStatus: false,
        Plans: false,
    };

    constructor(
        private formBuilder: UntypedFormBuilder,
        
        private cdr: ChangeDetectorRef,
        private advancedSearchService: AdvancedSearchService,
        private tranService: TranService,
        private toast: ToastService,
        private loading: LoadingService,
        public globService: GlobalService,
    ) {
        this.advancedForm = this.formBuilder.group({
            'ContactStatusCode': [''],
            'ContactCode': [''],
            'Corporate': [null],
            'SubTypeCode': [''],
            'Key': [''],
            'Name': [''],
            'CreatedDays': [null],
            'Service': [''], // for Service
            'ServiceName': [''], // for ServiceName
            'ServiceAttributeCode': [''],
            'ServiceTypeCode': [''],
            'Email': ['', Validators.email],
            'Alias': [''],
            'CompanyId': [''],
            'FirstName': [''],
            'Address': [''],
            'Suburb': [''],
            'State': [''],
            'Postcode': [''],
            'ContactPhone': [''],
            'PaymentAccountNumber': [''],
            'PaymentAccountName': [''],
            'BillNumber': [''],
            'FinancialTransactionNumber': [''],
            'ChequeNumber': [''],
            'CostCentreCode': [''],
            'CostCentre': [''],
            'BillingCycleCode': [''],
            'PlanCode': [''],
            'PlanName': [''],
            'Dealer': [''],
            'SIM': [''],
            'AccountsOnly': [null],
            'DeclinedReceiptsDays': [null],
            'TradeName': [''],
            'DOB': [''],
            'OrderNumber': [''],
            'BusinessUnitCode': [''],
            'OverdueEventsDays': [''],
            'FailedEventsDays': [''],
            'IEMI': [''],
            'NetworkIdentifier': [''],
            // 'ContactStatusCode': [''],
            // 'ServiceReference': [''],
            // 'ServiceAttribute': [''],
        });
        

    }

    async ngOnInit() {

        await this.loading.present();

        this.advancedSearchService.getServiceTypes().subscribe((result: ServiceTypes[]) => {
            // 
            this.serviceTypes = this.globService.ConvertKeysToLowerCase(result);
            this.loadingState.ServiceTypes = true;
        }, (error: any) => {
            this.loadingState.ServiceTypes = true;
            
            this.tranService.errorMessage(error);
        });

        this.advancedSearchService.getBillingCycles().subscribe((result: BillingCycles[]) => {
            // 
            this.billCylcle = this.globService.ConvertKeysToLowerCase(result);
            this.loadingState.BillCycle = true;
        }, (error: any) => {
            this.loadingState.BillCycle = true;
            
            this.tranService.errorMessage(error);
        });

        this.advancedSearchService.getContactSubTypes().subscribe((result: ContactSubTypes[]) => {
            // 
            this.loadingState.SubTypes = true;
            this.subTypes = this.globService.ConvertKeysToLowerCase(result);
        }, (error: any) => {
            this.loadingState.SubTypes = true;
            
            this.tranService.errorMessage(error);
        });

        this.advancedSearchService.getBusinessUnits().subscribe((result: BusinessUnits[]) => {
            // 
            this.loadingState.Business = true;
            this.businessList = this.globService.ConvertKeysToLowerCase(result);
        }, (error: any) => {
            this.loadingState.Business = true;
            
            this.tranService.errorMessage(error);
        });

        this.advancedSearchService.getPlans().subscribe((result: PlanItem[]) => {
            // 
            this.loadingState.Plans = true;
            this.plansList = this.globService.ConvertKeysToLowerCase(result);
        }, (error: any) => {
            this.loadingState.Plans = true;
            
            this.tranService.errorMessage(error);
        });


        this.advancedSearchService.getContactStatuses().subscribe((result: ContactStatuses[]) => {
            
            this.loadingState.ContactStatus = true;
            this.contactStatus = this.globService.ConvertKeysToLowerCase(result);
        }, (error: any) => {
            this.loadingState.ContactStatus = true;
            
            this.tranService.errorMessage(error);
        });


        let savedForm = localStorage.getItem('advancedForm');
        if (savedForm === null || typeof (savedForm) === 'undefined') {
            this.dismissLoading();
        } else {
            this.setInitialFormValues();
        }
    }

    async dismissLoading() {
        let state = true;
        for (var key in this.loadingState) {
            if (!this.loadingState[key]) {
                state = false;
            }
        }
        if (state) {
            await this.loading.dismiss();
        } else {
            setTimeout(() => {
                this.dismissLoading();
            }, 1000);
        }
    }

    async setInitialFormValues() {
        let state = true;
        for (var key in this.loadingState) {
            if (!this.loadingState[key]) {
                state = false;
            }
        }
        if (state) {
            await this.loading.dismiss();
            let savedForm = localStorage.getItem('advancedForm');
            if (savedForm !== null && typeof (savedForm) !== 'undefined') {
                this.advancedData = JSON.parse(savedForm);
            }
            for (var key in this.advancedData) {
                this.advancedForm.controls[key].setValue(this.advancedData[key]);
            }
        } else {
            setTimeout(() => {
                this.setInitialFormValues();
            }, 1000);
        }
    }

    advanceSearchSubmit() {
        // this.advancedData.BusinessUnitCodes = this.advancedForm.controls['ContactStatusCode'].value;
        this.advancedData.ContactCode = this.advancedForm.controls['ContactCode'].value;
        this.advancedData.Corporate = this.advancedForm.controls['Corporate'].value;
        this.advancedData.SubTypeCode = this.advancedForm.controls['SubTypeCode'].value;
        this.advancedData.ContactStatusCode = this.advancedForm.controls['ContactStatusCode'].value;
        this.advancedData.Key = this.advancedForm.controls['Key'].value;
        this.advancedData.Name = this.advancedForm.controls['Name'].value;
        this.advancedData.CreatedDays = this.advancedForm.controls['CreatedDays'].value;
        this.advancedData.Service = this.advancedForm.controls['Service'].value;
        this.advancedData.ServiceName = this.advancedForm.controls['ServiceName'].value;
        // this.advancedData.ServiceReference = this.advancedForm.controls['ServiceReference'].value;
        this.advancedData.ServiceAttributeCode = this.advancedForm.controls['ServiceAttributeCode'].value;
        // this.advancedData.ServiceAttribute = this.advancedForm.controls['ServiceAttribute'].value;
        this.advancedData.ServiceTypeCode = this.advancedForm.controls['ServiceTypeCode'].value;
        this.advancedData.Email = this.advancedForm.controls['Email'].value;
        this.advancedData.Alias = this.advancedForm.controls['Alias'].value;
        this.advancedData.CompanyId = this.advancedForm.controls['CompanyId'].value;
        this.advancedData.FirstName = this.advancedForm.controls['FirstName'].value;
        this.advancedData.Address = this.advancedForm.controls['Address'].value;
        this.advancedData.Suburb = this.advancedForm.controls['Suburb'].value;
        this.advancedData.State = this.advancedForm.controls['State'].value;
        this.advancedData.Postcode = this.advancedForm.controls['Postcode'].value;
        this.advancedData.ContactPhone = this.advancedForm.controls['ContactPhone'].value;
        this.advancedData.PaymentAccountNumber = this.advancedForm.controls['PaymentAccountNumber'].value;
        this.advancedData.PaymentAccountName = this.advancedForm.controls['PaymentAccountName'].value;
        this.advancedData.BillNumber = this.advancedForm.controls['BillNumber'].value;
        this.advancedData.FinancialTransactionNumber = this.advancedForm.controls['FinancialTransactionNumber'].value;
        this.advancedData.ChequeNumber = this.advancedForm.controls['ChequeNumber'].value;
        this.advancedData.CostCentreCode = this.advancedForm.controls['CostCentreCode'].value;
        this.advancedData.CostCentre = this.advancedForm.controls['CostCentre'].value;
        this.advancedData.BillingCycleCode = this.advancedForm.controls['BillingCycleCode'].value;
        this.advancedData.PlanCode = this.advancedForm.controls['PlanCode'].value;
        this.advancedData.PlanName = this.advancedForm.controls['PlanName'].value;
        this.advancedData.Dealer = this.advancedForm.controls['Dealer'].value;
        this.advancedData.SIM = this.advancedForm.controls['SIM'].value;
        this.advancedData.AccountsOnly = this.advancedForm.controls['AccountsOnly'].value;
        this.advancedData.DeclinedReceiptsDays = this.advancedForm.controls['DeclinedReceiptsDays'].value;

        this.advancedData.BusinessUnitCode = this.advancedForm.controls['BusinessUnitCode'].value;
        // this.advancedData.ContactPhoneAreaCode = this.advancedForm.controls['ContactPhoneAreaCode'].value;
        this.advancedData.DOB = this.advancedForm.controls['DOB'].value;
        this.advancedData.IEMI = this.advancedForm.controls['IEMI'].value;
        this.advancedData.NetworkIdentifier = this.advancedForm.controls['NetworkIdentifier'].value;
        this.advancedData.OrderNumber = this.advancedForm.controls['OrderNumber'].value;
        this.advancedData.TradeName = this.advancedForm.controls['TradeName'].value;

        this.advancedData.OverdueEventsDays = this.advancedForm.controls['OverdueEventsDays'].value;
        this.advancedData.FailedEventsDays = this.advancedForm.controls['FailedEventsDays'].value;

        this.advancedSubmit.BusinessUnitCodes = [];
        this.advancedSubmit.PlanCodeList = [];
        this.advancedSubmit.BusinessUnitCodes.push(this.advancedForm.controls['BusinessUnitCode'].value);
        this.advancedSubmit.ContactCode = this.advancedForm.controls['ContactCode'].value;
        if (this.advancedForm.controls['Corporate'].value === null) {
            // this.advancedSubmit.Corporate = this.advancedForm.controls['Corporate'].value;
            this.advancedSubmit.Corporate = null;
        } else if (this.advancedForm.controls['Corporate'].value === 'true') {
            this.advancedSubmit.Corporate = true;
        } else {
            this.advancedSubmit.Corporate = false;
        }
        this.advancedSubmit.SubTypeCode = this.advancedForm.controls['SubTypeCode'].value;
        this.advancedSubmit.ContactStatusCode = this.advancedForm.controls['ContactStatusCode'].value;
        this.advancedSubmit.Key = this.advancedForm.controls['Key'].value;
        this.advancedSubmit.Name = this.advancedForm.controls['Name'].value;
        this.advancedSubmit.CreatedDays = this.advancedForm.controls['CreatedDays'].value;
        this.advancedSubmit.Service = this.advancedForm.controls['Service'].value;
        this.advancedSubmit.ServiceName = this.advancedForm.controls['ServiceName'].value;
        this.advancedSubmit.ServiceAttributeCode = this.advancedForm.controls['ServiceAttributeCode'].value;
        this.advancedSubmit.ServiceTypeCodeList = this.advancedForm.controls['ServiceTypeCode'].value;
        this.advancedSubmit.Email = this.advancedForm.controls['Email'].value;
        this.advancedSubmit.Alias = this.advancedForm.controls['Alias'].value;
        this.advancedSubmit.CompanyId = this.advancedForm.controls['CompanyId'].value;
        this.advancedSubmit.FirstName = this.advancedForm.controls['FirstName'].value;
        this.advancedSubmit.Address = this.advancedForm.controls['Address'].value;
        this.advancedSubmit.Suburb = this.advancedForm.controls['Suburb'].value;
        this.advancedSubmit.State = this.advancedForm.controls['State'].value;
        this.advancedSubmit.Postcode = this.advancedForm.controls['Postcode'].value;
        this.advancedSubmit.PlanName = this.advancedForm.controls['PlanName'].value;
        this.advancedSubmit.ContactPhone = this.advancedForm.controls['ContactPhone'].value;
        this.advancedSubmit.PaymentAccountNumber = this.advancedForm.controls['PaymentAccountNumber'].value;
        this.advancedSubmit.PaymentAccountName = this.advancedForm.controls['PaymentAccountName'].value;
        this.advancedSubmit.BillNumber = this.advancedForm.controls['BillNumber'].value;
        this.advancedSubmit.FinancialTransactionNumber = this.advancedForm.controls['FinancialTransactionNumber'].value;
        this.advancedSubmit.ChequeNumber = this.advancedForm.controls['ChequeNumber'].value;
        this.advancedSubmit.CostCentreCode = this.advancedForm.controls['CostCentreCode'].value;
        this.advancedSubmit.CostCentre = this.advancedForm.controls['CostCentre'].value;
        this.advancedSubmit.BillCycleCodeList = this.advancedForm.controls['BillingCycleCode'].value;
        this.advancedSubmit.PlanCodeList.push((this.advancedForm.controls['PlanCode'].value));
        this.advancedSubmit.Dealer = this.advancedForm.controls['Dealer'].value;
        this.advancedSubmit.SIM = this.advancedForm.controls['SIM'].value;
        if (this.advancedForm.controls['AccountsOnly'].value === 'true') {
            // this.advancedSubmit.AccountsOnly = this.advancedForm.controls['AccountsOnly'].value;
            this.advancedSubmit.AccountsOnly = true;
        } else if (this.advancedForm.controls['AccountsOnly'].value === null) {
            this.advancedSubmit.AccountsOnly = null;
        } else {
            this.advancedSubmit.AccountsOnly = false;
        }
        this.advancedSubmit.DeclinedReceiptsDays = this.advancedForm.controls['DeclinedReceiptsDays'].value;

        let newSubmit = this.advancedSubmit;
        for (var key in newSubmit) {
            if (this.checkEmptyValue(newSubmit[key])) {

            } else {
                delete newSubmit[key];
            }
        }
        localStorage.setItem('advancedForm', JSON.stringify(this.advancedData));

        // this.componentValue.emit(this.advancedData);
        this.AdvancedSearchSubmit();

    }

    checkEmptyValue(value) {
        if (value === '' || value === null || typeof (value) === 'undefined' || ((value[0] === '' || value[0] === null) && value.length === 1)) {
            return false;
        }
        return true;
    }

    async AdvancedSearchSubmit() {
        const reqPara = {
            'SkipRecords': '0',
            'TakeRecords': '10'
        };
        await this.loading.present();
        this.advancedSearchService.ContactSearchAdvanced(reqPara, this.advancedSubmit).subscribe(async (result: NewContactSearch) => {
            
            await this.loading.dismiss();
            let convertResult = this.globService.ConvertKeysToLowerCase(result);
            if (convertResult == null) {
                this.tranService.convertText('no_advanced_search').subscribe(result => {
                    this.toast.present(result);
                });
            } else {
                if (convertResult.items !== null && convertResult.items.length > 0) {
                    this.componentValue.emit(convertResult);
                } else {
                    this.tranService.convertText('no_advanced_search').subscribe(result => {
                        this.toast.present(result);
                    });
                }
            }
        }, async (error: any) => {
            await this.loading.dismiss();
            
            this.tranService.errorMessage(error);
        });
    }

    clearAdvancedForm() {
        localStorage.removeItem('advancedForm');
        this.advancedForm.reset();
    }

    triggerAdvancedSearch() {
        document.getElementById('submitButtonAdvanced').click();
    }

    backAdvancedSearch() {
        let backSearch = {
            statuscode: null,
            recordcount: null,
            errormessage: null,
            items: []
        }
        this.componentValue.emit(backSearch);
    }

    get ff() {
        return this.advancedForm.controls;
    }

}
