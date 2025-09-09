import { TestBed } from '@angular/core/testing';

import { Content } from './content.service';

describe('Content', () => {
  let service: Content;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Content);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
