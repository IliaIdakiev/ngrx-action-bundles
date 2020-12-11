import { TestBed } from '@angular/core/testing';

import { Connect } from './ngrx-action-bundles.service';

describe('NgrxActionBundlesService', () => {
  let service: Connect;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Connect);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
