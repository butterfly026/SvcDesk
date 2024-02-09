import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkServiceGroupChangePage } from './bulk-service-group-change.page';

describe('BulkServiceGroupChangePage', () => {
  let component: BulkServiceGroupChangePage;
  let fixture: ComponentFixture<BulkServiceGroupChangePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkServiceGroupChangePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkServiceGroupChangePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
