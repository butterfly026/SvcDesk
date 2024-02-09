import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationFormPage } from './notification-form.page';

describe('NotificationFormPage', () => {
  let component: NotificationFormPage;
  let fixture: ComponentFixture<NotificationFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationFormPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
