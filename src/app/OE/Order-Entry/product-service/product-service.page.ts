import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ProductServiceService } from './services/product-service.service';
import { Router } from '@angular/router';
import { TranService, LoadingService } from 'src/services';

import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-product-service',
  templateUrl: './product-service.page.html',
  styleUrls: ['./product-service.page.scss'],
})
export class ProductServicePage implements OnInit {

  @Output('ProductServiceComponent') ProductServiceComponent: EventEmitter<string> = new EventEmitter<string>();
  groupForm: UntypedFormGroup;
  

  serviceList = [
    'service1', 'service2', 'service3',
  ];

  constructor(
    private router: Router,
    private tranService: TranService,
    private loading: LoadingService,
    
    private oeService: ProductServiceService,
    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService,
  ) {
    
    this.groupForm = this.formBuilder.group({
      Service: ['', Validators.required],
      Rate: ['', Validators.required],
      Hours: ['', Validators.required],
      Total: ['', Validators.required],
      Note: [''],
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
    if (this.groupForm.get('Rate').valid && this.groupForm.get('Hours').valid) {
      this.groupForm.get('Total').setValue(parseFloat(this.groupForm.get('Rate').value) * parseFloat(this.groupForm.get('Hours').value));
    }
  }

  goBack() {
    this.ProductServiceComponent.emit('close');
  }

}
