import { TestBed } from '@angular/core/testing';

import { NotifierInterceptor } from './notifier.interceptor';

describe('NotifierInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      NotifierInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: NotifierInterceptor = TestBed.inject(NotifierInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
