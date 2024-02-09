import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TerminationReverseComponent } from './termination-reverse.component';

describe('TerminationReverseComponent', () => {
  let component: TerminationReverseComponent;
  let fixture: ComponentFixture<TerminationReverseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminationReverseComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TerminationReverseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
