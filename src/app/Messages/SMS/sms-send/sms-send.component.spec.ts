import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SmsSendComponent } from './sms-send.component';

describe('SmsSendComponent', () => {
  let component: SmsSendComponent;
  let fixture: ComponentFixture<SmsSendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsSendComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SmsSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
