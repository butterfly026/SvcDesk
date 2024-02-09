import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ComponentOutValue } from 'src/app/model';

@Component({
  selector: 'app-bill-delegation-account',
  templateUrl: './bill-delegation.component.html',
  styleUrls: ['./bill-delegation.component.scss'],
})
export class BillDelegationComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Input() delegationState: string = '';
  @Input() DelegationId: string = '';

  @Output('BillDelegationComponent') BillDelegationComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();


  pagingParam: any = {
    pageRowNumber: 1,
    rowStep: '10',
    SkipRecords: 0,
  };


  constructor(

  ) { }

  ngOnInit() { }

  processEvent(event: ComponentOutValue) {
    switch (event?.type) {
      case 'go-back':
        this.BillDelegationComponent.emit({ type: 'close' });
        break;
      case 'close':
        this.delegationState = 'list';
        break;
      case 'new':
        this.delegationState = 'new';
        break;
      case 'delegationDetail':
        this.delegationState = 'detail';
        this.DelegationId = event.data.DelegationId;
        break;

      default:
        break;
    }
  }

}
