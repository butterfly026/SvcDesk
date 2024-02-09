import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BillChargesComponent } from './bill-charges.component';

describe('BillChargesComponent', () => {
  let component: BillChargesComponent;
  let fixture: ComponentFixture<BillChargesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillChargesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BillChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
