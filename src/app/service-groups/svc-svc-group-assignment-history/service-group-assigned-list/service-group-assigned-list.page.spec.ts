import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceGroupAssignedListPage } from './service-group-assigned-list.page';

describe('ServiceGroupAssignedListPage', () => {
  let component: ServiceGroupAssignedListPage;
  let fixture: ComponentFixture<ServiceGroupAssignedListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceGroupAssignedListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceGroupAssignedListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
