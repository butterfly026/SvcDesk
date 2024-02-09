import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactMethodsPage } from './contact-methods.page';

describe('ContactMethodsPage', () => {
  let component: ContactMethodsPage;
  let fixture: ComponentFixture<ContactMethodsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactMethodsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactMethodsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
