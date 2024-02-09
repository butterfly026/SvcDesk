import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceStatusPage } from './service-status.page';

describe('ServiceStatusPage', () => {
  let component: ServiceStatusPage;
  let fixture: ComponentFixture<ServiceStatusPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceStatusPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceStatusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
