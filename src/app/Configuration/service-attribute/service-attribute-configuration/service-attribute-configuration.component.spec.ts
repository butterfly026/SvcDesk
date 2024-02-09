import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ServiceAttributeConfigurationComponent } from './service-attribute-configuration.component';

describe('ServiceAttributeConfigurationComponent', () => {
  let component: ServiceAttributeConfigurationComponent;
  let fixture: ComponentFixture<ServiceAttributeConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceAttributeConfigurationComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceAttributeConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
