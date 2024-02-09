import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APP_CONFIG, IAppConfig,  ServiceGroup, Token_config, TokenInterface } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class AccountServiceGroupControlService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }


    ServiceGroupListContactCode(ContactCode): Observable<ServiceGroup[]> {

        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.get<ServiceGroup[]>(this.config.NewAPIEndPoint + '/ServiceGroups/ContactCode:' + ContactCode, {
            headers: header, params: param
        });
    }

    ServiceGroupListDelete(ServiceGroupId): Observable<ServiceGroup[]> {

        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.delete<ServiceGroup[]>(this.config.NewAPIEndPoint + '/ServiceGroups/ServiceGroupId:' + ServiceGroupId, {
            headers: header, params: param
        });
    }

}
