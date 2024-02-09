import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProudctPage } from './proudct.page';

describe('ProudctPage', () => {
  let component: ProudctPage;
  let fixture: ComponentFixture<ProudctPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProudctPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProudctPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
