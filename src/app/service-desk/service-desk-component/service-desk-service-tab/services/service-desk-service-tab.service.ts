import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, ServiceList, ContactItemList, TokenInterface, Token_config } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ServiceDeskServiceTabService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
        
    ) {

    }

    getServiceList(contactCode, serviceId): Observable<ServiceList[]> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('ContactCode', contactCode)
            .append('ServiceId', serviceId);

        return this.httpclient.get<ServiceList[]>('assets/fakeDB/serviceList.json', {
            headers: header, params: reqParam
        });
    }


    getContactItemList(reqData): Observable<ContactItemList[]> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('ContactCode', reqData);

        return this.httpclient.get<ContactItemList[]>(this.config.APIEndPoint + 'ContactDetails.svc/rest/ContactDisplayDetails', {
            headers: header, params: reqParam
        });
    }

}
