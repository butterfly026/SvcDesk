import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactPaymentMethodComponentPage } from './contact-payment-method-component.page';

describe('ContactPaymentMethodComponentPage', () => {
  let component: ContactPaymentMethodComponentPage;
  let fixture: ComponentFixture<ContactPaymentMethodComponentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactPaymentMethodComponentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactPaymentMethodComponentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
