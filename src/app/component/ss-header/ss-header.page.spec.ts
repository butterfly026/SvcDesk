import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SsHeaderPage } from './ss-header.page';

describe('SsHeaderPage', () => {
  let component: SsHeaderPage;
  let fixture: ComponentFixture<SsHeaderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SsHeaderPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SsHeaderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
