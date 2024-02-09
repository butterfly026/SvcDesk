import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AccountChargeOverrideComponent } from './account-charge-override.component';

describe('AccountChargeOverrideComponent', () => {
  let component: AccountChargeOverrideComponent;
  let fixture: ComponentFixture<AccountChargeOverrideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountChargeOverrideComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountChargeOverrideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
