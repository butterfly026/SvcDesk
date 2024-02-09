import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsAccountHierarchyPage } from './contacts-account-hierarchy.page';

describe('ContactsAccountHierarchyPage', () => {
  let component: ContactsAccountHierarchyPage;
  let fixture: ComponentFixture<ContactsAccountHierarchyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactsAccountHierarchyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsAccountHierarchyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
