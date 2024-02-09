import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ComponentOutValue } from '../model';

@Component({
  selector: 'app-deposit-status-reasons',
  templateUrl: './deposit-status-reasons.component.html',
  styleUrls: ['./deposit-status-reasons.component.scss'],
})
export class DepositStatusReasonsComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Output('DepositStatusReasonsComponent') DepositStatusReasonsComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  componentType: string = 'list';
  ID: any;

  constructor(
  ) { }

  ngOnInit() { }

  processComponent(event) {
    switch (event?.type) {
      case 'close':
        this.DepositStatusReasonsComponent.emit(event);
        break;
      case 'create':
        this.componentType = 'add';
        break;
      case 'update':
        this.componentType = 'update';
        this.ID = event.data;
        break;
      case 'list':
        this.componentType = 'list';
        break;

      default:
        break;
    }
  }

}
