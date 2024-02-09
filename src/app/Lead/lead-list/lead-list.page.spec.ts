import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LeadListPage} from './lead-list.page';

describe('LeadListPage', () => {
    let component: LeadListPage;
    let fixture: ComponentFixture<LeadListPage>;
    
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LeadListPage],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));
    
    beforeEach(() => {
        fixture = TestBed.createComponent(LeadListPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
