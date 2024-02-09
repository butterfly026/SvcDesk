import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ContactsCostCentersDetailsComponent } from './contacts-cost-centers-details.component';

describe('ContactsCostCentersDetailsComponent', () => {
  let component: ContactsCostCentersDetailsComponent;
  let fixture: ComponentFixture<ContactsCostCentersDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactsCostCentersDetailsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactsCostCentersDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
