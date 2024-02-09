import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from 'src/app/model';
import { ServiceListResponse } from './../../service-list/service-list.page.type';

@Injectable({
    providedIn: 'root'
})

export class ServiceGroupIdService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) private tokens: TokenInterface,
    ) {

    }

    getServiceListByGroup(contactCode, groupId, reqData): Observable<ServiceListResponse> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json')

        const reqParam = new HttpParams({ fromObject: { ...reqData } })
            .append('api-version', '1.1')

        return this.httpclient.get<ServiceListResponse>(this.config.NewAPIEndPoint + '/ServiceLists/Contacts/' + contactCode + '/ServiceGroups/' + groupId, {
            headers: header, params: reqParam
        });
    }

}
