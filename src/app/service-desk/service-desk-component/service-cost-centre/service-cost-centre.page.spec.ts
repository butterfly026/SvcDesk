import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceCostCentrePage } from './service-cost-centre.page';

describe('ServiceCostCentrePage', () => {
  let component: ServiceCostCentrePage;
  let fixture: ComponentFixture<ServiceCostCentrePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceCostCentrePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceCostCentrePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
