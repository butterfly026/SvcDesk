import { Component, EventEmitter, Input,  Output, SimpleChanges, ViewChild, OnChanges, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Paging } from 'src/app/model';
import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { SpinnerService } from 'src/app/Shared/services';
import { DatatableAction, SearchOption } from 'src/app/Shared/models';
import { ChargeInstance } from './bill-charges.component.type';
import { BillChargesService } from './services/bill-charges-service';

@Component({
  selector: 'app-bill-charges',
  templateUrl: './bill-charges.component.html',
  styleUrls: ['./bill-charges.component.scss'],
})
export class BillChargesComponent implements OnChanges, OnDestroy {
  @Input() ContactCode: string = '';
  @Input() BillId: string = '';
  @Output('BillCharges') BillCharges: EventEmitter<string> = new EventEmitter<string>();

  totalCount: number = 0;
  dataSource: ChargeInstance[] = [];
  dataTableAction: DatatableAction = { row: [], toolBar: ['Refresh', 'ExportExcel'] };
  csvFileName: string;
  searchOptions: SearchOption[] = ['Text'];
  columnsUsedForCurrency: string[] = ['UndiscountedPriceTaxInc', 'UndiscountedPriceTaxEx', 'PriceTaxInc', 'PriceTaxEx', ];
  columns: string[] = [
    'Id',
    'ServiceId',
    'Code',
    'Description',
    'PriceTaxInc',
    'PriceTaxEx',
    'To',
    'From',
    'Period',
    'Plan',
    'PlanOption',
    'Frequency',
    'Prorated',
    'AdvancePeriods',
    'ChargeInAdvance',
    'OverrideId',
    'PlanId',
    'PlanOptionId',
    'UndiscountedPriceTaxInc',
    'UndiscountedPriceTaxEx',
    'FinancialDocument',
    'Cost',
    'ProfileId',
    'DefinitionFrequencyId',
    'FrequencyId',
    'ServiceReference',
    'ServiceType',
    'RevenueAccount',
    'ExternalTransactionId',
    'ExternalTableName',
    'Created',
    'CreatedBy'
  ];

  private eventParam = new Paging();
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private spinnerService: SpinnerService,
    private chargeService: BillChargesService,
    private tranService: TranService,
    public globService: GlobalService,
    public dialog: MatDialog,
  ) {
    this.tranService.translaterService();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.BillId?.currentValue) {
      this.csvFileName = this.tranService.instant('BillCharges') + ' ' + this.BillId;
      this.spinnerService.loading();
      this.getServicesList();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  async fetchData(event: Paging): Promise<void> {
    this.eventParam = {
      CountRecords: 'Y',
      ...event
    }
    this.spinnerService.loading();
    this.getServicesList();
  }

  private async getServicesList(): Promise<void> {
    this.chargeService.getChargeList(this.eventParam, this.BillId)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result) =>{
          this.spinnerService.end();
          if (result === null) {
            this.tranService.errorMessage('NoBillCharges');
          } else {
            this.totalCount = result.Count;
            this.dataSource = result.Items;
          }
        },
        error: async (error: any) => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      })
  }

}
