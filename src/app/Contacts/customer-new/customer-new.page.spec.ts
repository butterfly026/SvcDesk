import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerNewPage } from './customer-new.page';

describe('CustomerNewPage', () => {
  let component: CustomerNewPage;
  let fixture: ComponentFixture<CustomerNewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerNewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
