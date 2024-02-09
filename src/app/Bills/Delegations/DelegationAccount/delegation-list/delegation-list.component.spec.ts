import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DelegationListComponent } from './delegation-list.component';

describe('DelegationListComponent', () => {
  let component: DelegationListComponent;
  let fixture: ComponentFixture<DelegationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DelegationListComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DelegationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
