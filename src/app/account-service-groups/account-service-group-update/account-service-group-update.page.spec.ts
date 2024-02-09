import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountServiceGroupUpdatePage } from './account-service-group-update.page';

describe('AccountServiceGroupUpdatePage', () => {
  let component: AccountServiceGroupUpdatePage;
  let fixture: ComponentFixture<AccountServiceGroupUpdatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountServiceGroupUpdatePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountServiceGroupUpdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
