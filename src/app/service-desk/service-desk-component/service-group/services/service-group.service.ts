import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { APP_CONFIG, IAppConfig, TokenInterface, Token_config, } from 'src/app/model';
import { GetServiceGroupsResponse } from '../service-group.page.type';
@Injectable({
    providedIn: 'root'
})

export class ServiceGroupService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,

        @Inject(Token_config) public tokens: TokenInterface,
    ) {

    }

    getServiceGroupList(contactCode, reqData): Observable<GetServiceGroupsResponse> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json')

        const reqParam = new HttpParams({ fromObject: { ...reqData } })
            .append('api-version', '1.1')

        return this.httpclient.get<GetServiceGroupsResponse>(this.config.NewAPIEndPoint + '/ServiceLists/Contacts/' + contactCode + '/ServiceGroups', {
            headers: header, params: reqParam
        });
    }

}
