import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceStatusServicePage } from './service-status-service.page';

describe('ServiceStatusServicePage', () => {
  let component: ServiceStatusServicePage;
  let fixture: ComponentFixture<ServiceStatusServicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceStatusServicePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceStatusServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
