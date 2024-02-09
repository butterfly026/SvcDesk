import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactNewComponentPage } from './contact-new-component.page';

describe('ContactNewComponentPage', () => {
  let component: ContactNewComponentPage;
  let fixture: ComponentFixture<ContactNewComponentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactNewComponentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactNewComponentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
