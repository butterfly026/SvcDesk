import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, ContactItemList, TokenInterface, Token_config, } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ServiceDetailService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,

        @Inject(Token_config) public tokens: TokenInterface,
    ) {

    }

    getServiceList(contactCode, serviceId): Observable<ContactItemList[]> {

        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('ContactCode', contactCode);

        return this.httpclient.get<ContactItemList[]>(this.config.APIEndPoint + 'ContactDetails.svc/rest/ContactDisplayDetails', {
            headers: header, params: reqParam
        });
    }

    ServiceItemList(reqData, serviceId): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.2');

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Services/' + serviceId + '/DisplayDetails', {
            headers: header, params: param
        });
    }

}
