import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsAliasesPage } from './contacts-aliases.page';

describe('AliasesPage', () => {
  let component: ContactsAliasesPage;
  let fixture: ComponentFixture<ContactsAliasesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactsAliasesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsAliasesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
