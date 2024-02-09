import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceAddPage } from './device-add.page';

describe('DeviceAddPage', () => {
  let component: DeviceAddPage;
  let fixture: ComponentFixture<DeviceAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceAddPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
