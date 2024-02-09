import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from 'src/app/model';
import { ServiceListResponse } from 'src/app/service-desk/service-desk-component/service-list/service-list.page.type';
@Injectable({
    providedIn: 'root'
})

export class ServiceStatusIdService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) {

    }

    getServiceListByStatus(contactCode, statusId, reqData): Observable<ServiceListResponse> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json')

        const reqParam = new HttpParams({ fromObject: { ...reqData } })
            .append('api-version', '1.1')

        return this.httpclient.get<ServiceListResponse>(this.config.NewAPIEndPoint + '/ServiceLists/Contacts/' + contactCode + '/Statuses/' + statusId, {
            headers: header, params: reqParam
        });
    }

}
