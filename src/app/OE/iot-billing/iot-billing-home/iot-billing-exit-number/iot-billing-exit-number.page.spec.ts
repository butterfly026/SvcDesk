import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IOTBillingExitNumberPage } from './iot-billing-exit-number.page';

describe('IOTBillingExitNumberPage', () => {
  let component: IOTBillingExitNumberPage;
  let fixture: ComponentFixture<IOTBillingExitNumberPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IOTBillingExitNumberPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IOTBillingExitNumberPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
