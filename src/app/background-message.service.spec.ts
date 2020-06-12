import { TestBed } from '@angular/core/testing';

import { BackgroundMessageService } from './background-message.service';

describe('BackgroundMessageService', () => {
  let service: BackgroundMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackgroundMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
