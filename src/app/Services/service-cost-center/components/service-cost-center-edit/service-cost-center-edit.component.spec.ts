import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ServiceCostCenterEditComponent } from './service-cost-center-edit.component';

describe('ServiceCostCenterEditComponent', () => {
  let component: ServiceCostCenterEditComponent;
  let fixture: ComponentFixture<ServiceCostCenterEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceCostCenterEditComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceCostCenterEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
