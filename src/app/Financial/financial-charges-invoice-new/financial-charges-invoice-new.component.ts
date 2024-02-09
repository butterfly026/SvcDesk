import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ComponentOutValue } from 'src/app/model';

@Component({
  selector: 'app-financial-charges-invoice-new',
  templateUrl: './financial-charges-invoice-new.component.html',
  styleUrls: ['./financial-charges-invoice-new.component.scss'],
})
export class FinancialChargesInvoiceNewComponent implements OnInit {
  @Input() FinancialId: string = '';
  @Input() ContactCode: string = '';
  @Input() ChargeType: string = '';
  @Input() ComponentType: string = '';
  @Output('FinancialChargesComponent') FinancialChargesComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  chargeMode: string = 'list';
  ChargeId: string = '';

  constructor() { }

  ngOnInit() {
    if (this.ChargeType !== '') {
      this.chargeMode = this.ChargeType;
    }
  }

  processCharge(event) {
    if (this.ChargeType === '' || this.ChargeType === 'list') {
      if (event.type === 'close') {
        this.FinancialChargesComponent.emit({ type: 'close', data: null });
      } else if (event.type === 'create') {
        this.chargeMode = 'create';
      } else if (event.type === 'list') {
        this.chargeMode = 'list';
      } else if (event.type === 'update') {
        this.chargeMode = 'update';
        this.ChargeId = event.data;
      } else if (event.type === 'totalPrice') {
        this.FinancialChargesComponent.emit(event);
      }
    } else {
      this.FinancialChargesComponent.emit(event);
    }
  }

}
