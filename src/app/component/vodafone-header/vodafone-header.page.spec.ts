import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VodafoneHeaderPage } from './vodafone-header.page';

describe('VodafoneHeaderPage', () => {
  let component: VodafoneHeaderPage;
  let fixture: ComponentFixture<VodafoneHeaderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VodafoneHeaderPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VodafoneHeaderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
