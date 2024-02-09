import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsIdentificationComponentPage } from './contacts-identification-component.page';

describe('ContactsIdentificationComponentPage', () => {
  let component: ContactsIdentificationComponentPage;
  let fixture: ComponentFixture<ContactsIdentificationComponentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactsIdentificationComponentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsIdentificationComponentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
