import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EmailSendListComponent } from './email-send-list.component';

describe('EmailSendListComponent', () => {
  let component: EmailSendListComponent;
  let fixture: ComponentFixture<EmailSendListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailSendListComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EmailSendListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
