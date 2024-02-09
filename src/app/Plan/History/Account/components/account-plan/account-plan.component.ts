import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-account-plan',
  templateUrl: './account-plan.component.html',
  styleUrls: ['./account-plan.component.scss'],
})
export class AccountPlanComponent {

  @Input() ContactCode: string = '';

  @Input() ServiceReference: string = '';

  @Output('AccountPlanComponent') public PlanComponent: EventEmitter<string> = new EventEmitter<string>();

  
  planMode: string = 'planHistory';

  planId: string = '';

  constructor(
    public globService: GlobalService,
  ) { }

  planProcess(event) {   
    if (event === 'close') {
      this.PlanComponent.emit('close');
    } else if (event === 'planHistory') {
      this.planMode = 'planHistory';
    } else if (event === 'planUpdate') {
      this.planMode = 'planUpdate';
    } else if (event === 'new') {
      this.planMode = 'planNew';
    } else if (event.includes('planDetail')) {
      this.planId = event.split('&&')[1];
      this.ServiceReference=event.split('&&')[2]
      this.planMode = 'planDetail';
    }
  }

}
