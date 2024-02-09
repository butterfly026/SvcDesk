import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GlobalService } from 'src/services/global-service.service';


@Component({
  selector: 'app-service-plan',
  templateUrl: './service-plan.component.html',
  styleUrls: ['./service-plan.component.scss'],
})
export class ServicePlanComponent {

  @Input() ContactCode: string = '';
  @Input() ServiceReference: string = '';
  @Input() planMode: string = '';

  @Output('ServicePlanComponent') public ServicePlanComponent: EventEmitter<string> = new EventEmitter<string>();

  planId: string = '';

  constructor(
    public globService: GlobalService,
  ) { }

  planProcess(event) {
    if (event === 'close') {
      this.ServicePlanComponent.emit('close');
    } else if (event === 'planHistory') {
      this.planMode = 'planHistory';
    } else if (event === 'planUpdate') {
      this.planMode = 'planUpdate';
    } else if (event === 'new') {
      this.planMode = 'planNew';
    } else if (event.includes('planDetail')) {
      this.planId = event.split('&&')[1];
      this.planMode = 'planDetail';
    }
  }
}
