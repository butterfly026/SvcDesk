import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ContactEventInstanceEdit } from './contact-event-instance-edit.component';

describe('ContactEventInstanceEdit', () => {
  let component: ContactEventInstanceEdit;
  let fixture: ComponentFixture<ContactEventInstanceEdit>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactEventInstanceEdit ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactEventInstanceEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
