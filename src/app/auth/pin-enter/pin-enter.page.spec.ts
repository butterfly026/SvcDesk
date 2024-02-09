import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PinEnterPage} from './pin-enter.page';

describe('PinEnterPage', () => {
    let component: PinEnterPage;
    let fixture: ComponentFixture<PinEnterPage>;
    
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PinEnterPage],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));
    
    beforeEach(() => {
        fixture = TestBed.createComponent(PinEnterPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
