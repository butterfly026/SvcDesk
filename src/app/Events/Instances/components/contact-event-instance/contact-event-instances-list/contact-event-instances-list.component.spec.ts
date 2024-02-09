import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ContactEventInstancesList } from './contact-event-instances-list.component';

describe('ContactEvenInstancesList', () => {
  let component: ContactEventInstancesList;
  let fixture: ComponentFixture<ContactEventInstancesList>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactEventInstancesList ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactEventInstancesList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
