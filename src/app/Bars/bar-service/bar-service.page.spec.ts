import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarServicePage } from './bar-service.page';

describe('BarServicePage', () => {
  let component: BarServicePage;
  let fixture: ComponentFixture<BarServicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarServicePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
