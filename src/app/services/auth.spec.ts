// src/app/services/auth.service.spec.ts

import { TestBed } from '@angular/core/testing';
// UBAH 'Auth' menjadi 'AuthService' di sini
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    // UBAH 'Auth' menjadi 'AuthService' di sini juga
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});