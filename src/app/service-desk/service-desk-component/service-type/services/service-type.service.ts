import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { APP_CONFIG, IAppConfig, TokenInterface, Token_config, } from 'src/app/model';
import { GetServiceTypesResponse } from '../service-type.page.type';

@Injectable({
    providedIn: 'root'
})

export class ServiceTypeService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,

        @Inject(Token_config) public tokens: TokenInterface,
    ) {

    }

    getServiceListType(ContactCode, reqData): Observable<GetServiceTypesResponse> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json')

        const reqParam = new HttpParams({ fromObject: { ...reqData } })
            .append('api-version', '1.1')

        return this.httpclient.get<GetServiceTypesResponse>(this.config.NewAPIEndPoint + '/ServiceLists/Contacts/' + ContactCode + '/ServiceTypes', {
            headers: header, params: reqParam
        });
    }

}
