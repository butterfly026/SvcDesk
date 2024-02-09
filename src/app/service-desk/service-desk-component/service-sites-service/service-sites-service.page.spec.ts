import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceSitesServicePage } from './service-sites-service.page';

describe('ServiceSitesServicePage', () => {
  let component: ServiceSitesServicePage;
  let fixture: ComponentFixture<ServiceSitesServicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceSitesServicePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceSitesServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
