import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcedureBalancePage } from './procedure-balance.page';

describe('ProcedureBalancePage', () => {
  let component: ProcedureBalancePage;
  let fixture: ComponentFixture<ProcedureBalancePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcedureBalancePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcedureBalancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
