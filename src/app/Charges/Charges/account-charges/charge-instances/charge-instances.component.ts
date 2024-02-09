import { Component, Inject,  OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { Paging } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { DatatableAction, PermissionType, SearchOption } from 'src/app/Shared/models';
import { GlobalService } from 'src/services/global-service.service';
import { ChargeInstancesService } from './services/charge-instances.service';
import { ChargeInstanceItem } from '../charges.types';

@Component({
  selector: 'app-charge-instances',
  templateUrl: './charge-instances.component.html',
  styleUrls: ['./charge-instances.component.scss'],
})
export class ChargeInstancesComponent implements OnInit {

  totalCount: number = 0;
  dataSource: ChargeInstanceItem[] = [];
  columns: string[] = [];
  dataTableAction: DatatableAction = { row: [], toolBar: ['ExportExcel'] };
  permissions: PermissionType[] = [];
  searchOptions: SearchOption[] = ['Text'];
  csvFileName: string = '';
  
  private eventParam = new Paging();
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    public globService: GlobalService,
    private loading: LoadingService,
    private chargeService: ChargeInstancesService,
    private tranService: TranService,
    @Inject(MAT_DIALOG_DATA) public data: { ChargeId: string; ChargeDescription: string; Title: string; }
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
    this.csvFileName = 'ChargeInstances' + '_' + this.data.ChargeId;
    this.getChargeList();
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
    await this.loading.present();
    this.chargeService.getChargeInsances(this.eventParam, this.data.ChargeId).subscribe(async (result: any) => {
      await this.loading.dismiss();
      if (result === null) {
        this.tranService.errorMessage('NoChargeInstances');
      } else {
        this.dataSource = result.Items;
        this.totalCount = result.Count; 
      }
    }, async (error: any) => {
      await this.loading.dismiss();

      this.tranService.errorMessage(error);
    });
  }
}
