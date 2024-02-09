import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config, } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class PartnerService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    getAllUsers(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('SkipRecords', reqData.SkipRecords)
            .append('TakeRecords', reqData.TakeRecords)
            .append('CountRecords', reqData.CountRecords)
            .append('SearchString', '*' + reqData.SearchString + '*')

        return this.httpclient.get<any>(this.config.MockingAPIEndPoint + '/Contacts/1.0/ChannelPartners/Users', {
            headers: header,
            params: reqParam
        });
    }

    createUser(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        return this.httpclient.post<any>(this.config.MockingAPIEndPoint + '/Contacts/1.0/ChannelPartners/Users', reqData, {
            headers: header
        });
    }

    getUserDetail(userId): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        return this.httpclient.get<any>(this.config.MockingAPIEndPoint + '/Contacts/1.0/ChannelPartners/Users/' + userId, {
            headers: header,
        });
    }

    updateUser(reqData, userId): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        return this.httpclient.put<any>(this.config.MockingAPIEndPoint + '/Contacts/1.0/ChannelPartners/Users/' + userId, reqData, {
            headers: header,
        });

    }
}
