import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ComponentOutValue } from 'src/app/model';

@Component({
  selector: 'app-account-charge-group',
  templateUrl: './account-charge-group.component.html',
  styleUrls: ['./account-charge-group.component.scss'],
})
export class AccountChargeGroupComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Output('AccountChargeGroupComponent') AccountChargeGroupComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  componentType: string = 'list';
  GroupId: any;

  constructor(
  ) { }

  ngOnInit() { }

  processComponent(event) {
    switch (event?.type) {
      case 'close':
        this.AccountChargeGroupComponent.emit(event);
        break;
      case 'create':
        this.componentType = 'add';
        break;
      case 'chargeUpdate':
        this.componentType = 'update';
        this.GroupId = event.data;
        break;
      case 'list':
        this.componentType = 'list';
        break;

      default:
        break;
    }
  }

}
