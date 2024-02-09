import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltyHomePage } from './loyalty-home.page';

describe('LoyaltyHomePage', () => {
  let component: LoyaltyHomePage;
  let fixture: ComponentFixture<LoyaltyHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoyaltyHomePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoyaltyHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
