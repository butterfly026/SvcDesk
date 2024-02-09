import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceAddPage } from './service-add.page';

describe('ServiceAddPage', () => {
  let component: ServiceAddPage;
  let fixture: ComponentFixture<ServiceAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceAddPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
