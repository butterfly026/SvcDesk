import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ComponentOutValue } from 'src/app/model';

@Component({
  selector: 'app-financial-product-new',
  templateUrl: './financial-product-new.component.html',
  styleUrls: ['./financial-product-new.component.scss'],
})
export class FinancialProductNewComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Input() ComponentType: string = '';
  @Output('FinancialProductComponent') FinancialProductComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  productMode: string = 'list';
  ProductId: string = 'list';

  constructor() { }

  ngOnInit() {
  }

  processProduct(event) {
    if (this.ComponentType === '' || this.ComponentType === 'list') {
      if (event.type === 'close') {
        this.FinancialProductComponent.emit({ type: 'close' });
      } else if (event.type === 'create') {
        this.productMode = 'create';
      } else if (event.type === 'list') {
        this.productMode = 'list';
      } else if (event.type == 'update') {
        this.productMode = 'update';
        this.ProductId = event.data;
      } else if (event.type === 'totalPrice') {
        this.FinancialProductComponent.emit(event);
      }
    } else {
      this.FinancialProductComponent.emit(event);
    }
  }

}
