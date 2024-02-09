import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FinancialExternalTransactionsComponent } from './financial-external-transactions.component';

describe('FinancialExternalTransactionsComponent', () => {
  let component: FinancialExternalTransactionsComponent;
  let fixture: ComponentFixture<FinancialExternalTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialExternalTransactionsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialExternalTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
