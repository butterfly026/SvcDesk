import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ContactsCostCentersEditComponent } from './contacts-cost-centers-edit.component';

describe('ContactsCostCentersEditComponent', () => {
  let component: ContactsCostCentersEditComponent;
  let fixture: ComponentFixture<ContactsCostCentersEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactsCostCentersEditComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactsCostCentersEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
