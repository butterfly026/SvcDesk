import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactNewPage } from './contact-new.page';

describe('ContactNewPage', () => {
  let component: ContactNewPage;
  let fixture: ComponentFixture<ContactNewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactNewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
