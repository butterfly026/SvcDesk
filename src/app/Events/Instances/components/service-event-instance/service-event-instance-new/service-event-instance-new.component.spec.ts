import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ServiceEventInstanceNewComponent } from './service-event-instance-new.component';

describe('ServiceEventInstanceNewComponent', () => {
  let component: ServiceEventInstanceNewComponent;
  let fixture: ComponentFixture<ServiceEventInstanceNewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceEventInstanceNewComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceEventInstanceNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
