import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPaymentMethodListNewPage } from './customer-payment-method-list-new.page';

describe('CustomerPaymentMethodListNewPage', () => {
  let component: CustomerPaymentMethodListNewPage;
  let fixture: ComponentFixture<CustomerPaymentMethodListNewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerPaymentMethodListNewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPaymentMethodListNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
