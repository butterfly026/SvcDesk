import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationProcedurePage } from './notification-procedure.page';

describe('NotificationProcedurePage', () => {
  let component: NotificationProcedurePage;
  let fixture: ComponentFixture<NotificationProcedurePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationProcedurePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationProcedurePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
