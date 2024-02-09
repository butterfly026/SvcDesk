import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountServiceGroupsPage } from './account-service-groups.page';

describe('AccountServiceGroupsPage', () => {
  let component: AccountServiceGroupsPage;
  let fixture: ComponentFixture<AccountServiceGroupsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountServiceGroupsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountServiceGroupsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
