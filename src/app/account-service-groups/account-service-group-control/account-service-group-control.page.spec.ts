import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountServiceGroupControlPage } from './account-service-group-control.page';

describe('AccountServiceGroupControlPage', () => {
  let component: AccountServiceGroupControlPage;
  let fixture: ComponentFixture<AccountServiceGroupControlPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountServiceGroupControlPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountServiceGroupControlPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
