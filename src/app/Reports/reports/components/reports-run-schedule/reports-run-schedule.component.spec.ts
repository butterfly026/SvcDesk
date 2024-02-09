import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RreportsRunScehduleComponent } from './reports-run-schedule.component';

describe('RreportsRunScehduleComponent', () => {
  let component: RreportsRunScehduleComponent;
  let fixture: ComponentFixture<RreportsRunScehduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RreportsRunScehduleComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RreportsRunScehduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
