import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillHistoryPage } from './bill-history.page';

describe('BillHistoryPage', () => {
  let component: BillHistoryPage;
  let fixture: ComponentFixture<BillHistoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillHistoryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
