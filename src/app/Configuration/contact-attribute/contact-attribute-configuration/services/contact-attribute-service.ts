import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config, } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ContactAttributeService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    getAllAttributes(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        // const reqParam = new HttpParams()
        //     .set('SkipRecords', reqData.SkipRecords)
        //     .append('TakeRecords', reqData.TakeRecords)
        //     .append('CountRecords', reqData.CountRecords)
        //     .append('SearchString', '*' + reqData.SearchString + '*')

        const reqParam = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Configurations/ContactDisplayAttributes', {
            headers: header, params: reqParam
        });
    }

    updateAttribute(reqData, attributeId): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.put<any>(this.config.NewAPIEndPoint + '/Configurations/ContactDisplayAttributes/Id/' + attributeId, reqData, {
            headers: header, params: reqParam
        });
    }
}
