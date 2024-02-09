import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AuthorisedAccountsListsComponent } from './authorised-accounts-lists.component';

describe('AuthorisedAccountsListsComponent', () => {
  let component: AuthorisedAccountsListsComponent;
  let fixture: ComponentFixture<AuthorisedAccountsListsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorisedAccountsListsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorisedAccountsListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
