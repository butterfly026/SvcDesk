import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AuthorisedAccountsFormComponent } from './authorised-accounts-form.component';

describe('AuthorisedAccountsFormComponent', () => {
  let component: AuthorisedAccountsFormComponent;
  let fixture: ComponentFixture<AuthorisedAccountsFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorisedAccountsFormComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorisedAccountsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
