import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config, } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ServiceAttributeService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    getAllAttributes(ServiceType): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Configurations/ServiceDisplayAttributes/ServiceType/' + ServiceType, {
            headers: header, params: param
        });
    }

    updateAttribute(reqData, Id, serviceTypeId): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.put<any>(this.config.NewAPIEndPoint + '/Configurations/ServiceDisplayAttributes/Id/' + Id + '/ServiceTypeId/' + serviceTypeId, reqData, {
            headers: header, params: param
        });
    }

    getServiceTypes(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Configurations/ServiceTypes', {
            headers: header, params: param
        });
    }
}
