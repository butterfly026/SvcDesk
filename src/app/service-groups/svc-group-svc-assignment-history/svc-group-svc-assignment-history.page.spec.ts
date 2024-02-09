import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvcGroupSvcAssignmentHistoryPage } from './svc-group-svc-assignment-history.page';

describe('SvcGroupSvcAssignmentHistoryPage', () => {
  let component: SvcGroupSvcAssignmentHistoryPage;
  let fixture: ComponentFixture<SvcGroupSvcAssignmentHistoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SvcGroupSvcAssignmentHistoryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvcGroupSvcAssignmentHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
