import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranService } from 'src/services';
import { DatatableAction, Plan, PlanOption, PlanOptionAttributeCharge } from 'src/app/Shared/models';


@Component({
    selector: 'app-accoount-attribute-charging',
    templateUrl: './attribute-charging.component.html',
    styleUrls: ['./attribute-charging.component.scss'],
})
export class AttributeChargingComponent implements OnChanges {

  @Input() planDefinitions: Plan;

  optionsList:  PlanOption[] = [];
  currentOption: number;
  currentOnly: boolean = true;

  csvFileName: string;
  totalCount: number = 0;
  dataSource: PlanOptionAttributeCharge[] = [];
  dataTableAction: DatatableAction = { row: [], toolBar: ['ExportExcel'] };
  columns: string[] = [
    "Id",
    "AttributeCharge",
    "ChargeDefinitionId",
    "Charge",
    "DisplayName",
    "AttributeDefintion1Id",
    "AttributeDefintion1",
    "AttributeDefintion2Id",
    "AttributeDefintion2",
    "AttributeBand",
    "CreatedBy",
    "Created",
    "LastUpdated",
    "UpdatedBy",
  ];
  constructor(
      private tranService: TranService,
  ) {
      this.tranService.translaterService();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.planDefinitions?.currentValue) {
      this.setOptionList();
      this.csvFileName = this.tranService.instant('AccountPlanAttributeCharge') + `_${this.planDefinitions.Name}`;
    }
  }

  selectOption(index: number): void {
    this.dataSource = this.optionsList[index].AttributeCharges;
  }

  private setOptionList(): void {
    if (this.planDefinitions?.Options) {
      this.optionsList = this.planDefinitions.Options;
      this.currentOption = this.optionsList[0].Id;
      this.selectOption(0);
    }
  }
}
