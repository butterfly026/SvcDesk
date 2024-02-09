import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewAccountAuthenticationLoginIdComponent } from './new-account-authentication-login-id.component';

describe('NewAccountAuthenticationLoginIdComponent', () => {
  let component: NewAccountAuthenticationLoginIdComponent;
  let fixture: ComponentFixture<NewAccountAuthenticationLoginIdComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAccountAuthenticationLoginIdComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewAccountAuthenticationLoginIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
