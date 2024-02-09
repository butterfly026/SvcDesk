import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FaEnterPage} from './fa-enter.page';

describe('FaEnterPage', () => {
    let component: FaEnterPage;
    let fixture: ComponentFixture<FaEnterPage>;
    
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FaEnterPage],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));
    
    beforeEach(() => {
        fixture = TestBed.createComponent(FaEnterPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
