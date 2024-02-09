import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PaymentMethodsNewCreditCardComponent } from './payment-methods-new-credit-card.component';

describe('PaymentMethodsNewCreditCardComponent', () => {
  let component: PaymentMethodsNewCreditCardComponent;
  let fixture: ComponentFixture<PaymentMethodsNewCreditCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentMethodsNewCreditCardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentMethodsNewCreditCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
