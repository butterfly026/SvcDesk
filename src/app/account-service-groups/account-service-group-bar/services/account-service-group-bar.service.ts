import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, ServiceGroupBar, ServiceGroupBarReason, TokenInterface, Token_config, } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class AccountServiceGroupBarService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    BarTypeList(ServiceGroupId): Observable<ServiceGroupBar[]> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('ServiceGroupId', ServiceGroupId);
        // .set('ServiceGroupId', '22');

        return this.httpclient.get<ServiceGroupBar[]>(this.config.APIEndPoint + 'ServiceBarring.svc/rest/ServiceBarTypeDisplayList', {
            headers: header, params: reqParam
        });
    }

    BarReasonList(ServiceBarTypeId): Observable<ServiceGroupBarReason[]> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('ServiceBarTypeId', ServiceBarTypeId);

        return this.httpclient.get<ServiceGroupBarReason[]>(this.config.APIEndPoint + 'ServiceBarring.svc/rest/ServiceBarReasonDisplayList', {
            headers: header, params: reqParam
        });
    }

    ServiceGroupServiceBar(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        // const reqParam = new HttpParams()
        //     .set('ServiceBarTypeId', ServiceBarTypeId);

        return this.httpclient.post<any>(this.config.APIEndPoint + 'ServiceBarring.svc/rest/ServiceGroupServiceBar', reqData, {
            headers: header
        });
    }

}
