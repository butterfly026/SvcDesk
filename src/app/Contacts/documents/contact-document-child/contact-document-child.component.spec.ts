import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ContactDocumentChildComponent } from './contact-document-child.component';

describe('ContactDocumentChildComponent', () => {
  let component: ContactDocumentChildComponent;
  let fixture: ComponentFixture<ContactDocumentChildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactDocumentChildComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactDocumentChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
