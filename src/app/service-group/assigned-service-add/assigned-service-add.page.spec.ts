import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedServiceAddPage } from './assigned-service-add.page';

describe('AssignedServiceAddPage', () => {
  let component: AssignedServiceAddPage;
  let fixture: ComponentFixture<AssignedServiceAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignedServiceAddPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedServiceAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
