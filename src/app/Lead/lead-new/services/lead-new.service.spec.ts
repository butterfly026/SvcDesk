import {TestBed} from '@angular/core/testing';

import {LeadNewService} from './lead-new.service';

describe('LeadNewService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));
    
    it('should be created', () => {
        const service: LeadNewService = TestBed.get(LeadNewService);
        expect(service).toBeTruthy();
    });
});
