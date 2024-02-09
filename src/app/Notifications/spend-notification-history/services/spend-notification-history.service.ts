import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig,  NotificationHistoryItem, TokenInterface, Token_config,  } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class SpendNotificationHistoryService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    getHistory(): Observable<NotificationHistoryItem[]> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('ContactCode', this.tokens.UserCode);

        return this.httpclient.get<NotificationHistoryItem[]>('assets/fakeDB/notificationHistory.json', {
            headers: header, params: reqParam
        });
    }

}
