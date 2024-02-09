import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkHomePage } from './network-home.page';

describe('NetworkHomePage', () => {
  let component: NetworkHomePage;
  let fixture: ComponentFixture<NetworkHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkHomePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
