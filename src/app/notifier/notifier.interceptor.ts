import { Injectable } from '@angular/core';
import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { tap } from 'rxjs';
import { NotifierService } from './notifier.service';

@Injectable()
export class NotifierInterceptor implements HttpInterceptor {
  constructor(private notifier: NotifierService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler) {
    return next.handle(request).pipe(
      tap(event => {
        if (!(event instanceof HttpResponse)) return;
        this.notifier.addNotifierEvent(event);
      }),
    );
  }
}
