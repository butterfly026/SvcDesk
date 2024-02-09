import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RechargeStatusListPage} from './recharge-status-list.page';

describe('RechargeStatusListPage', () => {
    let component: RechargeStatusListPage;
    let fixture: ComponentFixture<RechargeStatusListPage>;
    
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RechargeStatusListPage],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));
    
    beforeEach(() => {
        fixture = TestBed.createComponent(RechargeStatusListPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
