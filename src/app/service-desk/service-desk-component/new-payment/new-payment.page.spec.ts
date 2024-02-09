import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPaymentPage } from './new-payment.page';

describe('NewPaymentPage', () => {
  let component: NewPaymentPage;
  let fixture: ComponentFixture<NewPaymentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPaymentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
