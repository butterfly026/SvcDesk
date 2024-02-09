import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-service-add-charge',
  templateUrl: './service-add-charge.component.html',
  styleUrls: ['./service-add-charge.component.scss'],
})
export class ServiceAddChargeComponent implements OnInit {

  @Input() ChargeList: any[] = [];
  @Output('ServiceAddChargeComponent') ServiceAddChargeComponent: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() { }

}
