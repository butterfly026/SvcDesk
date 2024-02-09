import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RechargeAutoPurchasePage } from './recharge-auto-purchase.page';

describe('RechargeAutoPurchasePage', () => {
  let component: RechargeAutoPurchasePage;
  let fixture: ComponentFixture<RechargeAutoPurchasePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RechargeAutoPurchasePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RechargeAutoPurchasePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
