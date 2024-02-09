import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPaymentPage } from './list-payment.page';

describe('ListPaymentPage', () => {
  let component: ListPaymentPage;
  let fixture: ComponentFixture<ListPaymentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPaymentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
