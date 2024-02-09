import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PaymentMethodsNewBankAccountComponent } from './payment-methods-new-bank-account.component';

describe('PaymentMethodsNewBankAccountComponent', () => {
  let component: PaymentMethodsNewBankAccountComponent;
  let fixture: ComponentFixture<PaymentMethodsNewBankAccountComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentMethodsNewBankAccountComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentMethodsNewBankAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
