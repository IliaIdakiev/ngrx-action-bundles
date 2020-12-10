import { TestBed } from '@angular/core/testing';

import { NgrxActionBundlesService } from './ngrx-action-bundles.service';

describe('NgrxActionBundlesService', () => {
  let service: NgrxActionBundlesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgrxActionBundlesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
