import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
    APP_CONFIG, IAppConfig,
     NewContactSearch,
     TokenInterface,
     Token_config,
} from 'src/app/model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ServiceDeskSearchService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        
        @Inject(Token_config) public tokens: TokenInterface,
    ) {
    }

    ContactSearchAdvanced(queryData, bodyData): Observable<NewContactSearch> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json')

        const query = new HttpParams()
            .set('SkipRecords', queryData.SkipRecords)
            .append('TakeRecords', queryData.TakeRecords)
            .append('countRecords', 'Y')
            .append('api-version', '1.1');

        return this.httpclient.post<NewContactSearch>(this.config.NewAPIEndPoint + '/search/Search/ContactSearchAdvanced', bodyData, {
            headers: header, params: query
        });
    }

    savePersonalisationConfig(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json')

        const query = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.put<any>(this.config.NewAPIEndPoint + '/Search/Personalisation/' + this.tokens.ContactCode, reqData, {
            headers: header, params: query
        });
    }

    getPersonalisationConfig(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json')

        const query = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Search/Personalisation/' + this.tokens.ContactCode, {
            headers: header, params: query
        });
    }

}
