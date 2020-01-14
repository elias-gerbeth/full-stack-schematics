import { TestBed } from '@angular/core/testing';

import { AmplifyFetchService } from './amplify-fetch.service';

describe('FetchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AmplifyFetchService = TestBed.get(AmplifyFetchService);
    expect(service).toBeTruthy();
  });
});
