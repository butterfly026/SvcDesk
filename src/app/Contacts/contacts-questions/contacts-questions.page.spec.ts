import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ContactsQuestionsPage } from './contacts-questions.page';

describe('ContactsQuestionsPage', () => {
  let component: ContactsQuestionsPage;
  let fixture: ComponentFixture<ContactsQuestionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactsQuestionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactsQuestionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
