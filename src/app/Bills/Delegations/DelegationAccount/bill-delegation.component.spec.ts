import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BillDelegationComponent } from './bill-delegation.component';

describe('BillDelegationComponent', () => {
  let component: BillDelegationComponent;
  let fixture: ComponentFixture<BillDelegationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillDelegationComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BillDelegationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
