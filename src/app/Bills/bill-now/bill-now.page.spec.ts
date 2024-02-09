import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillNowPage } from './bill-now.page';

describe('BillNowPage', () => {
  let component: BillNowPage;
  let fixture: ComponentFixture<BillNowPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillNowPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillNowPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
