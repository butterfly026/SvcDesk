import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ContactEventInstanceNew } from './contact-event-instance-new.component';

describe('ContactEventInstanceNew', () => {
  let component: ContactEventInstanceNew;
  let fixture: ComponentFixture<ContactEventInstanceNew>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactEventInstanceNew ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactEventInstanceNew);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
