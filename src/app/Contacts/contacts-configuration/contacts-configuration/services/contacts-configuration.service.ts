import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APP_CONFIG, IAppConfig,  ContactsConfigurationItem, TokenInterface, Token_config } from 'src/app/model';

import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class ContactsConfigurationService {

    httpHeaders: HttpHeaders = new HttpHeaders();
    httpParams: HttpParams = new HttpParams();

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        
        @Inject(Token_config) public tokens: TokenInterface,
    ) {
    }

    getConfiguratin(): Observable<ContactsConfigurationItem[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/ContactDetails/Configuration', {
            headers: header, params: param
        });
    }

    updateConfiguratin(contactsKey, reqBody): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            // .set('Key', contactsKey)
            .append('api-version', '1.0');

        return this.httpclient.put<any>(this.config.NewAPIEndPoint + '/ContactDetails/Configuration/Key:' + contactsKey, reqBody, {
            headers: header, params: param
        });
    }

}
