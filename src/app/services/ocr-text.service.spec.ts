import { TestBed, inject } from '@angular/core/testing';

import { OcrTextService } from './ocr-text.service';

describe('OcrTextService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OcrTextService]
    });
  });

  it('should be created', inject([OcrTextService], (service: OcrTextService) => {
    expect(service).toBeTruthy();
  }));
});
