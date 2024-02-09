import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentStatusHistoryPage } from './payment-status-history.page';

describe('PaymentStatusHistoryPage', () => {
  let component: PaymentStatusHistoryPage;
  let fixture: ComponentFixture<PaymentStatusHistoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentStatusHistoryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentStatusHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
