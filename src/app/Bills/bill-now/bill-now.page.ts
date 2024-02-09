import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { LoadingService, ToastService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { BillNowService } from './services/bill-now.service';

@Component({
  selector: 'app-bill-now',
  templateUrl: './bill-now.page.html',
  styleUrls: ['./bill-now.page.scss']
})
export class BillNowPage implements OnInit {

  @Input() ContactCode: string = '';

  @Output('setComponentValue') componentValue: EventEmitter<string> = new EventEmitter<string>();

  rangeSelectionValue: string = 'account';
  periodList = [];
  cycleList = [];
  dueDateSelectionValue: string = 'use_default';
  billNowForm: UntypedFormGroup;

  disableIncludeUsage: boolean;
  disableMiscellaneousCharge: boolean;
  chargeValue: string = '';

  serviceParams: any = {
    SearchString: '',
    SkipRecords: 0,
    TakeRecords: 20
  };


  searchList: any[] = [];
  filteredOptions: any[] = [];

  showSpinner: boolean = false;
  availSearch: boolean = true;


  constructor(private fb: UntypedFormBuilder,
    private tranService: TranService,
    private toast: ToastService,
    private loading: LoadingService,
    public globService: GlobalService,
    private billService: BillNowService,
  ) {

    this.tranService.translaterService();

    this.billNowForm = fb.group({
      range_account: [{ value: 'account' }],
      range_service: [''],
      period: [''],
      cycle: [''],
      bill_number: [''],
      exportPDF: [false],
      exportXLS: [false],

      include_usage: [true],
      include_usage_check: [false],

      one_off_charges_only: [true],
      selcomm_charges_only: [false],
      usage_upto_this_date_only: [new Date(), Validators.required],
      bill_date: [new Date(), [Validators.required]],
      due_date: [new Date(), [Validators.required]]
    });

    this.rangeSelection('account');
    this.changeUpTo();
  }


  ngOnInit(): void {
    this.getBillPeriods();
    this.getBillCycle();
  }


  rangeSelection(range_type: string) {
    this.rangeSelectionValue = range_type;
    if (this.rangeSelectionValue === 'account') {
      this.billNowForm.get('period').setValidators(Validators.required);
      this.billNowForm.get('bill_number').setValidators(null);
    } else if (this.rangeSelectionValue === 'service') {
      this.billNowForm.get('bill_number').setValidators(Validators.required);
      this.billNowForm.get('period').setValidators(null);
    }

    this.billNowForm.updateValueAndValidity();
  }


  dueDateSelection = (due_date_type: string): void => {
    this.dueDateSelectionValue = due_date_type;
  };



  saveForm = (): void => {
    document.getElementById('billNowSubmitButton').click();
  };

  billNowSubmit() {
  }

  changeUpTo() {
    if (this.billNowForm.get('include_usage_check').value) {
      this.billNowForm.get('usage_upto_this_date_only').enable();
      this.billNowForm.get('usage_upto_this_date_only').setValidators(Validators.required);
    } else {
      this.billNowForm.get('usage_upto_this_date_only').disable();
      this.billNowForm.get('usage_upto_this_date_only').setValidators(null);

      this.billNowForm.addControl('searchCtrl', new UntypedFormControl('', Validators.required));


      this.filteredOptions = this.filter('');

      this.billNowForm.get('searchCtrl').valueChanges.pipe(debounceTime(1000)).subscribe(async (result: any) => {
        if (result) {
          if (this.availSearch) {
            this.showSpinner = true;
            await this.getServiceTypes();
            this.showSpinner = false;
            this.filteredOptions = this.filter(result);
          } else {
            this.availSearch = false;
          }
        }
      });

    }
  }

  filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.searchList.filter(option => option.serviceid.includes(filterValue));
  }

  getSearchResult() {
    this.availSearch = false;
  }

  get f() {
    return this.billNowForm.controls;
  }

  clearSearch() {
    this.billNowForm.get('searchCtrl').setValue('');
  }

  chargeSelection(str) {
    this.chargeValue = str;
  }

  async getBillPeriods() {

    await this.loading.present();
    try {
      const result = await this.billService.getHotBillPeriods(this.ContactCode).toPromise();
      console.log('result', result);
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      console.log('convert result', convResult);
      this.periodList = convResult;
    } catch (error) {

      this.tranService.errorMessage(error);
    }

    await this.loading.dismiss();
  }

  // async getBillCycle() {
  //   const reqBody = {
  //     OperationId: '/Accounts/BillCycle/{AccountCode}#get',
  //     Parameters: [
  //       {
  //         Type: 'path',
  //         Name: 'AccountCode',
  //         Value: this.ContactCode,
  //       }
  //     ]
  //   }
  //   try {
  //     const result = await this.globService.operationAPIService(reqBody).toPromise();
  //     const convResult = this.globService.ConvertKeysToLowerCase(JSON.parse(result));
  //     this.billNowForm.get('cycle').setValue(convResult.cycle);
  //   } catch (error) {

  //     this.tranService.errorMessage(error);
  //   }
  // }

  async getBillCycle() {

    try {
      const result = await this.billService.getBillCycle(this.ContactCode).toPromise();
      const convResult = this.globService.ConvertKeysToLowerCase(result[0]);
      this.billNowForm.get('cycle').setValue(convResult.cycle);
    } catch (error) {

      this.tranService.errorMessage(error);
    }
  }

  async getServiceTypes() {
    const queryParam = {
      SearchString: this.billNowForm.get('searchCtrl').value,
      SkipRecords: this.serviceParams.SkipRecords.toString(),
      TakeRecords: this.serviceParams.TakeRecords.toString()
    }

    this.billService.billSearch('/Services/Search/' + this.ContactCode, queryParam).subscribe((result) => {
      this.searchList = JSON.parse(result);
    }, (error: any) => {
      this.tranService.errorMessage(error);
    });
  }



}
