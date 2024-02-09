import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BillEmailComponent } from './bill-email.component';

describe('BillEmailComponent', () => {
  let component: BillEmailComponent;
  let fixture: ComponentFixture<BillEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillEmailComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BillEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
