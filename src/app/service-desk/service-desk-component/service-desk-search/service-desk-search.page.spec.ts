import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceDeskSearchPage } from './service-desk-search.page';

describe('ServiceDeskSearchPage', () => {
  let component: ServiceDeskSearchPage;
  let fixture: ComponentFixture<ServiceDeskSearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceDeskSearchPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceDeskSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
