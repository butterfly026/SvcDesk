import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IOTBillingPlanNowPage } from './iot-billing-plan-now.page';

describe('IOTBillingPlanNowPage', () => {
  let component: IOTBillingPlanNowPage;
  let fixture: ComponentFixture<IOTBillingPlanNowPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IOTBillingPlanNowPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IOTBillingPlanNowPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
