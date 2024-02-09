import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewAccountContactPhonesComponent } from './new-account-contact-phones.component';

describe('NewAccountContactPhonesComponent', () => {
  let component: NewAccountContactPhonesComponent;
  let fixture: ComponentFixture<NewAccountContactPhonesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAccountContactPhonesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewAccountContactPhonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
