import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicePlansServicePage } from './service-plans-service.page';

describe('ServicePlansServicePage', () => {
  let component: ServicePlansServicePage;
  let fixture: ComponentFixture<ServicePlansServicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicePlansServicePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicePlansServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
