import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ContactsEnquiryPasswordComponent } from './contacts-enquiry-password.component';

describe('ContactsEnquiryPasswordComponent', () => {
  let component: ContactsEnquiryPasswordComponent;
  let fixture: ComponentFixture<ContactsEnquiryPasswordComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactsEnquiryPasswordComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactsEnquiryPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
