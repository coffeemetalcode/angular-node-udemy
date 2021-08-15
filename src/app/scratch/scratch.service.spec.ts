import { TestBed } from '@angular/core/testing';

import { ScratchService } from './scratch.service';

describe('ScratchService', () => {
  let service: ScratchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScratchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
