import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkDisconnectPage } from './bulk-disconnect.page';

describe('BulkDisconnectPage', () => {
  let component: BulkDisconnectPage;
  let fixture: ComponentFixture<BulkDisconnectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkDisconnectPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkDisconnectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
