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
    this._setNotifierEvents(resCode);
  }

  removeEvent() {
    this._setNotifierEvents(0);
  }

  private _setNotifierEvents(eventCode: number) {
    this._event$.next(eventCode);
  }
}
