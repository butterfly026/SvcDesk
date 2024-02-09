import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ContactAttributeConfigurationComponent } from './contact-attribute-configuration.component';

describe('ContactAttributeConfigurationComponent', () => {
  let component: ContactAttributeConfigurationComponent;
  let fixture: ComponentFixture<ContactAttributeConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactAttributeConfigurationComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactAttributeConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
