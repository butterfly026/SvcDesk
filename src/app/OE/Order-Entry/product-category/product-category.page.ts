import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ProductCategoryService } from './services/product-category.service';
import { Router } from '@angular/router';
import { TranService, LoadingService } from 'src/services';

import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.page.html',
  styleUrls: ['./product-category.page.scss'],
})
export class ProductCategoryPage implements OnInit {

  @Output('ProductCategoryComponent') ProductCategoryComponent: EventEmitter<string> = new EventEmitter<string>();
  groupForm: UntypedFormGroup;
  

  productList = [
    'product1', 'product2', 'product3',
  ];

  constructor(
    private router: Router,
    private tranService: TranService,
    private loading: LoadingService,
    
    private oeService: ProductCategoryService,
    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService,
  ) {
    
    this.groupForm = this.formBuilder.group({
      Product: ['', Validators.required],
      Price: ['', Validators.required],
      Quantity: ['', Validators.required],
      Total: ['', Validators.required],
    });

    this.groupForm.get('Total').disable();
  }

  ngOnInit() {
  }

  submitForm() {

  }

  submitTrigger() {
    document.getElementById('productCategory').click();
  }

  calcTotal() {
    if (this.groupForm.get('Price').valid && this.groupForm.get('Quantity').valid) {
      this.groupForm.get('Total').setValue(parseFloat(this.groupForm.get('Price').value) * parseFloat(this.groupForm.get('Quantity').value));
    }
  }

  goBack() {
    this.ProductCategoryComponent.emit('close');
  }

}
