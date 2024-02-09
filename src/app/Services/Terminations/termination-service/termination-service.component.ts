import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { CurrencyMaskConfig, CurrencyMaskInputMode } from 'ngx-currency';
import * as moment from 'moment';

import { ComponentOutValue } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { AlertService } from 'src/services/alert-service.service';
import { GlobalService } from 'src/services/global-service.service';
import { TerminationService } from './services/termination-service.service';
import { PayOutOverride, TerminationConfigurationEvent } from './termination-service.component.type';
//import { debounceTime } from 'rxjs/operators';
//import { Console } from 'console';
//import { CostCentersChildComponent } from 'src/app/Contacts/contacts-cost-centers/cost-centers-child/cost-centers-child.component';

@Component({
  selector: 'app-termination-service',
  templateUrl: './termination-service.component.html',
  styleUrls: ['./termination-service.component.scss'],
})
export class TerminationServiceComponent implements OnInit, OnDestroy {

  @Input() ContactCode: string = '';
  @Input() ServiceReference: string = '';
  @Input() ServiceType: string = '';

  @Output('TerminationServiceComponent') TerminationServiceComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  pageTitle: string = '';

  terminateForm: UntypedFormGroup;

  terminateType: string = 'now';
  reasonList = [
  ];

  //  Advanced options
  CloseNetworkEventsConfiguration: boolean = false;
  CloseOpenNetworkEventsConfiguration: boolean = false;
  CreditBackFutureChargesConfiguration: boolean = false;
  BillFutureChargesImmediatelyConfiguration: boolean = false;
  UnloadFutureUsageConfiguration: boolean = false;

  CloseNetworkEvents: boolean = false;
  CloseOpenNetworkEvents: boolean = false;
  CreditBackFutureCharges: boolean = false;
  BillFutureChargesImmediately: boolean = false;
  UnloadFutureUsage: boolean = false;

  //  Payout calculation
  PayOutOverride: PayOutOverride = {
    Enabled: false,
    Minimum: 0,
    Maximum: 10000,
  }
  calPrice: string = '0';

  //  Payout override
  payoutOverride: boolean = false;
  PayoutOverrideAmount: number = 0;

  //  Unbilled Totals
  UnbilledUsageTransactionTotal: number = 0;
  UnbilledUsageTransactionCount: number = 0;

  //  BulkApply
  BulkApply: string = 'No';

  BulkApplyAccountConfigured: boolean = false;
  BulkApplyChildrenConfigured: boolean = false;
  BulkApplyServiceTypeConfigured: boolean = false;
  BulkApplySiblingsConfigured: boolean = false;

  BulkApplyAccount: boolean = false;
  BulkApplyChildren: boolean = false;
  BulkApplyServiceType: boolean = false;
  BulkApplySiblings: boolean = false;

  expandDetail: boolean = false;
  terminationDate: string = '';
  showForm: boolean = false;
  subList: any[] = [];
  availableCall = true;
  isAvailableConfigurations: boolean = false;

  currencyOptions: CurrencyMaskConfig = {
    align: 'left',
    allowNegative: false,
    decimal: '.',
    precision: 2,
    prefix: '$',
    suffix: '',
    thousands: ',',
    max: 10000,
    allowZero: true,
    nullable: false,
    inputMode: CurrencyMaskInputMode.FINANCIAL,
    min: 0
  }

  constructor(
    private loading: LoadingService,
    private tranService: TranService,

    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService,
    private termService: TerminationService,
    private alertService: AlertService,
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('terminate_service').subscribe(value => {
      this.pageTitle = value;
    });

    this.terminateForm = this.formBuilder.group({
      termDate: [null, Validators.required],
      note: [''],
      termReason: ['', Validators.required],
      PayoutOverrideAmount: [0, Validators.required],
    });
    for (const list of this.reasonList) {
      this.tranService.convertText(list.text).subscribe(value => {
        list.value = value;
      });
    }

    const sub1 = this.globService.globalComponentSubject.subscribe((result: any) => {
      if (result.type === 'serviceReferenceSubject') {
        if (this.ServiceReference === result.data) {
          this.availableCall = true;
        } else {
          this.availableCall = false;
        }
      }
    });

    this.subList.push(sub1);
  }

  ngOnInit() {
    this.calPrice = this.globService.getCurrencyConfiguration(this.calPrice);
    setTimeout(() => {
      this.terminateForm.get('termDate').setValue(new Date());
    }, 500);
    this.terminateForm.get('termDate').valueChanges.subscribe((result: any) => {
      if (result) {
        this.terminationDate = moment(result).format('YYYY-MM-DD');
        if (this.showForm) {
          this.getTerminationsInformation();
        }
      } else {
        this.terminationDate = '';
      }
    });
    this.getPermission();
  }

