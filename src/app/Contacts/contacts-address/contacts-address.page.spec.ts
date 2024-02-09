import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsAddressPage } from './contacts-address.page';

describe('ContactsAddressPage', () => {
  let component: ContactsAddressPage;
  let fixture: ComponentFixture<ContactsAddressPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactsAddressPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsAddressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
