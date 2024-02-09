import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceDeskPage } from './service-desk.page';

describe('ServiceDeskPage', () => {
  let component: ServiceDeskPage;
  let fixture: ComponentFixture<ServiceDeskPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceDeskPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceDeskPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
