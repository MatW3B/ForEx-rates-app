import { TestBed } from '@angular/core/testing';

import { FormWalutaService } from './form-waluta.service';

describe('FormWalutaService', () => {
  let service: FormWalutaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormWalutaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
