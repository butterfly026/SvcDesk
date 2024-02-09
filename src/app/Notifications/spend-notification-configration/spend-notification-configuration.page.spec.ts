import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendNotificationConfigurationPage } from './spend-notification-configuration.page';

describe('SpendNotificationConfigrationPage', () => {
  let component: SpendNotificationConfigurationPage;
  let fixture: ComponentFixture<SpendNotificationConfigurationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpendNotificationConfigurationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpendNotificationConfigurationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
