import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-commission-management',
  templateUrl: './commission-management.component.html',
  styleUrls: ['./commission-management.component.scss'],
})
export class CommissionManagementComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Input() ComponentType: string = '';
  @Input() DetailData: any;
  @Output('CommissionManagementComponent') CommissionManagementComponent: EventEmitter<string> = new EventEmitter<string>();

  currentComponent: string = 'list';

  constructor(

  ) { }

  ngOnInit() { }

  processComponent(event: any) {
    
    switch (event.type) {
      case 'close':
        this.CommissionManagementComponent.emit('close');
        break;

      default:
        this.currentComponent = event.type;
        this.DetailData = event.data;
        break;
    }
  }

  processDetail(event: any) {
    
    switch (event.type) {
      case 'close':
        this.currentComponent = 'list';
        break;

      default:
        break;
    }
  }

}
