import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactPhoneComponentPage } from './contact-phone-component.page';

describe('ContactPhoneComponentPage', () => {
  let component: ContactPhoneComponentPage;
  let fixture: ComponentFixture<ContactPhoneComponentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactPhoneComponentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactPhoneComponentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
