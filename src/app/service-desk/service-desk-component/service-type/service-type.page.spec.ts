import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceTypePage } from './service-type.page';

describe('ServiceTypePage', () => {
  let component: ServiceTypePage;
  let fixture: ComponentFixture<ServiceTypePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceTypePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceTypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
