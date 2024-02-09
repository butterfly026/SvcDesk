import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ContactsCostCentersListComponent } from './contacts-cost-centers-list.component';

describe('ContactsCostCentersListComponent', () => {
    let component: ContactsCostCentersListComponent;
    let fixture: ComponentFixture<ContactsCostCentersListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ContactsCostCentersListComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(ContactsCostCentersListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
