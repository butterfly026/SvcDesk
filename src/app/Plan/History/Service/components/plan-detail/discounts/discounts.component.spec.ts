import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DiscountsComponent} from './discounts.component';

describe('DiscountsComponent', () => {
    let component: DiscountsComponent;
    let fixture: ComponentFixture<DiscountsComponent>;
    
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DiscountsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));
    
    beforeEach(() => {
        fixture = TestBed.createComponent(DiscountsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
