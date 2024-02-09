import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceChangesPage } from './service-changes.page';

describe('ServiceChangesPage', () => {
  let component: ServiceChangesPage;
  let fixture: ComponentFixture<ServiceChangesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceChangesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceChangesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
