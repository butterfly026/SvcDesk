import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ServiceAttributeInstanceDetailsComponent } from './service-attribute-instance-details.component';

describe('ServiceAttributeInstanceDetailsComponent', () => {
  let component: ServiceAttributeInstanceDetailsComponent;
  let fixture: ComponentFixture<ServiceAttributeInstanceDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceAttributeInstanceDetailsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceAttributeInstanceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
