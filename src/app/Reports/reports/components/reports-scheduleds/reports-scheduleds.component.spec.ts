import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledReportPage } from './reports-scheduleds.component';

describe('ScheduledReportPage', () => {
  let component: ScheduledReportPage;
  let fixture: ComponentFixture<ScheduledReportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduledReportPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
