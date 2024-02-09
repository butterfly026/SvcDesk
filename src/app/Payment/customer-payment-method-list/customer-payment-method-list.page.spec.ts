import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPaymentMethodListPage } from './customer-payment-method-list.page';

describe('CustomerPaymentMethodListPage', () => {
  let component: CustomerPaymentMethodListPage;
  let fixture: ComponentFixture<CustomerPaymentMethodListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerPaymentMethodListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPaymentMethodListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
