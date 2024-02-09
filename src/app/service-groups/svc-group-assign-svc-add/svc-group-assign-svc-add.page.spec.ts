import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvcGroupAssignSvcAddPage } from './svc-group-assign-svc-add.page';

describe('SvcGroupAssignSvcAddPage', () => {
  let component: SvcGroupAssignSvcAddPage;
  let fixture: ComponentFixture<SvcGroupAssignSvcAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SvcGroupAssignSvcAddPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvcGroupAssignSvcAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
