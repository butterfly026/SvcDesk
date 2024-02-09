import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Plan } from 'src/app/Shared/models';

@Component({
    selector: 'app-account-general-plan',
    templateUrl: './general-plan.component.html',
    styleUrls: ['./general-plan.component.scss'],
})
export class GeneralPlanComponent implements OnChanges {

    @Input() private planDefinitions: Plan;

    public data: { name: string; value: string }[] = [];
    private labels: Array<string> = [
        'Id', 
        'Name', 
        'DisplayName', 
        'GroupId', 
        'Group',
        'TypeId', 
        'Type', 
        'TypeDefault', 
        'ContractId',
        'Contract', 
        'TransactionPlanId', 
        'TransactionPlan',
        'From', 
        'To', 
        'BillingInterval', 
        'Availability', 
        'Comment',
        'Requestor', 
        'URL', 
        'SalesRank', 
        'ValueRank',
        'AdditionalInformation1', 
        'AdditionalInformation2',
        'AdditionalInformation3', 
        'AdditionalInformation4',
        'CycleLocked', 
        'CreatedBy', 
        'Created', 
        'UpdatedBy', 
        'LastUpdated',
        'ParentPlan', 
        'ChildPlan', 
        'ServiceTypes'
    ];

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.planDefinitions?.currentValue) {
            this.data = this.labels.map(key => ({
                name: key,
                value: Array.isArray(this.planDefinitions[key]) 
                    ? this.planDefinitions[key].reduce((prev, curr) => (prev + curr.Name + ', '), '')
                    : this.planDefinitions[key]
            }))
        }
    }
}
