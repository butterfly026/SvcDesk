import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FinancialDebitAdjustmentComponent } from './financial-debit-adjustment.component';

describe('FinancialDebitAdjustmentComponent', () => {
  let component: FinancialDebitAdjustmentComponent;
  let fixture: ComponentFixture<FinancialDebitAdjustmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialDebitAdjustmentComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialDebitAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
