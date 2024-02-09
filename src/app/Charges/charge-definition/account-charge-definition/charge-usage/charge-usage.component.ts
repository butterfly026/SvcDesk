import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ComponentOutValue } from 'src/app/model';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-charge-usage',
  templateUrl: './charge-usage.component.html',
  styleUrls: ['./charge-usage.component.scss'],
})
export class ChargeUsageComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Input() ChargeDefinitionData: any;
  @Input() UsageData: any;
  @Output('ChargeUsageComponent') ChargeUsageComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  componentType: string = 'list';
  usageData: any;

  chargeData: any;
  listType: string = '';

  currentList = [];

  constructor(
    public globService: GlobalService,
  ) { }

  ngOnInit() { }

  processComponent(event: ComponentOutValue) {
    
    switch (event.type) {
      case 'close':
        this.ChargeUsageComponent.emit(event);
        break;
      case 'add':
        this.componentType = 'add';
      case 'update':
        this.componentType = 'update';
        this.usageData = event.data;
        break;
      case 'list':
        this.componentType = 'list';
        break;
      case 'available':
        this.ChargeUsageComponent.emit(event);
        break;
      case 'updateData':
        this.componentType = 'list';
        this.listType = 'updateData';
        this.chargeData = event.data;
        break;
      case 'addData':
        this.componentType = 'list';
        this.listType = 'addData';
        this.chargeData = event.data;
        break;
      case 'gridList':
        this.currentList = event.data;
        break;
      default:
        break;
    }
    this.globService.chargeDefinitionSubject.next(event);
  }

}
