import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BusinessUnitSelectPage} from './business-unit-select.page';

describe('BusinessUnitSelectPage', () => {
    let component: BusinessUnitSelectPage;
    let fixture: ComponentFixture<BusinessUnitSelectPage>;
    
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BusinessUnitSelectPage],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));
    
    beforeEach(() => {
        fixture = TestBed.createComponent(BusinessUnitSelectPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
