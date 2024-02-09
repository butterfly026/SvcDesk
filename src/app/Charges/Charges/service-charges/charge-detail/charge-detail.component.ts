import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { LoadingService, ToastService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { ChargeDetailService } from './services/charge-detail.service';
import { ChargeInstanceItem } from '../../account-charges/charges.types';
import { DatatableAction, PermissionType, SearchOption } from 'src/app/Shared/models';
import { Paging } from 'src/app/model';
import { Subject } from 'rxjs';
import { SpinnerService } from 'src/app/Shared/services';

@Component({
  selector: 'app-charge-detail',
  templateUrl: './charge-detail.component.html',
  styleUrls: ['./charge-detail.component.scss'],
})
export class ChargeDetailComponent implements OnInit {
  @Input() ChargeId: string = '';
  @Input() ChargeDescription: string = '';  
  @Input() Refresh: Boolean = true;
  @Output('ChargeDetailComponent') ChargeDetailComponent: EventEmitter<string> = new EventEmitter<string>();

  totalCount: number = 0;
  dataSource: ChargeInstanceItem[] = [];
  columns: string[] = [];
  dataTableAction: DatatableAction = { row: [], toolBar: ['ExportExcel'] };
  _showSearchOption: boolean = false;
  permissions: PermissionType[] = [];
  searchOptions: SearchOption[] = ['Text'];

  eventParam = new Paging();

  private unsubscribeAll$: Subject<any> = new Subject<any>();
  private Refresh_: Boolean = true;
  csvFileName: string = '';

  constructor(
    private spinnerService: SpinnerService,
    private chargeService: ChargeDetailService,
    private tranService: TranService,
    public globService: GlobalService
  ) {

    this.tranService.translaterService();
    this.configInitialValues();
  }
  private configInitialValues(): void {
    this.columns = [
      'Id',
      'ProfileId',
      'DefinitionId',
      'Description',
      'OverrideDescription',
      'Period',
      'BillingCycleId',
      'BillingCycle',
      'From',
      'To',
      'PriceTaxEx',
      'PriceTaxInc',
      'UndiscountedPriceTaxEx',
      'UndiscountedPriceTaxInc',
      'Plan',
      'PlanOption',
      'PlanId',
      'PlanOptionId',
      'Frequency',
      'FrequencyId',
      'DefinitionFrequencyId',
      'Prorated',
      'ChargeInAdvance',
      'AdvancePeriods',
      'FinancialDocument',
      'Reversal',
      'Cost',
      'RevenueAccount',
      'OverrideId',
      'ExternalTableName',
      'ExternalTransactionId',
      'Created',
      'CreatedBy',
      'LastUpdated',
      'UpdatedBy',
    ];
  }
  ngOnInit(): void {
    this.csvFileName = 'Charge Instances - ' + this.ChargeId;
    this.getChargeList();
  }

  ngOnChanges(): void {
    if (this.Refresh !== undefined && this.Refresh !== this.Refresh_) {
      this.getChargeList()
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  fetchData(event: Paging): void {
    this.eventParam = {
      CountRecords: 'Y',
      ...event
    }
    this.getChargeList();
  }


  async getChargeList() {
    this.dataSource = [];
    await this.spinnerService.loading();
    this.chargeService.getChargeDetail(this.eventParam, this.ChargeId).subscribe(async (result: any) => {
      const convResult = this.globService.ConvertKeysToLowerCase(result);

      await this.spinnerService.end();
      if (result === null) {
        this.tranService.errorMessage('no_charges');
      } else {
        this.dataSource = result.Items;
        this.totalCount = result.Count; 
      }
    }, async (error: any) => {
      await this.spinnerService.end();

      this.tranService.errorMessage(error);
    });
  }


  goBack() {
    this.ChargeDetailComponent.emit('list');
  }

}
