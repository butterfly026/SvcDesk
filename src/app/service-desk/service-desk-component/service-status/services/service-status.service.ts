import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { APP_CONFIG, IAppConfig, TokenInterface, Token_config, } from 'src/app/model';
import { GetStatusNodesResponse } from '../service-status.page.type';

@Injectable({
    providedIn: 'root'
})

export class ServiceStatusService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,

        @Inject(Token_config) public tokens: TokenInterface,
    ) {

    }

    getServiceStatus(contactCode, reqData): Observable<GetStatusNodesResponse> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json')

        const reqParam = new HttpParams({ fromObject: { ...reqData } })
            .append('api-version', '1.1')

        return this.httpclient.get<GetStatusNodesResponse>(this.config.NewAPIEndPoint + '/ServiceLists/Contacts/' + contactCode + '/Statuses', {
            headers: header, params: reqParam
        });
    }

}
