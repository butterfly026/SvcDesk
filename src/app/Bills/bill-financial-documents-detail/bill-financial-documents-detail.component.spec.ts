import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BillFinancialDocumentsDetailComponent } from './bill-financial-documents-detail.component';

describe('BillFinancialDocumentsDetailComponent', () => {
  let component: BillFinancialDocumentsDetailComponent;
  let fixture: ComponentFixture<BillFinancialDocumentsDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BillFinancialDocumentsDetailComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BillFinancialDocumentsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
