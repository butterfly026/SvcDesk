import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ServiceDocumentChildComponent } from './service-document-child.component';

describe('ServiceDocumentChildComponent', () => {
  let component: ServiceDocumentChildComponent;
  let fixture: ComponentFixture<ServiceDocumentChildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceDocumentChildComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceDocumentChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
