import { TestBed, inject } from '@angular/core/testing';

import { Services\TwitterService } from './services\twitter.service';

describe('Services\TwitterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Services\TwitterService]
    });
  });

  it('should be created', inject([Services\TwitterService], (service: Services\TwitterService) => {
    expect(service).toBeTruthy();
  }));
});
