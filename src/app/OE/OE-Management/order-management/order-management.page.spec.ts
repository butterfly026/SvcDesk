import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderManagementPage } from './order-management.page';

describe('OrderManagementPage', () => {
  let component: OrderManagementPage;
  let fixture: ComponentFixture<OrderManagementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderManagementPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
