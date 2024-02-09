import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranService } from 'src/services';

import { DatatableAction, Plan, PlanOption, PlanOptionCharge } from 'src/app/Shared/models';

@Component({
  selector: 'app-account-plan-charges',
  templateUrl: './charges.component.html',
  styleUrls: ['./charges.component.scss'],
})
export class ChargesComponent implements OnChanges {

  @Input() planDefinitions: Plan;

  optionsList:  PlanOption[] = [];
  currentOption: number;
  currentOnly: boolean = true;

  csvFileName: string;
  totalCount: number = 0;
  dataSource: PlanOptionCharge[] = [];
  dataTableAction: DatatableAction = { row: [], toolBar: ['ExportExcel']};
  columns: string[] = [
    'Id', 
    'ChargeDefinitionId', 
    'Name', 
    'From', 
    'To', 
    'Price', 
    'Frequency', 
    'Prorated', 
    'AutoApplied', 
    'ChargeInAdvance', 
    'AdvancePeriods', 
    'DelayMonths', 
    'RoundStartInterval', 
    'StartInterval', 
    'RoundEndInterval', 
    'EndInterval', 
    'IntervalUnit'
  ];

  private selectedPlanOptionChargeIndex: number = 0;

  constructor(
    private tranService: TranService,
  ) {
    this.tranService.translaterService();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.planDefinitions?.currentValue) {
      this.csvFileName = this.tranService.instant('AccountPlanCharges') + `_${this.planDefinitions.Name}`;
      this.setOptionList();
    }
  }

  changeCurrentOnly(): void {
    this.dataSource = this.optionsList[this.selectedPlanOptionChargeIndex].Charges
      .filter( s => 
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
