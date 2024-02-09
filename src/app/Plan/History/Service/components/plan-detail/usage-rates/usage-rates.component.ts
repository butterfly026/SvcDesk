import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Paging } from "src/app/model";
import { TranService } from "src/services";
import { SpinnerService } from "src/app/Shared/services";
import { DatatableAction, Plan, SearchOption, TransactionPlanVersion, TransactionRate } from "src/app/Shared/models";
import { ServicePlanService } from "../../../services";

@Component({
  selector: "app-service-usage-rates",
  templateUrl: "./usage-rates.component.html",
  styleUrls: ["./usage-rates.component.scss"],
})
export class UsageRatesComponent implements OnChanges, OnDestroy {
  @Input() planDefinitions: Plan;

  transactionPlanVersions: TransactionPlanVersion[] = [];
  selectedTransactionPlanVersionId: number;

  totalCount: number = 0;
  dataSource: TransactionRate[] = [];
  dataTableAction: DatatableAction = { row: [], toolBar: ['Refresh', 'ExportExcel'] };
  csvFileName: string;
  searchOptions: SearchOption[] = [];
  columns: string[] = [
    'TariffClassId',
    'TariffClass',
    'TariffGroupId',
    'TariffGroup',
    'TimeBandId',
    'TimeBand',
    'ConnectPrice',
    'Band1',
    'Band2',
    'Band3',
    'Band4',
    'UseFinalBand',
    'MinimumPrice',
    'MinimumDuration',
    'Capping',
    'CapAmount',
    'CapDuration',
    'CapType',
    'TariffNumber',
    'UnitId',
    'Unit',
    'LastUpdated',
    'UpdatedBy',
  ];

  private eventParam = new Paging();
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private spinnerService: SpinnerService,
    private tranService: TranService,
    private planDetail: ServicePlanService,
  ) {
    this.tranService.translaterService();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.planDefinitions?.currentValue) {
      this.getEffectList();
      if (this.selectedTransactionPlanVersionId !== undefined) {
        this.spinnerService.loading();
        this.getUsageRates();
      }
      this.csvFileName = this.tranService.instant("ServicePlanUsageRates") + " " + this.planDefinitions.Id;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  selectTransactionPlanVersion(): void {
    this.spinnerService.loading();
    this.getUsageRates();
  }

  async fetchData(event: Paging): Promise<void> {
    this.eventParam = {
      CountRecords: "Y",
      ...event,
    };
    this.spinnerService.loading();
    this.getUsageRates();
  }

  private getEffectList() {
    this.transactionPlanVersions = this.planDefinitions.TransactionPlanVersions;

    if (this.transactionPlanVersions.length > 0) {
      this.selectedTransactionPlanVersionId = this.transactionPlanVersions[0].Id;
    }
  }

  private async getUsageRates(): Promise<void> {
    this.planDetail
      .getPlansTransactionRates(this.eventParam, this.selectedTransactionPlanVersionId)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result) => {
          this.spinnerService.end();
          if (result === null) {
            this.tranService.errorMessage("no_events");
          } else {
            this.totalCount = result.Count;
            this.dataSource = result.Items;
          }
        },
        error: async (error: any) => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        },
      });
  }
}
