import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvcGroupSvcBarPage } from './svc-group-svc-bar.page';

describe('SvcGroupSvcBarPage', () => {
  let component: SvcGroupSvcBarPage;
  let fixture: ComponentFixture<SvcGroupSvcBarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SvcGroupSvcBarPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvcGroupSvcBarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
