import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsEmailsPage } from './contacts-emails.page';

describe('ContactsEmailsPage', () => {
  let component: ContactsEmailsPage;
  let fixture: ComponentFixture<ContactsEmailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactsEmailsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsEmailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
