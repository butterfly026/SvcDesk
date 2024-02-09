import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ComponentOutValue } from 'src/app/model';

@Component({
  selector: 'app-account-task-priorities',
  templateUrl: './account-task-priorities.component.html',
  styleUrls: ['./account-task-priorities.component.scss'],
})
export class AccountTaskPrioritiesComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Output('AccountTaskPrioritiesComponent') AccountTaskPrioritiesComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  componentType: string = 'list';
  ID: any;

  constructor(
  ) { }

  ngOnInit() { }

  processComponent(event) {
    switch (event?.type) {
      case 'close':
        this.AccountTaskPrioritiesComponent.emit(event);
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
