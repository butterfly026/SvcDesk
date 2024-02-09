import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillListUcRetailPage } from './bill-list-uc-retail.page';

describe('BillListUcRetailPage', () => {
  let component: BillListUcRetailPage;
  let fixture: ComponentFixture<BillListUcRetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillListUcRetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillListUcRetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
