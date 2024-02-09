import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ServiceEventInstanceDetailsComponent } from './service-event-instance-details.component';

describe('ServiceEventInstanceDetailsComponent', () => {
  let component: ServiceEventInstanceDetailsComponent;
  let fixture: ComponentFixture<ServiceEventInstanceDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceEventInstanceDetailsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceEventInstanceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
