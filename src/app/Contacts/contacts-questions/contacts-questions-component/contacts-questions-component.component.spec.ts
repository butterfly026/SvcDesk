import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ContactsQuestionsComponentComponent } from './contacts-questions-component.component';

describe('ContactsQuestionsComponentComponent', () => {
  let component: ContactsQuestionsComponentComponent;
  let fixture: ComponentFixture<ContactsQuestionsComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactsQuestionsComponentComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactsQuestionsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
