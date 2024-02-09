import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import {
    APP_CONFIG, IAppConfig, 
    NewContactSearch, TokenInterface, Token_config
} from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ServiceDeskService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    getContactSearch(reqData): Observable<NewContactSearch> {

        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json')

        const reqParam = new HttpParams()
            .set('api-version', '1.0')
            .append('SkipRecords', reqData.SkipRecords)
            .append('TakeRecords', reqData.TakeRecords)
            .append('countRecords', 'Y')

        let reqBody: any = {
            SearchString: reqData.search,
        }
        if(reqData.AccountsOnly){
            reqBody.AccountsOnly = reqData.AccountsOnly;
        }
        return this.httpclient.post<NewContactSearch>(this.config.NewAPIEndPoint + '/search/Contacts', reqBody, {
            headers: header, params: reqParam
        });
    }

}
