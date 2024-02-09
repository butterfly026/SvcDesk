import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePaymentPage } from './update-payment.page';

describe('UpdatePaymentPage', () => {
  let component: UpdatePaymentPage;
  let fixture: ComponentFixture<UpdatePaymentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatePaymentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
