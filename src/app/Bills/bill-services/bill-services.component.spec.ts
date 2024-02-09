import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BillServicesComponent } from './bill-services.component';

describe('BillServicesComponent', () => {
  let component: BillServicesComponent;
  let fixture: ComponentFixture<BillServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillServicesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BillServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
