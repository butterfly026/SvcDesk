import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RechargeSimpleNewPage } from './recharge-simple-new.page';

describe('RechargeSimpleNewPage', () => {
  let component: RechargeSimpleNewPage;
  let fixture: ComponentFixture<RechargeSimpleNewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RechargeSimpleNewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RechargeSimpleNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
