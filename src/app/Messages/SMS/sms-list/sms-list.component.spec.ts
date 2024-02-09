import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SmsListComponent } from './sms-list.component';

describe('SmsListComponent', () => {
  let component: SmsListComponent;
  let fixture: ComponentFixture<SmsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsListComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SmsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
