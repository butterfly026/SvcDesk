import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddContractPage } from './add-contract.page';

describe('AddContractPage', () => {
  let component: AddContractPage;
  let fixture: ComponentFixture<AddContractPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddContractPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddContractPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
