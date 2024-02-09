import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ComponentOutValue } from 'src/app/model';

@Component({
  selector: 'app-account-task-group',
  templateUrl: './account-task-group.component.html',
  styleUrls: ['./account-task-group.component.scss'],
})
export class AccountTaskGroupComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Output('AccountTaskGroupComponent') AccountTaskGroupComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  componentType: string = 'list';
  ID: any;

  constructor(
  ) { }

  ngOnInit() { }

  processComponent(event) {
    switch (event?.type) {
      case 'close':
        this.AccountTaskGroupComponent.emit(event);
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
