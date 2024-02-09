import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ContactsCostCentersNewComponent } from './contacts-cost-centers-new.component';

describe('ContactsCostCentersNewComponent', () => {
  let component: ContactsCostCentersNewComponent;
  let fixture: ComponentFixture<ContactsCostCentersNewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactsCostCentersNewComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactsCostCentersNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
