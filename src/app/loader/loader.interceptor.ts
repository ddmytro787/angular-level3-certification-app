import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import {finalize, Observable} from 'rxjs';
import {LoaderService} from './loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  constructor(private loader: LoaderService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const loaderMessageKey = 'loader-message';
    let modifiedReq = request.clone();

    if(modifiedReq.headers.has(loaderMessageKey)) {
      this.loader.setLoaderMessage(request.url, modifiedReq.headers.get(loaderMessageKey) || 'Loading...');
      modifiedReq = modifiedReq.clone({
        headers: modifiedReq.headers.delete(loaderMessageKey),
      });
    }

    return next.handle(modifiedReq).pipe(
      finalize(() => this.loader.removeLoaderMessage(modifiedReq.url)),
    );
  }
}
