import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceGroupComponentPage } from './service-group-component.page';

describe('ServiceGroupComponentPage', () => {
  let component: ServiceGroupComponentPage;
  let fixture: ComponentFixture<ServiceGroupComponentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceGroupComponentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceGroupComponentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
