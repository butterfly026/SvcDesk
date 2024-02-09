import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewAccountIdentificationDocumentsComponent } from './new-account-identification-documents.component';

describe('NewAccountIdentificationDocumentsComponent', () => {
  let component: NewAccountIdentificationDocumentsComponent;
  let fixture: ComponentFixture<NewAccountIdentificationDocumentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAccountIdentificationDocumentsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewAccountIdentificationDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
