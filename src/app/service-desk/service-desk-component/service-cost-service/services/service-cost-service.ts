import { ServiceListResponse } from './../../service-list/service-list.page.type';
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ServiceCostIdService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) {

    }

    getServiceListByCost(contactCode, serviceId, reqData): Observable<ServiceListResponse> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json')

        const reqParam = new HttpParams({ fromObject: { ...reqData } })
            .append('api-version', '1.1')

        return this.httpclient.get<ServiceListResponse>(this.config.NewAPIEndPoint + '/ServiceLists/Contacts/' + contactCode + '/CostCenters/' + serviceId, {
            headers: header, params: reqParam
        });
    }

}
