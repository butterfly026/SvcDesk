import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountEditPage } from './discount-edit.page';

describe('DiscountEditPage', () => {
  let component: DiscountEditPage;
  let fixture: ComponentFixture<DiscountEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscountEditPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
