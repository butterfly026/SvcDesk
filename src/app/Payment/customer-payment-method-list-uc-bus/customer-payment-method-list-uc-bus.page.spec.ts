import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPaymentMethodListUcBusPage } from './customer-payment-method-list-uc-bus.page';

describe('CustomerPaymentMethodListUcBusPage', () => {
  let component: CustomerPaymentMethodListUcBusPage;
  let fixture: ComponentFixture<CustomerPaymentMethodListUcBusPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerPaymentMethodListUcBusPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPaymentMethodListUcBusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
