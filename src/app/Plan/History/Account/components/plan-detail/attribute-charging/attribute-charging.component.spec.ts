import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AttributeChargingComponent} from './attribute-charging.component';

describe('AttributeChargingComponent', () => {
    let component: AttributeChargingComponent;
    let fixture: ComponentFixture<AttributeChargingComponent>;
    
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AttributeChargingComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));
    
    beforeEach(() => {
        fixture = TestBed.createComponent(AttributeChargingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
