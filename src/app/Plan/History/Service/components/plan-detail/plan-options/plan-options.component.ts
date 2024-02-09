import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Plan } from 'src/app/Shared/models';


@Component({
  selector: 'app-service-plan-options',
  templateUrl: './plan-options.component.html',
  styleUrls: ['./plan-options.component.scss'],
})
export class PlanOptionsComponent implements OnChanges {

  @Input() planDefinitions: Plan;

  public data = [];
  private labels = [
    'Id', 
    'Name', 
    'Default', 
    'Order',
    'AdditionalInformation1', 
    'AdditionalInformation2',
    'AdditionalInformation3', 
    'AdditionalInformation4',
    'ContractId', 
    'Contract', 
    'MinimumScore',
    'ContractAction',
    'CreatedBy', 
    'Created',
    'LastUpdated', 
    'UpdatedBy',
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.planDefinitions?.currentValue) {
      this.data = this.planDefinitions.Options.map(option =>
        this.labels.map(key => ({
          name: key,
          value: Array.isArray(option[key])
            ? option[key].reduce((prev, curr) => (prev + curr.Name + ', '), '')
            : option[key]
        }))
      );
    }
  }
}
