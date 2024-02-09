import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BillTransactionsDetailComponent } from './bill-transactions-detail.component';

describe('BillTransactionsDetailComponent', () => {
  let component: BillTransactionsDetailComponent;
  let fixture: ComponentFixture<BillTransactionsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillTransactionsDetailComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BillTransactionsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
