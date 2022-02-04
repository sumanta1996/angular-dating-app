import { TestBed } from '@angular/core/testing';

import { ToasterNotifyService } from './toaster-notify.service';

describe('ToasterNotifyService', () => {
  let service: ToasterNotifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToasterNotifyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
