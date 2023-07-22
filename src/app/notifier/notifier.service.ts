import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class NotifierService {
  private _event$ = new ReplaySubject<number>(1);

  getNotifierEvent() {
    return this._event$.asObservable();
  }

  addNotifierEvent(res: HttpResponse<{ response_code: number; }>) {
    const resCode = res.body?.response_code || 0;
    this._setNotifierEvent(resCode);
  }

  removeEvent() {
    this._setNotifierEvent(0);
  }

  private _setNotifierEvent(eventCode: number) {
    this._event$.next(eventCode);
  }
}
