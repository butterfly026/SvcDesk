import {TestBed} from '@angular/core/testing';

import {AvailableReportService} from './available-report.service';

describe('AvailableReportService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));
    
    it('should be created', () => {
        const service: AvailableReportService = TestBed.get(AvailableReportService);
        expect(service).toBeTruthy();
    });
});
