import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AccountChargeDefinitionComponent } from './account-charge-definition.component';

describe('AccountChargeDefinitionComponent', () => {
  let component: AccountChargeDefinitionComponent;
  let fixture: ComponentFixture<AccountChargeDefinitionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountChargeDefinitionComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountChargeDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
