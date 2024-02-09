import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceDeskMainPage } from './service-desk-main.page';

describe('ServiceDeskMainPage', () => {
  let component: ServiceDeskMainPage;
  let fixture: ComponentFixture<ServiceDeskMainPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceDeskMainPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceDeskMainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
