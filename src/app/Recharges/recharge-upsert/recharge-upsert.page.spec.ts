import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RechargeUpsertPage} from './recharge-upsert.page';

describe('RechargeUpsertPage', () => {
    let component: RechargeUpsertPage;
    let fixture: ComponentFixture<RechargeUpsertPage>;
    
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RechargeUpsertPage],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));
    
    beforeEach(() => {
        fixture = TestBed.createComponent(RechargeUpsertPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
