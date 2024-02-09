import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChannelPartnersAutocompleteComponent } from './channel-partners-autocomplete.component';

describe('ChannelPartnersAutocompleteComponent', () => {
  let component: ChannelPartnersAutocompleteComponent;
  let fixture: ComponentFixture<ChannelPartnersAutocompleteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelPartnersAutocompleteComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChannelPartnersAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
