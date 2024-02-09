import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ServiceEnquiryPasswordComponent } from './service-enquiry-password.component';

describe('ServiceEnquiryPasswordComponent', () => {
  let component: ServiceEnquiryPasswordComponent;
  let fixture: ComponentFixture<ServiceEnquiryPasswordComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceEnquiryPasswordComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceEnquiryPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
