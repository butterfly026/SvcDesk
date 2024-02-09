import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RoleSelectPage} from './role-select.page';

describe('RoleSelectPage', () => {
    let component: RoleSelectPage;
    let fixture: ComponentFixture<RoleSelectPage>;
    
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RoleSelectPage],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));
    
    beforeEach(() => {
        fixture = TestBed.createComponent(RoleSelectPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
