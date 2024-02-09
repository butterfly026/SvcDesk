import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkServiceUnbarPage } from './bulk-service-unbar.page';

describe('BulkServiceUnbarPage', () => {
  let component: BulkServiceUnbarPage;
  let fixture: ComponentFixture<BulkServiceUnbarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkServiceUnbarPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkServiceUnbarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
