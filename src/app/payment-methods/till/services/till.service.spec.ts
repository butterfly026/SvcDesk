import { TestBed } from '@angular/core/testing';

import { TillService } from './till.service';

describe('TillService', () => {
  let service: TillService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
