import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ComponentOutValue } from 'src/app/model';

@Component({
  selector: 'app-task-configuration-resolutions',
  templateUrl: './resolutions.component.html',
  styleUrls: ['./resolutions.component.scss'],
})
export class ResolutionsComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Output('ResolutionsComponent') ResolutionsComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  componentType: string = 'list';
  ID: any;

  constructor(
  ) { }

  ngOnInit() { }

  processComponent(event) {
    switch (event?.type) {
      case 'close':
        this.ResolutionsComponent.emit(event);
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
