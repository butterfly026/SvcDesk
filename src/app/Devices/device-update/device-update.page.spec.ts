import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceUpdatePage } from './device-update.page';

describe('DeviceUpdatePage', () => {
  let component: DeviceUpdatePage;
  let fixture: ComponentFixture<DeviceUpdatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceUpdatePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceUpdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
