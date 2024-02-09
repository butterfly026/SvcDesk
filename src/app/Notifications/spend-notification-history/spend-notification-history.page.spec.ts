import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendNotificationHistoryPage } from './spend-notification-history.page';

describe('SpendNotificationHistoryPage', () => {
  let component: SpendNotificationHistoryPage;
  let fixture: ComponentFixture<SpendNotificationHistoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpendNotificationHistoryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpendNotificationHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
