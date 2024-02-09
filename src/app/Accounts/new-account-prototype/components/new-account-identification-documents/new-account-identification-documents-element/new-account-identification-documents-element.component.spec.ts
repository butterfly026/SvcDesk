import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewAccountIdentificationDocumentsElementComponent } from './new-account-identification-documents-element.component';

describe('NewAccountIdentificationDocumentsElementComponent', () => {
  let component: NewAccountIdentificationDocumentsElementComponent;
  let fixture: ComponentFixture<NewAccountIdentificationDocumentsElementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAccountIdentificationDocumentsElementComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewAccountIdentificationDocumentsElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
