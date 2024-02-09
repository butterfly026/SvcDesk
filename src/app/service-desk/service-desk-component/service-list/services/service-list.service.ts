import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { APP_CONFIG, IAppConfig, TokenInterface, Token_config, } from 'src/app/model';
import { ServiceListResponse } from '../service-list.page.type';

@Injectable({
    providedIn: 'root'
})

export class ServiceListService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,

        @Inject(Token_config) public tokens: TokenInterface,
    ) {

    }

    getServiceList(contactCode, reqData): Observable<ServiceListResponse> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json')

        const reqParam = new HttpParams({ fromObject: { ...reqData } })
            .append('api-version', '1.1')

        return this.httpclient.get<ServiceListResponse>(this.config.NewAPIEndPoint + '/ServiceLists/Contacts/' + contactCode, {
            headers: header, params: reqParam
        });
    }

}
