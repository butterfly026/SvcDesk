import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DepositStatusReasonsComponent } from './deposit-status-reasons.component';

describe('DepositStatusReasonsComponent', () => {
  let component: DepositStatusReasonsComponent;
  let fixture: ComponentFixture<DepositStatusReasonsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DepositStatusReasonsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DepositStatusReasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
