import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ComponentOutValue } from 'src/app/model';

@Component({
  selector: 'app-account-charge-definition',
  templateUrl: './account-charge-definition.component.html',
  styleUrls: ['./account-charge-definition.component.scss'],
})
export class AccountChargeDefinitionComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Output('AccountChargeDefinitionComponent') AccountChargeDefinitionComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  componentType: string = 'list';
  chargeData: any;
  constructor() { }

  ngOnInit() { }

  processComponent(event) {
    switch (event?.type) {
      case 'close':
        this.AccountChargeDefinitionComponent.emit(event);
        break;
      case 'create':
        this.componentType = 'add';
        break;
      case 'chargeUpdate':
        this.componentType = 'update';
        this.chargeData = event.data;
        break;
      case 'list':
        this.componentType = 'list';
        break;

      default:
        break;
    }
  }

}
