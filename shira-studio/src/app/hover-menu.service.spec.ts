import { TestBed } from '@angular/core/testing';

import { HoverMenuService } from './hover-menu.service';

describe('HoverMenuService', () => {
  let service: HoverMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HoverMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
