import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BillDisputesComponent } from './bill-disputes.component';

describe('BillDisputesComponent', () => {
  let component: BillDisputesComponent;
  let fixture: ComponentFixture<BillDisputesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillDisputesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BillDisputesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
