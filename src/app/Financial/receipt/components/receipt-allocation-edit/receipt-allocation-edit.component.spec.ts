import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReceiptAllocationEditComponent } from './receipt-allocation-edit.component';

describe('ReceiptAllocationEditComponent', () => {
  let component: ReceiptAllocationEditComponent;
  let fixture: ComponentFixture<ReceiptAllocationEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptAllocationEditComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReceiptAllocationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
