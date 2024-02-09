import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FinancialInvoiceFormComponent } from './financial-invoice-form.component';

describe('FinancialInvoiceFormComponent', () => {
  let component: FinancialInvoiceFormComponent;
  let fixture: ComponentFixture<FinancialInvoiceFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialInvoiceFormComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialInvoiceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
