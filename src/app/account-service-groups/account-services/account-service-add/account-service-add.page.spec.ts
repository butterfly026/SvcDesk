import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountServiceAddPage } from './account-service-add.page';

describe('AccountServiceAddPage', () => {
  let component: AccountServiceAddPage;
  let fixture: ComponentFixture<AccountServiceAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountServiceAddPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountServiceAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
