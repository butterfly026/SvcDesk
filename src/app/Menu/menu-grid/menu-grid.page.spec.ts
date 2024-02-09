import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MenuGridPage} from './menu-grid.page';

describe('MenuGridPage', () => {
    let component: MenuGridPage;
    let fixture: ComponentFixture<MenuGridPage>;
    
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MenuGridPage],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));
    
    beforeEach(() => {
        fixture = TestBed.createComponent(MenuGridPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
