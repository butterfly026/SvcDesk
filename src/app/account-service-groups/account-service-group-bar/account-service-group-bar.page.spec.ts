import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountServiceGroupBarPage } from './account-service-group-bar.page';

describe('AccountServiceGroupBarPage', () => {
  let component: AccountServiceGroupBarPage;
  let fixture: ComponentFixture<AccountServiceGroupBarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountServiceGroupBarPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountServiceGroupBarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
