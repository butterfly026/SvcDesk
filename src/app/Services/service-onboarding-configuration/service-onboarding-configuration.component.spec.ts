import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ServiceOnboardingConfigurationComponent } from './service-onboarding-configuration.component';

describe('ServiceOnboardingConfigurationComponent', () => {
  let component: ServiceOnboardingConfigurationComponent;
  let fixture: ComponentFixture<ServiceOnboardingConfigurationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceOnboardingConfigurationComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceOnboardingConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
