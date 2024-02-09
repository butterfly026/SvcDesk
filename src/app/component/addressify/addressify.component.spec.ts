import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddressifyComponent } from './addressify.component';

describe('AddressifyComponent', () => {
  let component: AddressifyComponent;
  let fixture: ComponentFixture<AddressifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressifyComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddressifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
