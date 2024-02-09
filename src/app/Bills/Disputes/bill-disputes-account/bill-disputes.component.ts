import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ComponentOutValue } from 'src/app/model';

@Component({
  selector: 'app-bill-disputes-account',
  templateUrl: './bill-disputes.component.html',
  styleUrls: ['./bill-disputes.component.scss'],
})
export class BillDisputesComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Input() disputeState: string = 'list';
  @Input() disputeId: string = 'list';
  @Output('BillDisputesComponent') BillDisputesComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  pagingParam: any = {
    pageRowNumber: 1,
    rowStep: '10',
    SkipRecords: 0,
  };

  constructor(

  ) { }

  ngOnInit() {
  }

  processEvent(event) {

    switch (event?.type) {
      case 'go-back':
        this.BillDisputesComponent.emit({ type: 'close' });
        break;
      case 'new':
        this.disputeState = 'new';
        break;
      case 'close':
        this.disputeState = 'list';
        this.pagingParam.pageRowNumber = 1;
        this.pagingParam.rowStep = '10';
        this.pagingParam.SkipRecords = 0;
        break;
      case 'disputeDetail':
        this.disputeId = event?.data.Id;
        this.disputeState = 'detail';
        this.pagingParam.pageRowNumber = event?.data.pageRowNumber;
        this.pagingParam.rowStep = event?.data.rowStep;
        this.pagingParam.SkipRecords = event?.data.SkipRecords;
        break;

      default:
        break;
    }
  }

}
