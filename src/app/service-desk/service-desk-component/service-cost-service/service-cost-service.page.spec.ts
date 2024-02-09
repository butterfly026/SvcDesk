import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceCostServicePage } from './service-cost-service.page';

describe('ServiceCostServicePage', () => {
  let component: ServiceCostServicePage;
  let fixture: ComponentFixture<ServiceCostServicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceCostServicePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceCostServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
