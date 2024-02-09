import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnbarServicePage } from './unbar-service.page';

describe('UnbarServicePage', () => {
  let component: UnbarServicePage;
  let fixture: ComponentFixture<UnbarServicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnbarServicePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnbarServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
