import { TestBed } from '@angular/core/testing';

import { SizeDetectorService } from './size-detector.service';

describe('SizeDetectorService', () => {
  let service: SizeDetectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SizeDetectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
