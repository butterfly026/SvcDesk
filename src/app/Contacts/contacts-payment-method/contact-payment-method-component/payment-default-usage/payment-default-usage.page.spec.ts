import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDefaultUsagePage } from './payment-default-usage.page';

describe('PaymentDefaultUsagePage', () => {
  let component: PaymentDefaultUsagePage;
  let fixture: ComponentFixture<PaymentDefaultUsagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentDefaultUsagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentDefaultUsagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
