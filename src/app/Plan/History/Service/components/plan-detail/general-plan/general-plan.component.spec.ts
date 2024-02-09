import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GeneralPlanComponent} from './general-plan.component';

describe('GeneralPlanComponent', () => {
    let component: GeneralPlanComponent;
    let fixture: ComponentFixture<GeneralPlanComponent>;
    
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GeneralPlanComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));
    
    beforeEach(() => {
        fixture = TestBed.createComponent(GeneralPlanComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
