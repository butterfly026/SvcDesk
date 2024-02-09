import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UnbarComponent } from './unbar.component';

describe('UnbarComponent', () => {
  let component: UnbarComponent;
  let fixture: ComponentFixture<UnbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnbarComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UnbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
