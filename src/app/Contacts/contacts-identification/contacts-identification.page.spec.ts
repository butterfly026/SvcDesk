import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsIdentificationPage } from './contacts-identification.page';

describe('ContactsIdentificationPage', () => {
  let component: ContactsIdentificationPage;
  let fixture: ComponentFixture<ContactsIdentificationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactsIdentificationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsIdentificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
