import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { APP_CONFIG, IAppConfig, TokenInterface, Token_config, } from 'src/app/model';
import { GetSitesResponse } from '../service-sites.page.type';

@Injectable({
    providedIn: 'root'
})

export class ServiceSitesService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,

        @Inject(Token_config) public tokens: TokenInterface,
    ) {

    }

    getSitesList(contactCode, reqData): Observable<GetSitesResponse> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json')

        const reqParam = new HttpParams({ fromObject: { ...reqData } })
            .append('api-version', '1.1')
            
        return this.httpclient.get<GetSitesResponse>(this.config.NewAPIEndPoint + '/ServiceLists/Contacts/' + contactCode + '/Sites', {
            headers: header, params: reqParam
        });
    }

}
