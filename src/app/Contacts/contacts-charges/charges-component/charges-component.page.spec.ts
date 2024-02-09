import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargesComponentPage } from './charges-component.page';

describe('ChargesComponentPage', () => {
  let component: ChargesComponentPage;
  let fixture: ComponentFixture<ChargesComponentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargesComponentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargesComponentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
