import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewAccountAuthenticationPasswordComponent } from './new-account-authentication-password.component';

describe('NewAccountAuthenticationPasswordComponent', () => {
  let component: NewAccountAuthenticationPasswordComponent;
  let fixture: ComponentFixture<NewAccountAuthenticationPasswordComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAccountAuthenticationPasswordComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewAccountAuthenticationPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
