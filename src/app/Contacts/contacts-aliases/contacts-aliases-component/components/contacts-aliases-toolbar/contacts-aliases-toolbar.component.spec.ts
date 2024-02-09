import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ContactsAliasesToolbarComponent } from './contacts-aliases-toolbar.component';

describe('ContactsAliasesToolbarComponent', () => {
  let component: ContactsAliasesToolbarComponent;
  let fixture: ComponentFixture<ContactsAliasesToolbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactsAliasesToolbarComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactsAliasesToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
