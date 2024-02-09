import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RechargeSimpleListPage } from './recharge-simple-list.page';

describe('RechargeSimpleListPage', () => {
  let component: RechargeSimpleListPage;
  let fixture: ComponentFixture<RechargeSimpleListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RechargeSimpleListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RechargeSimpleListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
