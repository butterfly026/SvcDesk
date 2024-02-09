import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, retry } from 'rxjs/operators';

declare const window: any;

@Injectable({ providedIn: 'root' })
export class OnlineOfflineService {

    private internalConnectionChanged = new Subject<boolean>();

    get connectionChanged() {
        return this.internalConnectionChanged.asObservable();
    }

    static get isOnline() {
        return !!window.navigator.onLine;
    }

    constructor(
        private httpClient: HttpClient
    ) {
        window.addEventListener('online', () => this.updateOnlineStatus(), false);
        window.addEventListener('offline', () => this.updateOnlineStatus(), false);
    }


    private updateOnlineStatus() {
        this.internalConnectionChanged.next(window.navigator.onLine);
    };


    public retryInternetConnectivity = (): Observable<any> =>
        this.httpClient.get<any>('assets/imgs/SSImage/background.jpg')
            .pipe(
                map(res => res)
            )


}