  // BulkApply
  onBulkApplyItemChange(e) {
    this.BulkApplyAccount = false;
    this.BulkApplyChildren = false;
    this.BulkApplyServiceType = false;
    this.BulkApplySiblings = false;

    if (!e.checked) {
      this.BulkApply = 'No';
    } else if (e.source.name === 'chkBulkApplyAccount') {
      this.BulkApply = 'Account'
      this.BulkApplyAccount = true;
    } else if (e.source.name === 'chkBulkApplyChildren') {
      this.BulkApply = 'Children'
      this.BulkApplyChildren = true;
    } else if (e.source.name === 'chkBulkApplyServiceType') {
      this.BulkApply = 'ServiceType'
      this.BulkApplyServiceType = true;
    } else if (e.source.name === 'chkBulkApplySiblings') {
      this.BulkApply = 'Siblings'
      this.BulkApplySiblings = true;
    };

  }

  ngOnDestroy(): void {
    for (const list of this.subList) {
      list.unsubscribe();
    }
  }

  get f(): {[key: string]: AbstractControl<any, any>}{
    return this.terminateForm.controls;
  }

  async getTerminationsConfigurations() {
    try {
      const result = await this.termService.getTerminationsConfigurations(this.ServiceType).toPromise();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      if (convResult) {
        this.isAvailableConfigurations = true;
      } else {
        this.isAvailableConfigurations = false;
      }
    } catch (error) {
      this.tranService.errorMessage(error);
    }
  }

