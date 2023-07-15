import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private _loaderMessages = new Map<string, string>();
  private _loaderMessages$ = new ReplaySubject<string[]>(1);

  getLoaderMessages() {
    return this._loaderMessages$.asObservable();
  }

  setLoaderMessage(key: string, message: string) {
    this._loaderMessages.set(key, message);
    this._setLoaderMessages();
  }

  removeLoaderMessage(key: string) {
    if(!this._loaderMessages.has(key)) return;
    this._loaderMessages.delete(key);
    this._setLoaderMessages();
  }

  private _setLoaderMessages() {
    this._loaderMessages$.next(Array.from(this._loaderMessages.values()));
  }
}
