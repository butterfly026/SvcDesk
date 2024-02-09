import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewAccountContactPhonesElementComponent } from './new-account-contact-phones-element.component';

describe('NewAccountContactPhonesElementComponent', () => {
  let component: NewAccountContactPhonesElementComponent;
  let fixture: ComponentFixture<NewAccountContactPhonesElementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAccountContactPhonesElementComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewAccountContactPhonesElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
