import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountNewPage } from './discount-new.page';

describe('DiscountNewPage', () => {
  let component: DiscountNewPage;
  let fixture: ComponentFixture<DiscountNewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscountNewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
