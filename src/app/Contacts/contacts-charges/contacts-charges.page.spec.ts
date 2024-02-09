import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsChargesPage } from './contacts-charges.page';

describe('ContactsChargesPage', () => {
  let component: ContactsChargesPage;
  let fixture: ComponentFixture<ContactsChargesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactsChargesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsChargesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
