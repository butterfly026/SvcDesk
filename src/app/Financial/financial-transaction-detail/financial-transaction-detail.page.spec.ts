import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialTransactionDetailPage } from './financial-transaction-detail.page';

describe('FinancialTransactionDetailPage', () => {
  let component: FinancialTransactionDetailPage;
  let fixture: ComponentFixture<FinancialTransactionDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialTransactionDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialTransactionDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
