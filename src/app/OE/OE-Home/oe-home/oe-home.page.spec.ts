import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OeHomePage } from './oe-home.page';

describe('OeHomePage', () => {
  let component: OeHomePage;
  let fixture: ComponentFixture<OeHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OeHomePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OeHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
