import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChargesComponent } from './charges.component';

describe('ChargesComponent', () => {
  let component: ChargesComponent;
  let fixture: ComponentFixture<ChargesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
