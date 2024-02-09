import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkServiceBarPage } from './bulk-service-bar.page';

describe('BulkServiceBarPage', () => {
  let component: BulkServiceBarPage;
  let fixture: ComponentFixture<BulkServiceBarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkServiceBarPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkServiceBarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
