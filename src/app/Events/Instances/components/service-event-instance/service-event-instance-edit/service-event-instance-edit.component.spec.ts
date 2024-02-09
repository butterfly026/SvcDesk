import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ServiceEventInstanceEdit } from './service-event-instance-edit.component';

describe('ServiceEventInstanceEdit', () => {
  let component: ServiceEventInstanceEdit;
  let fixture: ComponentFixture<ServiceEventInstanceEdit>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceEventInstanceEdit ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceEventInstanceEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
