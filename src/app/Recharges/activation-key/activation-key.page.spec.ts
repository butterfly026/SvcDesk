import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivationKeyPage } from './activation-key.page';

describe('ActivationKeyPage', () => {
  let component: ActivationKeyPage;
  let fixture: ComponentFixture<ActivationKeyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivationKeyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivationKeyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
