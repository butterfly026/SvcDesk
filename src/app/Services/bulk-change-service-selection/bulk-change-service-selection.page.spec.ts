import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkChangeServiceSelectionPage } from './bulk-change-service-selection.page';

describe('BulkChangeServiceSelectionPage', () => {
  let component: BulkChangeServiceSelectionPage;
  let fixture: ComponentFixture<BulkChangeServiceSelectionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkChangeServiceSelectionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkChangeServiceSelectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
