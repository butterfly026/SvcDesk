import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ComponentOutValue } from 'src/app/model';

@Component({
  selector: 'app-financial-product',
  templateUrl: './financial-product.component.html',
  styleUrls: ['./financial-product.component.scss'],
})
export class FinancialProductComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Input() FinancialId: string = '';
  @Input() ProductType: string = '';
  @Input() ComponentType: string = '';
  @Output('FinancialProductComponent') FinancialProductComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  productMode: string = 'list';
  ProductId: string = 'list';

  constructor() { }

  ngOnInit() {
  }

  processProduct(event) {
    if (this.ProductType === '' || this.ProductType === 'list') {
      if (event.type === 'close') {
        this.FinancialProductComponent.emit({ type: 'close' });
      } else if (event.type === 'create') {
        this.productMode = 'create';
      } else if (event.type === 'list') {
        this.productMode = 'list';
      } else if (event.type == 'update') {
        this.productMode = 'update';
        this.ProductId = event.data;
      }
    } else {
      this.FinancialProductComponent.emit(event);
    }
  }

}
