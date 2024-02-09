import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StripePagePage } from './stripe-page.page';

describe('StripePagePage', () => {
  let component: StripePagePage;
  let fixture: ComponentFixture<StripePagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StripePagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StripePagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
