import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRechargePage } from './new-recharge.page';

describe('NewRechargePage', () => {
  let component: NewRechargePage;
  let fixture: ComponentFixture<NewRechargePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRechargePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRechargePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
