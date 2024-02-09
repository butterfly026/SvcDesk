import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config,  } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class SMSListService {

    constructor(
        public httpClient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) {

    }

    getSmsSendList(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')
            .append('SearchString', '*' + reqData.SearchString + '*')
            .append('SkipRecords', reqData.SkipRecords)
            .append('TakeRecords', reqData.TakeRecords)
            .append('CountRecords', 'Y')

        return this.httpClient.get<any>(this.config.MockingAPIEndPoint + '/Messages/1.0/SMSs/ContactCode/' + reqData.ContactCode, {
            headers: header, params: param
        });
    }

}
