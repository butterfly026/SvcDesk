import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FinancialChargesInvoiceNewComponent } from './financial-charges-invoice-new.component';

describe('FinancialChargesInvoiceNewComponent', () => {
  let component: FinancialChargesInvoiceNewComponent;
  let fixture: ComponentFixture<FinancialChargesInvoiceNewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialChargesInvoiceNewComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialChargesInvoiceNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
