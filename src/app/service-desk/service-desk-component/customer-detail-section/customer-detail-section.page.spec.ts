import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDetailSectionPage } from './customer-detail-section.page';

describe('CustomerDetailSectionPage', () => {
  let component: CustomerDetailSectionPage;
  let fixture: ComponentFixture<CustomerDetailSectionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerDetailSectionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDetailSectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
