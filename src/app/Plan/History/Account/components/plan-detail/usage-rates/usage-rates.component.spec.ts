import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UsageRatesComponent} from './usage-rates.component';

describe('UsageRatesComponent', () => {
    let component: UsageRatesComponent;
    let fixture: ComponentFixture<UsageRatesComponent>;
    
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UsageRatesComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));
    
    beforeEach(() => {
        fixture = TestBed.createComponent(UsageRatesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
