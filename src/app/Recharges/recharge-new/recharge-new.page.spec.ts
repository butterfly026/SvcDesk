import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RechargeNewPage } from './recharge-new.page';

describe('RechargeNewPage', () => {
  let component: RechargeNewPage;
  let fixture: ComponentFixture<RechargeNewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RechargeNewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RechargeNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
