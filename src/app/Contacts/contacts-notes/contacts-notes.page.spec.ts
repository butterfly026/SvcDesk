import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsNotesPage } from './contacts-notes.page';

describe('NoteHomePage', () => {
  let component: ContactsNotesPage;
  let fixture: ComponentFixture<ContactsNotesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactsNotesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsNotesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
