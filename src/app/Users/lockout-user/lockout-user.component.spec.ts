import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LockoutUserComponent } from './lockout-user.component';

describe('LockoutUserComponent', () => {
  let component: LockoutUserComponent;
  let fixture: ComponentFixture<LockoutUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LockoutUserComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LockoutUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
