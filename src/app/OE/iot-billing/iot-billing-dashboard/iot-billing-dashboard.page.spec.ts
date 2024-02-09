import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IOTBillingDashboardPage } from './iot-billing-dashboard.page';

describe('IOTBillingDashboardPage', () => {
  let component: IOTBillingDashboardPage;
  let fixture: ComponentFixture<IOTBillingDashboardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IOTBillingDashboardPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IOTBillingDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
