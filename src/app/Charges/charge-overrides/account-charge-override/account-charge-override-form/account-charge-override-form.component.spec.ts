import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AccountChargeOverrideFormComponent } from './account-charge-override-form.component';

describe('AccountChargeOverrideFormComponent', () => {
  let component: AccountChargeOverrideFormComponent;
  let fixture: ComponentFixture<AccountChargeOverrideFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountChargeOverrideFormComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountChargeOverrideFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
