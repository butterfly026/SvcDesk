import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewAccountAuthenticationMobileComponent } from './new-account-authentication-mobile.component';

describe('NewAccountAuthenticationMobileComponent', () => {
  let component: NewAccountAuthenticationMobileComponent;
  let fixture: ComponentFixture<NewAccountAuthenticationMobileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAccountAuthenticationMobileComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewAccountAuthenticationMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
