import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FinancialTransactionEditStatusComponent } from './financial-transaction-edit-status.component';

describe('FinancialTransactionEditStatusComponent', () => {
  let component: FinancialTransactionEditStatusComponent;
  let fixture: ComponentFixture<FinancialTransactionEditStatusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialTransactionEditStatusComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialTransactionEditStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
