import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ContactEventInstanceDetailsComponent } from './contact-event-instance-details.component';

describe('ContactEventInstanceDetailsComponent', () => {
  let component: ContactEventInstanceDetailsComponent;
  let fixture: ComponentFixture<ContactEventInstanceDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactEventInstanceDetailsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactEventInstanceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
