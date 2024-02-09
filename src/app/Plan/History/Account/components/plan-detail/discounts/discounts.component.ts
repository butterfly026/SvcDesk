import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranService } from 'src/services';
import { DatatableAction, Plan, PlanOption, PlanOptionDiscount } from 'src/app/Shared/models';


@Component({
  selector: 'app-account-plan-discounts',
  templateUrl: './discounts.component.html',
  styleUrls: ['./discounts.component.scss'],
})
export class DiscountsComponent implements OnChanges {
  @Input() planDefinitions: Plan;

  optionsList:  PlanOption[] = [];
  currentOption: number;
  currentOnly: boolean = true;

  csvFileName: string;
  totalCount: number = 0;
  dataSource: PlanOptionDiscount[] = [];
  dataTableAction: DatatableAction = { row: [], toolBar: ['ExportExcel'] };
  columns: string[] = [
    'Id',
    'DiscountId',
    'Discount',
    'DiscountLongDescription',
    'DiscountShortDescription',
    'From',
    'To',
    'AutoApplied',
    'Used',
    'CreatedBy',
    'Created',
    'LastUpdated',
    'UpdatedBy',
  ];

  private selectedPlanOptionChargeIndex: number = 0;

  constructor(
    private tranService: TranService,
  ) {
    this.tranService.translaterService();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.planDefinitions?.currentValue) {
      this.setOptionList();
      this.csvFileName = this.tranService.instant('AccountPlanDiscounts') + `_${this.planDefinitions.Name}`;
    }
  }

  changeCurrentOnly(): void {
    this.dataSource = this.optionsList[this.selectedPlanOptionChargeIndex].Discounts.filter( s => 
      this.currentOnly 
        ? s.To.toString().toLowerCase().includes('going') || new Date().getTime() < new Date(s.To).getTime()  
        : true 
    );
  }

  selectOption(index: number): void {
    this.selectedPlanOptionChargeIndex = index;
    this.changeCurrentOnly();
  }

  private setOptionList(): void {
    if (this.planDefinitions?.Options) {
      this.optionsList = this.planDefinitions.Options;
      this.currentOption = this.optionsList[0].Id;
      this.selectOption(0);
    }
  }

}
