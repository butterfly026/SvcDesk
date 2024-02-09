import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { ComponentOutValue, Paging } from 'src/app/model';
import { TranService, LoadingService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { ChargeListService } from './services/charge-list.service';
import { DatatableAction, SearchOption } from 'src/app/Shared/models';
import { ChargeInstance } from './charge-list.component.type';

@Component({
  selector: 'app-charge-list',
  templateUrl: './charge-list.component.html',
  styleUrls: ['./charge-list.component.scss'],
})
export class ChargeListComponent implements OnChanges, OnDestroy {
  @Input() FinancialId: string = '';
  @Input() ContactCode: string = '';
  @Input() ComponentType: string = '';
  @Output('ChargeListComponent') ChargeListComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  totalCount: number = 0;
  dataSource: ChargeInstance[] = [];
  dataTableAction: DatatableAction = { row: [], toolBar: ['Refresh', 'ExportExcel'] };
  csvFileName: string;
  searchOptions: SearchOption[] = ['Text'];
  columns: string[] = [
    'Id',
    'ProfileId',
    'Code',
    'Description',
    'From',
    'To',
    'PriceTaxEx',
    'PriceTaxInc',
    'UndiscountedPriceTaxEx',
    'UndiscountedPriceTaxInc',
    'Frequency',
    'FrequencyId',
    'DefinitionFrequencyId',
    'Prorated',
    'ChargeInAdvance',
    'AdvancePeriods',
    'Cost',
  ];
  
  private eventParam = new Paging();
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private loading: LoadingService,
    private chargeService: ChargeListService,
    private tranService: TranService,
    public globService: GlobalService,
    public dialog: MatDialog,
  ) {
    this.tranService.translaterService();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.FinancialId?.currentValue) {
      this.csvFileName = this.tranService.instant('FinancialTransactionsChargeList') + ' ' + this.FinancialId;
      this.getChargesList();
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
    await this.loading.present();
    this.getChargesList();
  }

  private async getChargesList(): Promise<void> {
    this.chargeService.FinancialChargeList(this.FinancialId, this.eventParam)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result) =>{
          await this.loading.dismiss();
          if (result === null) {
            this.tranService.errorMessage('no_charges');
          } else {
            this.totalCount = result.Count;
            this.dataSource = result.Items;
          }
        },
        error: async (error: any) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      })
  }
}
