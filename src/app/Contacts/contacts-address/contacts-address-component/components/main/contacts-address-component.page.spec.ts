import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsAddressComponentPage } from './contacts-address-component.page';

describe('ContactsAddressComponentPage', () => {
  let component: ContactsAddressComponentPage;
  let fixture: ComponentFixture<ContactsAddressComponentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactsAddressComponentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsAddressComponentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
