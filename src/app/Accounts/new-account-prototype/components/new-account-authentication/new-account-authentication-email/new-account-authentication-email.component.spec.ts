import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewAccountAuthenticationEmailComponent } from './new-account-authentication-email.component';

describe('NewAccountAuthenticationEmailComponent', () => {
  let component: NewAccountAuthenticationEmailComponent;
  let fixture: ComponentFixture<NewAccountAuthenticationEmailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAccountAuthenticationEmailComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewAccountAuthenticationEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
