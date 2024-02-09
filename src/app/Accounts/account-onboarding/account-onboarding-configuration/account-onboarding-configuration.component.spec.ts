import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AccountOnboardingConfigurationComponent } from './account-onboarding-configuration.component';

describe('AccountOnboardingConfigurationComponent', () => {
  let component: AccountOnboardingConfigurationComponent;
  let fixture: ComponentFixture<AccountOnboardingConfigurationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountOnboardingConfigurationComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountOnboardingConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
