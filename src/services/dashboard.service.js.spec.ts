import { TestBed } from '@angular/core/testing';

import { DashboardServiceJs } from './dashboard.service.js';

describe('DashboardServiceJs', () => {
  let service: DashboardServiceJs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardServiceJs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
