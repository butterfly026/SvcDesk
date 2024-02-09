import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkDetailPage } from './network-detail.page';

describe('NetworkDetailPage', () => {
  let component: NetworkDetailPage;
  let fixture: ComponentFixture<NetworkDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
