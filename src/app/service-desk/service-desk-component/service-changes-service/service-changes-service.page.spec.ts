import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceChangesServicePage } from './service-changes-service.page';

describe('ServiceChangesServicePage', () => {
  let component: ServiceChangesServicePage;
  let fixture: ComponentFixture<ServiceChangesServicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceChangesServicePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceChangesServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
