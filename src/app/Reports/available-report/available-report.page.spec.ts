import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AvailableReportPage} from './available-report.page';

describe('AvailableReportPage', () => {
    let component: AvailableReportPage;
    let fixture: ComponentFixture<AvailableReportPage>;
    
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AvailableReportPage],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));
    
    beforeEach(() => {
        fixture = TestBed.createComponent(AvailableReportPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
