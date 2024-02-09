import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PermissionDeniedPage} from './permission-denied.page';

describe('PermissionDeniedPage', () => {
    let component: PermissionDeniedPage;
    let fixture: ComponentFixture<PermissionDeniedPage>;
    
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PermissionDeniedPage],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));
    
    beforeEach(() => {
        fixture = TestBed.createComponent(PermissionDeniedPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
