import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-service-add-cost-center',
  templateUrl: './service-add-cost-center.component.html',
  styleUrls: ['./service-add-cost-center.component.scss'],
})
export class ServiceAddCostCenterComponent implements OnInit {

  @Input() CostCenterList: any[] = [];
  @Output('ServiceAddCostCenterComponent') ServiceAddCostCenterComponent: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() { }

}
