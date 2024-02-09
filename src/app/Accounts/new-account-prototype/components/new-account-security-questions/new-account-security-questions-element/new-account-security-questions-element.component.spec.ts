import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewAccountSecurityQuestionsElementComponent } from './new-account-security-questions-element.component';

describe('NewAccountSecurityQuestionsElementComponent', () => {
  let component: NewAccountSecurityQuestionsElementComponent;
  let fixture: ComponentFixture<NewAccountSecurityQuestionsElementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAccountSecurityQuestionsElementComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewAccountSecurityQuestionsElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
