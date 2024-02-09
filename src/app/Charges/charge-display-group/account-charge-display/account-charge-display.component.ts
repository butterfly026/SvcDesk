import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ComponentOutValue } from 'src/app/model';

@Component({
  selector: 'app-account-charge-display',
  templateUrl: './account-charge-display.component.html',
  styleUrls: ['./account-charge-display.component.scss'],
})
export class AccountChargeDisplayComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Output('AccountChargeDisplayComponent') AccountChargeDisplayComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  componentType: string = 'list';
  GroupId: any;

  constructor(
  ) { }

  ngOnInit() { }

  processComponent(event) {
    switch (event?.type) {
      case 'close':
        this.AccountChargeDisplayComponent.emit(event);
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
