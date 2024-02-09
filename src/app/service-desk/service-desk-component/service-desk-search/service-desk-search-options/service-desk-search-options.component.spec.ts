import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ServiceDeskSearchOptionsComponent } from './service-desk-search-options.component';

describe('ServiceDeskSearchOptionsComponent', () => {
  let component: ServiceDeskSearchOptionsComponent;
  let fixture: ComponentFixture<ServiceDeskSearchOptionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceDeskSearchOptionsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceDeskSearchOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
