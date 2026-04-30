import { TestBed } from '@angular/core/testing';

import { Taller } from './taller';

describe('Taller', () => {
  let service: Taller;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Taller);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
