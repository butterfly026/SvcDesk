import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceDeskServiceTabPage } from './service-desk-service-tab.page';


describe('ServiceDeskServiceTabPage', () => {
  let component: ServiceDeskServiceTabPage;
  let fixture: ComponentFixture<ServiceDeskServiceTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceDeskServiceTabPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceDeskServiceTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
