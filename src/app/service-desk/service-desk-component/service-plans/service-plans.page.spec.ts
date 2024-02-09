import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicePlansPage } from './service-plans.page';

describe('ServicePlansPage', () => {
  let component: ServicePlansPage;
  let fixture: ComponentFixture<ServicePlansPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicePlansPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicePlansPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
