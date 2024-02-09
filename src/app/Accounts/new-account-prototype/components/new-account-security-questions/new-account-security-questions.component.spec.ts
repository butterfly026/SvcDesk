import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewAccountSecurityQuestionsComponent } from './new-account-security-questions.component';

describe('NewAccountSecurityQuestionsComponent', () => {
  let component: NewAccountSecurityQuestionsComponent;
  let fixture: ComponentFixture<NewAccountSecurityQuestionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAccountSecurityQuestionsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewAccountSecurityQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
