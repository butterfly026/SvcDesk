import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AccountNewCostCentersComponent } from './account-new-cost-centers.component';

describe('AccountNewCostCentersComponent', () => {
  let component: AccountNewCostCentersComponent;
  let fixture: ComponentFixture<AccountNewCostCentersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountNewCostCentersComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountNewCostCentersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
