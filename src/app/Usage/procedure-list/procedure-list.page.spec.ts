import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProcedureListPage} from './procedure-list.page';

describe('ProcedureListPage', () => {
    let component: ProcedureListPage;
    let fixture: ComponentFixture<ProcedureListPage>;
    
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ProcedureListPage],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));
    
    beforeEach(() => {
        fixture = TestBed.createComponent(ProcedureListPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
