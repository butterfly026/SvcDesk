import { coerceNumberProperty } from '@angular/cdk/coercion';
import { CurrencyPipe, getLocaleCurrencyCode, getLocaleCurrencySymbol } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { TranService, LoadingService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { BillOptionsService } from './services/bill-options.service';

import * as $ from 'jquery';

@Component({
  selector: 'app-bill-options',
  templateUrl: './bill-options.component.html',
  styleUrls: ['./bill-options.component.scss'],
  providers: [CurrencyPipe]
})
export class BillOptionsComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Output('BillOptionsComponent') BillOptionsComponent: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('exclutionStart') exclutionStart = MatDatepicker;

  
  billForm: UntypedFormGroup;

  billFormats: any;
  billFormatsAvailable: any[] = [];
  billCyclesAccount: any[] = [];
  billCycles: any[] = [];
  invoiceIntervals: any;
  invoiceIntervalsAvailable: any[] = [];
  exclusions: any;
  currencies: any;
  currenciesAvailable: any;
  tax: any;
  taxLists: any[] = [];
  exemptionsList: any[] = [];
  taxRateList: any[] = [];
  transactionTypeList: any[] = [];
  termList: any[] = [];
  termsAccountData: any;

  currentDate: Date = new Date();

  exclutionCreate: string = '';
  currentExclution: any = {};
  exclustionValue: any;

  exclusionForm: UntypedFormGroup;
  exStartList: any[] = [];
  exEndList: any[] = [];


  exemptionForm: UntypedFormGroup;
  exemptionState: string = '';
  currentExemption: any = {};
  exemptionEndType: string = 'on_going';

  billCycleState: string = '';
  currentBillCycle: any = {};
  billCycleForm: UntypedFormGroup;
  billCyclceValue: any;

  termState: string = '';
  currentTerm: any = {};
  termsForm: UntypedFormGroup;
  termValue: any;

  BillOptions: any;
  BillData: any = {};

  enable: boolean = true;
  disable: boolean = false;

  billReturns: any;
  billReturnsAvailable: any;
  currentReturns: any = {};
  billReturnsState: string = '';
  billReturnsForm: UntypedFormGroup;

  proofAccount: any;
  proofAccountState: string = '';
  proofAccountForm: UntypedFormGroup;

  billCycleStatus: string = '';
  firstBillOption: boolean = false;

  localCurrency: string = '';
  localCurrencySymbol: string = '';

  constructor(
    private tranService: TranService,
    
    private loading: LoadingService,
    private billService: BillOptionsService,
    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService,
    private currencyPipe: CurrencyPipe,
  ) {
    this.tranService.translaterService();
    

    this.billForm = this.formBuilder.group({
      billFormart: ['', Validators.required],
      provBill: ['', Validators.required],
      // bPNSuppression: ['', Validators.required],
      provEmail: ['', Validators.required],
      provEcel: ['', Validators.required],
      // useEmail: ['', Validators.required],
      // returnBill: ['', Validators.required],
      proofAccount: ['', Validators.required],
      // billCycle: ['', Validators.required],
      invoiceInterval: ['', Validators.required],
      // recentExclusion: ['', Validators.required],
      // terms: ['', Validators.required],
      currency: ['', Validators.required],
      taxation: ['', Validators.required],
      exemptions: ['', Validators.required],
    });

    this.exclusionForm = this.formBuilder.group({
      exclutionStart: ['', Validators.required],
      exclutionEnd: ['', Validators.required],
    });

    this.exemptionForm = this.formBuilder.group({
      exemptionTax: ['', Validators.required],
      exemptionType: ['', Validators.required],
      exemptionsStart: ['', Validators.required],
      exemptionsEnd: ['', Validators.required],
    });

    this.billCycleForm = this.formBuilder.group({
      billCycle: ['', Validators.required],
      billCycleStart: ['', Validators.required],
    });

    this.termsForm = this.formBuilder.group({
      creditLimit: ['', Validators.required],
      terms: ['', Validators.required]
    });

    this.billReturnsForm = this.formBuilder.group({
      id: ['', Validators.required]
    });

    this.proofAccountForm = this.formBuilder.group({
      Note: ['', Validators.required]
    });

    this.exclusionForm.get('exclutionEnd').disable();

    this.changeExemptionEndTypes();

    this.localCurrency = getLocaleCurrencyCode(navigator.language);
    this.localCurrencySymbol = getLocaleCurrencySymbol(navigator.language);

    // this.termsForm.get('creditLimit').valueChanges.subscribe(value => {
    //   const ctrl = this.termsForm.get('creditLimit') as FormControl;

    //   if (isNaN(<any>value.charAt(0))) {
    //     const val = coerceNumberProperty(value.slice(1, value.length));
    //     ctrl.setValue(this.currencyPipe.transform(val), { emitEvent: false, emitViewToModelChange: false });
    //   } else {
    //     ctrl.setValue(this.currencyPipe.transform(value), { emitEvent: false, emitViewToModelChange: false });
    //   }
    // });
  }

  async changeProof(event) {
    if (event.checked) {
      this.showCreateForm('proof');
    } else {
      await this.deleteProofAccount();
    }
  }

  async ngOnInit() {
    await this.loading.present();
    await this.getBillOptions();
    await this.loading.dismiss();
    await this.getBillFormatsAvailable();
    await this.getInvoiceIntervalsAvailable();
    await this.getCurrencyAvailable();
    await this.getTaxesAvailbale();
    await this.getTaxExemptions();
    await this.getTaxRates();
    await this.getTransactionTypes();

    // await this.getBillFormats();
    // await this.getInvoiceIntervals();
    // await this.getCurrency();
    // await this.getTaxes();
  }

  async getBillOptions() {
    try {
      this.BillOptions = this.globService.ConvertKeysToLowerCase(await this.billService.getBillOptions(this.ContactCode).toPromise());
      for (let list of this.BillOptions) {
        this.BillData[list.id] = list;
        switch (list.id) {
          case 'P':
            this.billForm.get('provBill').setValue(this.convStringToBool(this.BillData.P.value));
            if (!list.editable) {
              this.billForm.get('provBill').disable();
            }
            break;
          case 'E':
            this.billForm.get('provEmail').setValue(this.convStringToBool(this.BillData.E.value));
            if (!list.editable) {
              this.billForm.get('provEmail').disable();
            }
            break;
          case 'X':
            this.billForm.get('provEcel').setValue(this.convStringToBool(this.BillData.X.value));
            if (!list.editable) {
              this.billForm.get('provEcel').disable();
            }
            break;
          case 'BLFM':
            if (list.mandatory) {
              this.billForm.get('billFormart').setValidators(Validators.required);
            } else {
              this.billForm.get('billFormart').clearValidators();
            }
            if (!list.editable) {
              this.billForm.get('billFormart').disable();
            }
            this.billForm.get('billFormart').setValue(this.BillData['BLFM'].key);
            break;
          case 'BLRT':
            break;
          case 'BLPR':
            if (list.mandatory) {
              this.billForm.get('proofAccount').setValidators(Validators.required);
            } else {
              this.billForm.get('proofAccount').clearValidators();
            }
            if (!list.editable) {
              this.billForm.get('proofAccount').disable();
            }
            // this.billForm.get('proofAccount').disable();
            this.billForm.get('proofAccount').setValue(this.convStringToBool(this.BillData['BLPR'].value));
            break;
          case 'BLCC':
            this.billCyclceValue = this.BillData['BLCC'].value;
            break;
          case 'BLII':
            if (list.mandatory) {
              this.billForm.get('invoiceInterval').setValidators(Validators.required);
            } else {
              this.billForm.get('invoiceInterval').clearValidators();
            }
            if (!list.editable) {
              this.billForm.get('invoiceInterval').disable();
            }
            this.billForm.get('invoiceInterval').setValue(this.BillData['BLII'].key);
            break;
          case 'BLEX':
            this.exclustionValue = this.BillData['BLEX'].value;
            break;
          case 'CUCU':
            if (list.mandatory) {
              this.billForm.get('currency').setValidators(Validators.required);
            } else {
              this.billForm.get('currency').clearValidators();
            }
            if (!list.editable) {
              this.billForm.get('currency').disable();
            }
            this.billForm.get('currency').setValue(this.BillData['CUCU'].key);
            break;
          case 'TATA':
            if (list.mandatory) {
              this.billForm.get('taxation').setValidators(Validators.required);
            } else {
              this.billForm.get('taxation').clearValidators();
            }
            if (!list.editable) {
              this.billForm.get('taxation').disable();
            }
            this.billForm.get('taxation').setValue(this.BillData['TATA'].key);
            break;
          case 'TAEX':
            if (list.mandatory) {
              this.billForm.get('exemptions').setValidators(Validators.required);
            } else {
              this.billForm.get('exemptions').clearValidators();
            }
            if (!list.editable) {
              this.billForm.get('exemptions').disable();
            }
            this.billForm.get('exemptions').setValue(this.BillData['TAEX'].key);
            break;
          case 'TERM':
            this.termValue = this.BillData['TERM'];
            break;

          default:
            break;
        }
      }

      if (!this.firstBillOption) {
        this.firstBillOption = true;
      } else {
        this.BillOptionsComponent.emit('updateBillOptions');
      }
    } catch (error) {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    }
  }

  async getBillFormats() {
    try {
      this.billFormats = this.globService.ConvertKeysToLowerCase(await this.billService.getBillFormats(this.ContactCode).toPromise());
      // this.billForm.get('billFormart').setValue(this.billFormats.id);
    } catch (error) {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    }
  }

  async getBillFormatsAvailable() {
    try {
      this.billFormatsAvailable = this.globService.ConvertKeysToLowerCase(await this.billService.getBillFormatsAvailable().toPromise());
    } catch (error) {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    }
  }

  async getBillReturns() {
    try {
      this.billReturns = this.globService.ConvertKeysToLowerCase(await this.billService.getBillReturns(this.ContactCode).toPromise());
      if (this.billReturns.length > 0) {
        this.currentReturns = this.billReturns[0];
      }
    } catch (error) {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    }
  }

  async getBillReturnsAvailable() {
    try {
      this.billReturnsAvailable = this.globService.ConvertKeysToLowerCase(await this.billService.getBillReturnsAvailable().toPromise());
    } catch (error) {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    }
  }

  async getBillProofs() {
    try {
      this.proofAccount = this.globService.ConvertKeysToLowerCase(await this.billService.getBillProofs(this.ContactCode).toPromise());
      this.billForm.get('proofAccount').setValue(this.proofAccount.note);
    } catch (error) {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    }
  }

  async getBillCyclesAccount() {
    try {
      this.billCyclesAccount = [];
      const billCycleArray = this.globService.ConvertKeysToLowerCase(await this.billService.getBillCyclesAccount(this.ContactCode).toPromise());
      for (let list of billCycleArray) {
        list.status = false;
        this.billCyclesAccount.push(list);
      }

      for (let list of this.billCyclesAccount) {
        if (list.cycle === this.BillData['BLCC'].value) {
          this.currentBillCycle = list;
          list.status = true;
          return;
        }
      }
    } catch (error) {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    }
  }

  async getBillCycles() {
    try {
      this.billCycles = this.globService.ConvertKeysToLowerCase(await this.billService.getBillCyclesAvailable(this.ContactCode).toPromise());
    } catch (error) {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    }
  }

  async getInvoiceIntervals() {
    try {
      this.invoiceIntervals = this.globService.ConvertKeysToLowerCase(await this.billService.getInvoiceIntervals(this.ContactCode).toPromise());
    } catch (error) {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    }
  }

  async getInvoiceIntervalsAvailable() {
    try {
      this.invoiceIntervalsAvailable = this.globService.ConvertKeysToLowerCase(await this.billService.getInvoiceIntervalsAvailable().toPromise());
    } catch (error) {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    }
  }

  async getBillRunExclusions() {
    try {
      this.exclusions = this.globService.ConvertKeysToLowerCase(await this.billService.getBillRunExclusions(this.ContactCode).toPromise());
      for (let list of this.exclusions.billrunexclusionhistory) {
        if (list.id === this.exclustionValue) {
          this.currentExclution = list;
        }
      }
    } catch (error) {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    }
  }

  // async getBillRunExclusionPeriods() {
  //   try {
  //     const reqBody = {
  //       OperationId: '/Accounts/BillPeriods/#get',
  //     }
  //     const periodLists = await this.globService.operationAPIService(reqBody).toPromise();
  //     this.exStartList = this.globService.ConvertKeysToLowerCase(JSON.parse(periodLists)).reverse();
  //   } catch (error) {
  //     await this.loading.dismiss();
  //     this.tranService.errorMessage(error);
  //   }
  // }

  async getBillRunExclusionPeriods() {
    try {
      const periodLists = await this.billService.billRunExclusions('/Accounts/BillPeriods/').toPromise();
      this.exStartList = this.globService.ConvertKeysToLowerCase(periodLists).reverse();
    } catch (error) {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    }
  }

  async getCurrency() {
    try {
      this.currencies = this.globService.ConvertKeysToLowerCase(await this.billService.getCurrency(this.ContactCode).toPromise());
    } catch (error) {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    }
  }

  async getCurrencyAvailable() {
    try {
      this.currenciesAvailable = this.globService.ConvertKeysToLowerCase(await this.billService.getCurrencyAvailable(this.ContactCode).toPromise());
    } catch (error) {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    }
  }

  async getTaxes() {
    try {
      this.tax = this.globService.ConvertKeysToLowerCase(await this.billService.getTaxes(this.ContactCode).toPromise());
    } catch (error) {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    }
  }

  async getTaxesAvailbale() {
    try {
      this.taxLists = this.globService.ConvertKeysToLowerCase(await this.billService.getTaxesAvailable().toPromise());
    } catch (error) {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    }
  }

  async getTaxExemptions() {
    try {
      this.exemptionsList = this.globService.ConvertKeysToLowerCase(await this.billService.getTaxExemptions(this.ContactCode).toPromise());
    } catch (error) {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    }
  }

  async getTaxRates() {
    try {
      this.taxRateList = this.globService.ConvertKeysToLowerCase(await this.billService.getTaxRates().toPromise());
    } catch (error) {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    }
  }

  async getTransactionTypes() {
    try {
      this.transactionTypeList = this.globService.ConvertKeysToLowerCase(await this.billService.getTransactionTypes().toPromise());
    } catch (error) {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    }
  }

  async getTerms() {
    try {
      const termLists = await this.billService.getTerms().toPromise();
      this.termList = this.globService.ConvertKeysToLowerCase(termLists);
    } catch (error) {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    }
  }

  async getTermsAccount() {
    try {
      const termLists = await this.billService.getTermsAccount(this.ContactCode).toPromise();
      this.termsAccountData = this.globService.ConvertKeysToLowerCase(termLists);

      if (this.termsAccountData.termsprofileshistory.length > 0) {
        for (let list of this.termsAccountData.termsprofileshistory) {
          list.creditlimit = this.globService.getCurrencyConfiguration(list.creditlimit);
          if (list.termprofileid === this.termValue.key) {
            const data = {
              creditLimit: this.termsAccountData.creditlimit,
              termsHistory: list
            }
            this.currentTerm = data;
          }
        }
      }

      // this.termsAccountData = await this.billService.getTermsAccount(this.ContactCode).toPromise();

      // if (this.termsAccountData.termsprofileshistory.length > 0) {
      //   for (let list of this.termsAccountData.termsprofileshistory) {
      //     if (list.termprofileid === this.termValue.key) {
      //       const data = {
      //         creditLimit: this.termsAccountData.creditlimit,
      //         termsHistory: list
      //       }
      //       this.currentTerm = data;
      //     }
      //   }
      // }

    } catch (error) {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    }
  }


  billOptionSubmit() {

  }

  get f() {
    return this.billForm.controls;
  }

  async showDetailForm(value) {
    switch (value) {
      case 'billCycle':
        this.billCycleState = 'detail';
        await this.loading.present();
        await this.getBillCycles();
        await this.getBillCyclesAccount();
        await this.loading.dismiss();
        break;
      case 'exclusion':
        this.exclutionCreate = 'detail';
        await this.loading.present();
        await this.getBillRunExclusions();
        await this.getBillRunExclusionPeriods();
        await this.loading.dismiss();
        break;
      case 'exemption':
        this.exemptionState = 'detail';
        break;
      case 'terms':
        this.termState = 'detail';
        await this.loading.present();
        await this.getTerms();
        await this.getTermsAccount();
        await this.loading.dismiss();
        break;
      case 'returns':
        this.billReturnsState = 'detail';
        await this.loading.present();
        await this.getBillReturns();
        await this.getBillReturnsAvailable();
        await this.loading.dismiss();
        break;
      case 'proof':
        this.proofAccountState = 'detail';
        this.getBillProofs();
        break;
      default:
        break;
    }
  }

  showCreateForm(value) {
    switch (value) {
      case 'billCycle':
        this.billCycleForm.reset();
        this.billCycleForm.get('billCycleStart').setValue(new Date());
        this.billCycleState = 'create';
        break;
      case 'exclusion':
        this.exclusionForm.reset();
        this.exclutionCreate = 'create';
        break;
      case 'exemption':
        this.exemptionForm.reset();
        this.exemptionState = 'create';
        break;
      case 'returns':
        this.billReturnsForm.reset();
        this.billReturnsState = 'create';
        break;
      case 'proof':
        this.proofAccountForm.reset();
        this.proofAccountState = 'create';
        this.getBillProofs();
        break;
      default:
        break;
    }
  }

  openUpdateForm(value) {
    switch (value) {
      case 'billCycle':
        this.billCycleForm.get('billCycle').setValue((this.currentBillCycle.cycleid).toString());
        this.billCycleForm.get('billCycleStart').setValue(new Date(this.currentBillCycle.from));
        this.billCycleState = 'update';
        break;
      case 'exclusion':
        this.exclusionForm.get('exclutionStart').setValue((this.currentExclution.startperiod).toString());
        this.exclusionForm.get('exclutionEnd').setValue((this.currentExclution.endperiod).toString());
        this.exclutionCreate = 'update';
        break;
      case 'exemption':
        this.exemptionForm.get('exemptionTax').setValue((this.currentExemption.taxid).toString());
        this.exemptionForm.get('exemptionType').setValue(this.currentExemption.transactiontypeid);
        this.exemptionForm.get('exemptionsStart').setValue(new Date(this.currentExemption.from));
        if (this.currentExemption.to === 'On going') {
          this.exemptionEndType = 'on_going';
          this.changeExemptionEndTypes();
        } else {
          this.exemptionEndType = 'end';
          this.changeExemptionEndTypes();
          this.exemptionForm.get('exemptionsEnd').setValue(new Date(this.currentExemption.to));
        }
        this.exemptionState = 'update';
        break;
      case 'terms':
        this.termsForm.get('creditLimit').setValue((this.currentTerm.termsHistory.creditlimit).toString());
        this.termsForm.get('terms').setValue((this.currentTerm.termsHistory.id).toString());
        this.termState = 'update';
        break;
      case 'proof':
        this.proofAccountForm.get('Note').setValue(this.proofAccount.note);
        this.proofAccountState = 'update';
        break;
      default:
        break;
    }
  }

  hideForm(value) {
    switch (value) {
      case 'billCycle':
        this.billCycleState = '';
        break;
      case 'exclusion':
        this.exclutionCreate = '';
        break;
      case 'exemption':
        this.exemptionState = '';
        break;
      case 'terms':
        this.termState = '';
        break;
      case 'returns':
        this.billReturnsState = '';
        break;
      case 'proof':
        this.proofAccountState = '';
        break;
      default:
        break;
    }
  }

  selectBillCycle(index) {
    this.currentBillCycle = this.billCyclesAccount[index];
    this.billCycleForm.get('billCycle').setValue((this.currentBillCycle.cycleid).toString());
    this.billCycleForm.get('billCycleStart').setValue(new Date(this.currentBillCycle.from));

    for (let list of this.billCyclesAccount) {
      list.status = false;
    }
    this.billCyclesAccount[index].status = true;
  }

  selectNewBillCycle(index) {
    this.billCycleStatus = 'create';
    for (let list of this.billCyclesAccount) {
      if (this.billCycles[index].id === list.cycleid) {
        this.billCycleStatus = 'update';
      }
    }
  }

  async updateBillCycleForm() {
    if (this.billCycleForm.valid) {
      await this.loading.present();
      const reqBody = this.globService.convertRequestBody({
        'CycleId': this.billCycleForm.get('billCycle').value,
        'From': this.billCycleForm.get('billCycleStart').value,
        'NoDateCheck': false
      });
      this.billService.putBillCycles(this.ContactCode, reqBody).subscribe(async (result: any) => {
        this.hideForm('billCycle');
        await this.getBillOptions();
        await this.loading.dismiss();
      }, async (error: any) => {
        await this.loading.dismiss();
        this.tranService.errorMessage(error);
      });
    }
  }

  async createBillCycleForm() {
    if (this.billCycleForm.valid) {
      await this.loading.present();
      const reqBody = this.globService.convertRequestBody({
        'CycleId': this.billCycleForm.get('billCycle').value,
        'From': this.billCycleForm.get('billCycleStart').value,
        'NoDateCheck': false
      });
      this.billService.putBillCycles(this.ContactCode, reqBody).subscribe(async (result: any) => {
        const convResult = this.globService.ConvertKeysToLowerCase(result);
        this.hideForm('billCycle');
        await this.getBillOptions();
        await this.loading.dismiss();
      }, async (error: any) => {
        await this.loading.dismiss();
        this.tranService.errorMessage(error);
      });
    }
  }

  selectStartBillPeriod(index) {
    this.exEndList = [];
    for (let i = 0; i <= index; i++) {
      this.exEndList.push(this.exStartList[i]);
    }
    this.exclusionForm.get('exclutionEnd').enable();
    this.exclusionForm.get('exclutionEnd').reset();
  }

  selectExclusion(index) {
    this.currentExclution = this.exclusions.billrunexclusionhistory[index];
    this.currentExclution.index = index;
    this.exclusionForm.get('exclutionStart').setValue((this.currentExclution.startperiod).toString());
    this.exclusionForm.get('exclutionEnd').setValue((this.currentExclution.endperiod).toString());
  }

  async triggerExclusionForm() {
    if (this.exclusionForm.valid) {
      await this.loading.present();
      const reqBody = this.globService.convertRequestBody({
        'StartPeriod': parseFloat(this.exclusionForm.get('exclutionStart').value),
        'EndPeriod': parseFloat(this.exclusionForm.get('exclutionEnd').value)
      });
      this.billService.postBillRunExclusions(this.ContactCode, reqBody).subscribe(async (result: any) => {
        this.hideForm('exclusion');
        await this.getBillOptions();
        await this.loading.dismiss();
      }, async (error: any) => {
        await this.loading.dismiss();
        this.tranService.errorMessage(error);
      });
    }
  }

  async triggerExclusionUpdateForm() {
    if (this.exclusionForm.valid) {
      await this.loading.present();
      const reqBody = this.globService.convertRequestBody({
        'StartPeriod': parseFloat(this.exclusionForm.get('exclutionStart').value),
        'EndPeriod': parseFloat(this.exclusionForm.get('exclutionEnd').value)
      });
      this.billService.updateBillRunExclusions(this.ContactCode, this.currentExclution.id, reqBody).subscribe(async (result: any) => {
        await this.getBillOptions();
        this.hideForm('exclusion');
        await this.loading.dismiss();
      }, async (error: any) => {
        await this.loading.dismiss();
        this.tranService.errorMessage(error);
      });
    }
  }

  async deleteExclusion() {
    await this.loading.present();
    this.billService.deleteBillRunExclusions(this.ContactCode, this.currentExclution.id).subscribe(async (result: any) => {
      this.exclusions.billrunexclusionhistory.splice(this.currentExclution.index, 1);
      this.currentExclution = null;
      await this.getBillOptions();
      await this.loading.dismiss();
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  selectExemption(index) {
    this.currentExemption = this.exemptionsList[index];
    this.currentExemption.index = index;
    this.billForm.get('exemptions').setValue((this.currentExemption.id).toString());
  }

  changeExemptionEndTypes() {
    if (this.exemptionEndType === 'end') {
      this.exemptionForm.get('exemptionsEnd').setValidators(Validators.required)
      this.exemptionForm.get('exemptionsEnd').enable();
    } else {
      this.exemptionForm.get('exemptionsEnd').setValidators(Validators.nullValidator)
      this.exemptionForm.get('exemptionsEnd').disable();
    }
  }

  async triggerExemptionCreate() {
    if (this.exemptionForm.valid) {
      const reqBody = {
        'StartPeriod': this.exemptionForm.get('exemptionsStart').value,
        'EndPeriod': ''
      };

      if (this.exemptionEndType === 'end') {
        reqBody.EndPeriod = this.exemptionForm.get('exemptionsEnd').value;
      } else {
        reqBody.EndPeriod = 'On going';
      }
      await this.loading.present();
      this.billService.postTaxExemptions(this.ContactCode, this.globService.convertRequestBody(reqBody)).subscribe(async (result: any) => {
        await this.getBillOptions();
        this.hideForm('exemption');
        await this.loading.dismiss();
      }, async (error: any) => {
        await this.loading.dismiss();
        this.tranService.errorMessage(error);
      });
    }
  }

  async triggerExemptionUpdate() {
    if (this.exemptionForm.valid) {
      await this.loading.present();
      const reqBody = {
        'StartPeriod': this.exemptionForm.get('exemptionsStart').value,
        'EndPeriod': '',
        ContactCode: this.ContactCode,
      };

      if (this.exemptionEndType === 'end') {
        reqBody.EndPeriod = this.exemptionForm.get('exemptionsEnd').value;
      } else {
        reqBody.EndPeriod = 'On going';
      }
      this.billService.updateTaxExemptions(this.currentExemption.id, this.globService.convertRequestBody(reqBody)).subscribe(async (result: any) => {
        await this.getBillOptions();
        this.hideForm('exemption');
        await this.loading.dismiss();
      }, async (error: any) => {
        await this.loading.dismiss();
        this.tranService.errorMessage(error);
      });
    }
  }

  async deleteExemption() {
    await this.loading.present();
    this.billService.deleteTaxExemptions(this.currentExemption.id, this.ContactCode).subscribe(async (result: any) => {
      await this.getBillOptions();
      this.exemptionsList.splice(this.currentExemption.index, 1);
      this.billForm.get('exemptions').reset();
      await this.loading.dismiss();
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  showData() {
  }

  selectTerm(index) {
    const data = {
      creditLimit: this.termsAccountData.creditlimit,
      termsHistory: this.termsAccountData.termsprofileshistory[index]
    }
    this.currentTerm = data;
    this.currentTerm.index = index;
    this.termsForm.get('creditLimit').setValue((this.currentTerm.creditLimit).toString());
    this.termsForm.get('terms').setValue((this.currentTerm.termsHistory.id).toString());
  }

  selectTermOption(index) {
    $('#custom-combo-select span.mat-select-value-text span').text(this.termList[index].name);
    setTimeout(() => {
      $('#custom-combo-select span.mat-select-value-text span').text(this.termList[index].name);
    }, 100);
  }

  async updateTerms() {
    if (this.termsForm.valid) {
      await this.loading.present();
      const reqBody = {
        CreditLimit: this.termsForm.get('creditLimit').value,
        TermsId: this.termsForm.get('terms').value,
      };
      this.billService.putTermsAccount(this.ContactCode, this.globService.convertRequestBody(reqBody)).subscribe(async (result: any) => {
        this.hideForm('terms');
        await this.getBillOptions();
        await this.loading.dismiss();
      }, async (error: any) => {
        await this.loading.dismiss();
        this.tranService.errorMessage(error);
      });
    }
  }

  async updateBillFormat() {
    if (this.billForm.get('billFormart').valid) {
      await this.loading.present();
      const reqBody = {
        'Id': this.billForm.get('billFormart').value
      };
      this.billService.putBillFormats(this.ContactCode, this.globService.convertRequestBody(reqBody)).subscribe(async (result: any) => {
        await this.getBillOptions();
        await this.loading.dismiss();
      }, async (error: any) => {
        await this.loading.dismiss();
        this.tranService.errorMessage(error);
      });
    }
  }

  async updateInvoiceInterval() {
    await this.loading.present();
    const reqBody = {
      'Interval': this.billForm.get('invoiceInterval').value
    };
    this.billService.putInvoiceIntervals(this.ContactCode, this.globService.convertRequestBody(reqBody)).subscribe(async (result: any) => {
      await this.getBillOptions();
      await this.loading.dismiss();
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  async updateCurrency() {
    await this.loading.present();
    const reqBody = {
      'Id': this.billForm.get('currency').value
    };
    this.billService.puttCurrency(this.ContactCode, this.globService.convertRequestBody(reqBody)).subscribe(async (result: any) => {
      await this.getBillOptions();
      await this.loading.dismiss();
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  async updateTax() {
    await this.loading.present();
    const reqBody = {
      'Id': this.billForm.get('taxation').value
    };
    this.billService.putTaxes(this.ContactCode, this.globService.convertRequestBody(reqBody)).subscribe(async (result: any) => {
      this.hideForm('tax');
      await this.getBillOptions();
      await this.loading.dismiss();
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  selectBillReturns(index) {
    this.currentReturns = this.billReturns[index];
    this.currentReturns.index = index;
    this.billReturnsForm.get('id').setValue((this.currentReturns.reasonid).toString());
    // this.billForm.get('returnBill').setValue(this.currentReturns.id);
  }

  async createBillReturn() {
    if (this.billReturnsForm.valid) {
      await this.loading.present();
      const reqBody = {
        ReasonId: this.billReturnsForm.get('id').value,
        // AddressId: 123123,
      }
      this.billService.postBillReturns(this.ContactCode, this.globService.convertRequestBody(reqBody)).subscribe(async (result: any) => {
        this.hideForm('returns');
        await this.getBillOptions();
        await this.loading.dismiss();
      }, async (error: any) => {
        await this.loading.dismiss();
        this.tranService.errorMessage(error);
      });
    }
  }

  async deleteBillReturn() {
    if (this.billReturnsForm.valid) {
      await this.loading.present();
      this.billService.postBillReturns(this.ContactCode, this.currentReturns.id).subscribe(async (result: any) => {
        await this.getBillOptions();
        this.billReturnsForm.reset();
        this.billReturns.splice(this.currentReturns.index, 1);
        await this.loading.dismiss();
      }, async (error: any) => {
        await this.loading.dismiss();
        this.tranService.errorMessage(error);
      });
    }
  }

  async createProofAccount() {
    if (this.proofAccountForm.valid) {
      await this.loading.present();
      const reqBody = {
        Note: this.proofAccountForm.get('Note').value,
      }

      this.billService.postBillProofs(this.ContactCode, this.globService.convertRequestBody(reqBody)).subscribe(async (result: any) => {
        this.hideForm('proof');
        await this.getBillOptions();
        await this.loading.dismiss();
      }, async (error: any) => {
        await this.loading.dismiss();
        this.tranService.errorMessage(error);
      });
    }
  }

  async updateProofAccount() {
    if (this.proofAccountForm.valid) {
      await this.loading.present();
      const reqBody = {
        Note: this.proofAccountForm.get('Note').value,
      }
      this.billService.putBillProofs(this.ContactCode, this.globService.convertRequestBody(reqBody)).subscribe(async (result: any) => {
        // this.hideForm('proof');
        await this.getBillOptions();
        await this.loading.dismiss();
      }, async (error: any) => {
        await this.loading.dismiss();
        this.tranService.errorMessage(error);
      });
    }
  }

  async deleteProofAccount() {
    await this.loading.present();
    this.billService.deleteBillProofs(this.ContactCode).subscribe(async (result: any) => {
      await this.getBillOptions();
      this.proofAccountForm.reset();
      await this.loading.dismiss();
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  convStringToBool(value: string) {
    if (value.toLowerCase().includes('true') || value.toLowerCase().includes('yes')) {
      return true;
    } else {
      return false;
    }
  }

  getUpdateAvailable(value) {

    switch (value) {
      case 'delivery':
        if (this.BillData.P && this.BillData.E) {
          if (this.convStringToBool(this.BillData.P.value) !== this.billForm.get('provBill').value ||
            this.convStringToBool(this.BillData.E.value) !== this.billForm.get('provEmail').value) {
            return true;
          } else {
            return false;
          }
        }
      case 'media':
        if (this.BillData.X) {
          if (this.convStringToBool(this.BillData.X.value) !== this.billForm.get('provEcel').value) {
            return true;
          } else {
            return false;
          }
        }
      case 'billFormart':
        if (this.BillData.BLFM) {
          if (this.BillData.BLFM.key !== this.billForm.get('billFormart').value) {
            return true;
          } else {
            return false;
          }
        }
      default:
        return false;
    }
  }

  async updateDelivery() {
    await this.loading.present();
    const reqBody = {
      Mail: this.billForm.get('provBill').value,
      Email: this.billForm.get('provEmail').value,
    };
    this.billService.putBillDeliveryOptions(this.ContactCode, this.globService.convertRequestBody(reqBody)).subscribe(async (result: any) => {
      await this.getBillOptions();
      await this.loading.dismiss();
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  async updateMedia() {
    await this.loading.present();
    const reqBody = {
      Excel: this.billForm.get('provEcel').value
    };
    this.billService.putBillMediaOptions(this.ContactCode, this.globService.convertRequestBody(reqBody)).subscribe(async (result: any) => {
      await this.getBillOptions();
      await this.loading.dismiss();
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  close() {
    this.BillOptionsComponent.emit('close');
  }

}
