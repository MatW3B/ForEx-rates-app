import { TestBed } from '@angular/core/testing';

import { WalutaService } from './waluta.service';

describe('WalutaService', () => {
  let service: WalutaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WalutaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
