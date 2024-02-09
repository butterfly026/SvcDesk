import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ServiceNewAttributesElementComponent } from './service-new-attributes-element.component';

describe('ServiceNewAttributesElementComponent', () => {
  let component: ServiceNewAttributesElementComponent;
  let fixture: ComponentFixture<ServiceNewAttributesElementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceNewAttributesElementComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceNewAttributesElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