  async getPermission() {
    this.showForm = false;
    await this.loading.present();
    this.globService.getAuthorization('/Services/Terminations').subscribe(async (_result) => {
      await this.loading.dismiss();
      this.showForm = true;
      await this.getTerminationsConfigurations();
      this.getTerminationReasons();
      this.getTerminationServiceReference();
      if (this.terminateForm.get('termDate').valid) {
        this.getTerminationsInformation();
      }
      // Payout override
      this.globService.getAuthorization('/Services/Terminations/Payout/Override').subscribe(async (_result) => {
        this.payoutOverride = true;
      }, async (err) => {
        this.payoutOverride = false;
      });
    }, async (err) => {
      await this.loading.dismiss();
      const errResult = this.globService.ConvertKeysToLowerCase(err);
      if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
        this.tranService.errorMessage('You do not have permission for this feature. Please contact your Administrator');
        this.alertService.closeAllAlerts();
        this.showForm = false;
        setTimeout(() => {
          this.goBack();
        }, 1000);
      } else {
        this.showForm = true;
      }
    });
  }

  async getTerminationReasons() {
    await this.loading.present();
    this.termService.getTerminationReasons().subscribe(async (result: any) => {
      await this.loading.dismiss();
      this.reasonList = this.globService.ConvertKeysToLowerCase(result);
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  async getTerminationServiceReference() {
    await this.loading.present();
    this.termService.getTerminationServiceReference(this.ServiceReference).subscribe(async (result: any) => {
      await this.loading.dismiss();
      if (result === null) {

      } else {
        const convResult = this.globService.ConvertKeysToLowerCase(result);
        this.terminateForm.get('termDate').setValue(convResult.terminationdatetime);
        this.terminateForm.get('note').setValue(convResult.note);
        this.terminateForm.get('termReason').setValue(convResult.terminationreasonid);
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  refreshPayout() {
    if (this.expandDetail) {
      this.expandDetail = false;
    };
    this.goDetail();
  }

  submitTermination() {
    if (this.terminateForm.valid) {
      this.postTermination();
    }
  }

  goDetail() {
    // this.TerminationServiceComponent.emit('terminationDetail');
    this.expandDetail = true;
  }

  async getUnBilledUsageTransactionsTotals(){
    await this.loading.dismiss();
    this.termService.getUnbilledUsageTransactionTotals(this.ServiceReference).subscribe(async (result: any) => {
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.UnbilledUsageTransactionTotal = convResult.total;
      this.UnbilledUsageTransactionCount = convResult.count;
    console.log(convResult);
    }, async (err: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(err);
    });
  }

  async getTerminationsInformation() {
    await this.loading.dismiss();
    this.termService.getTerminationsInformation(this.ServiceReference, this.terminationDate).subscribe(async (result: any) => {
      await this.loading.dismiss();
      switch (result.ServiceConnectionStatus) {
        case 'Available for termination':
          break;
        case 'Not Connected':
          this.tranService.errorMessage('Service not connected');
          setTimeout(() => {
            this.goBack();
          }, 3000);
          break;
        case 'Already terminated':
          this.tranService.errorMessage('Service already terminated');
          setTimeout(() => {
            this.goBack();
          }, 3000);
          break;
        case 'Future termination':
          this.tranService.errorMessage('Service already scheduled for termination');
          break;
        default: break;
      }
      if (result.Configuration && this.isAvailableConfigurations) {
        this.BulkApplyAccountConfigured = result.Configuration.BulkApplyOptions.ApplyAll.Enabled;
        this.BulkApplyChildrenConfigured = result.Configuration.BulkApplyOptions.ApplyChildren.Enabled;
        this.BulkApplyServiceTypeConfigured = result.Configuration.BulkApplyOptions.ApplySameServiceType.Enabled;
        this.BulkApplySiblingsConfigured = result.Configuration.BulkApplyOptions.ApplySiblings.Enabled;

        this.BillFutureChargesImmediatelyConfiguration = result.Configuration.ChargeOptions.BillFutureCharges.Enabled;
        this.UnloadFutureUsageConfiguration = result.Configuration.ChargeOptions.UnloadFutureUsage.Enabled;
        this.CreditBackFutureChargesConfiguration = result.Configuration.ChargeOptions.CreditBackFutureCharges.Enabled;
        this.CloseNetworkEventsConfiguration = result.Configuration.NetworkOptions.CloseNetworkEvent.Enabled;
        this.CloseOpenNetworkEventsConfiguration = result.Configuration.NetworkOptions.CancelOpenEvents.Enabled;

        this.BulkApplyAccount = result.Configuration.BulkApplyOptions.ApplyAll.Default;
        this.BulkApplyChildren = result.Configuration.BulkApplyOptions.ApplyChildren.Default;
        this.BulkApplyServiceType = result.Configuration.BulkApplyOptions.ApplySameServiceType.Default;
        this.BulkApplySiblings = result.Configuration.BulkApplyOptions.ApplySiblings.Default;

        this.BillFutureChargesImmediately = result.Configuration.ChargeOptions.BillFutureCharges.Default;
        this.UnloadFutureUsage = result.Configuration.ChargeOptions.UnloadFutureUsage.Default;
        this.CreditBackFutureCharges = result.Configuration.ChargeOptions.CreditBackFutureCharges.Default;
        this.CloseNetworkEvents = result.Configuration.NetworkOptions.CloseNetworkEvent.Default;
        this.CloseOpenNetworkEvents = result.Configuration.NetworkOptions.CancelOpenEvents.Default;

        this.currencyOptions.max = result.Configuration.PayOutOverride.Maximum;
        this.currencyOptions.min = result.Configuration.PayOutOverride.Minimum;
      }
    }, async (err: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(err);
    });

    //this.getUnBilledUsageTransactionsTotals();

  }

  selectReason(index) {

  }

  formatCurrency() {
    this.PayoutOverrideAmount = parseFloat(this.PayoutOverrideAmount.toFixed(2));
    //this.myAmount = this.myAmount.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
  }

  goBack() {
    this.TerminationServiceComponent.emit({ type: 'close' });
  }

  processTerminations(event) {
    if (event.type === 'terminationService') {
      this.expandDetail = false;
    } else if (event.type === 'close') {
      this.goBack();
    }
  }

  hideDetail() {
    this.expandDetail = false;
  }

  async postTermination() {
    const reqBody = {
      BulkApply: this.BulkApply,
      //PlanId: 0,
      //OptionId: 0,
      TerminationReasonId: this.terminateForm.get('termReason').value,
      TerminationDateTime: this.terminateForm.get('termDate').value,
      Note: this.terminateForm.get('note').value,
      TerminationPenalty: this.PayoutOverrideAmount,
      SetTermination: true,
      CreditFutureCharges: this.CreditBackFutureCharges,
      InvoiceFutureChargesNow: this.BillFutureChargesImmediately,
      UnloadFutureUsage: this.UnloadFutureUsage,
      EventTriggers: true,
      CancelEvents: this.CloseNetworkEvents,
      IgnoreErrors: true,
      Reschedule: true,
      PreviousTerminationEventId: 0
    };

    console.log(reqBody);
    //await this.loading.present();
    //this.termService.postTermination(this.ServiceReference, reqBody).subscribe(async (result: any) => {
    //await this.loading.dismiss();
    //}, async (error: any) => {
    //await this.loading.dismiss();
    //this.tranService.errorMessage(error);
    //});
  }

}
