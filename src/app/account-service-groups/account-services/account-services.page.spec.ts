import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountServicesPage } from './account-services.page';

describe('AccountServicesPage', () => {
  let component: AccountServicesPage;
  let fixture: ComponentFixture<AccountServicesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountServicesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountServicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
