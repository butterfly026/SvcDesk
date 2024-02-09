import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IOTBillingHomePage } from './iot-billing-home.page';

describe('IOTBillingHomePage', () => {
  let component: IOTBillingHomePage;
  let fixture: ComponentFixture<IOTBillingHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IOTBillingHomePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IOTBillingHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
