import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FinancialTransactionReallocateComponent } from './financial-transaction-reallocate.component';

describe('FinancialTransactionReallocateComponent', () => {
  let component: FinancialTransactionReallocateComponent;
  let fixture: ComponentFixture<FinancialTransactionReallocateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialTransactionReallocateComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialTransactionReallocateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
