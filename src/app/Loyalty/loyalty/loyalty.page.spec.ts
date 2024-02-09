import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltyPage } from './loyalty.page';

describe('LoyaltyPage', () => {
  let component: LoyaltyPage;
  let fixture: ComponentFixture<LoyaltyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoyaltyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoyaltyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
