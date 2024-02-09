import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RechargeListPage } from './recharge-list.page';

describe('RechargeListPage', () => {
  let component: RechargeListPage;
  let fixture: ComponentFixture<RechargeListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RechargeListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RechargeListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
