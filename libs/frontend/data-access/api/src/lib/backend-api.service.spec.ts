import { TestBed } from '@angular/core/testing';

import { DataAccessBackendApiService } from './backend-api.service';

describe('BackendService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataAccessBackendApiService = TestBed.get(DataAccessBackendApiService);
    expect(service).toBeTruthy();
  });
});
