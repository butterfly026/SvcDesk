import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BillPdfPage } from './bill-pdf.page';

describe('BillPdfPage', () => {
  let component: BillPdfPage;
  let fixture: ComponentFixture<BillPdfPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillPdfPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BillPdfPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
