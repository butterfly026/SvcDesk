import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AccountTaskPrioritiesComponent } from './account-task-priorities.component';

describe('AccountTaskPrioritiesComponent', () => {
  let component: AccountTaskPrioritiesComponent;
  let fixture: ComponentFixture<AccountTaskPrioritiesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountTaskPrioritiesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountTaskPrioritiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
