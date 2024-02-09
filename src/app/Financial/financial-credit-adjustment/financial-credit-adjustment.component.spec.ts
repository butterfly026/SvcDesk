import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FinancialCreditAdjustmentComponent } from './financial-credit-adjustment.component';

describe('FinancialCreditAdjustmentComponent', () => {
  let component: FinancialCreditAdjustmentComponent;
  let fixture: ComponentFixture<FinancialCreditAdjustmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialCreditAdjustmentComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialCreditAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
