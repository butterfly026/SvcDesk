import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvcGroupSvcUnbarPage } from './svc-group-svc-unbar.page';

describe('SvcGroupSvcUnbarPage', () => {
  let component: SvcGroupSvcUnbarPage;
  let fixture: ComponentFixture<SvcGroupSvcUnbarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SvcGroupSvcUnbarPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvcGroupSvcUnbarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
