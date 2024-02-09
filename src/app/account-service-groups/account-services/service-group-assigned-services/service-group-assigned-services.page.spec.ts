import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceGroupAssignedServicesPage } from './service-group-assigned-services.page';

describe('ServiceGroupAssignedServicesPage', () => {
  let component: ServiceGroupAssignedServicesPage;
  let fixture: ComponentFixture<ServiceGroupAssignedServicesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceGroupAssignedServicesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceGroupAssignedServicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
