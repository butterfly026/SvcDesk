import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FinancialAutoAllocateAllComponent } from './financial-auto-allocate-all.component';

describe('FinancialAutoAllocateAllComponent', () => {
  let component: FinancialAutoAllocateAllComponent;
  let fixture: ComponentFixture<FinancialAutoAllocateAllComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialAutoAllocateAllComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialAutoAllocateAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
