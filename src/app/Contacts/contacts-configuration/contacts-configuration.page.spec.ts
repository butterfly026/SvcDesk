import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsConfigurationPage } from './contacts-configuration.page';

describe('ContactsConfigurationPage', () => {
  let component: ContactsConfigurationPage;
  let fixture: ComponentFixture<ContactsConfigurationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactsConfigurationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsConfigurationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
