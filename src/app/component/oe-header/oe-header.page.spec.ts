import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OeHeaderPage } from './oe-header.page';

describe('OeHeaderPage', () => {
  let component: OeHeaderPage;
  let fixture: ComponentFixture<OeHeaderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OeHeaderPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OeHeaderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
