import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config,  } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class IdentificationService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    getIdentificationTypes(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.1');

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Contacts/IdentificationTypes', {
            headers: header,
            params: reqParam
        });
    }

    getCustomerIdList(ContactCode): Observable<any> {

        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.1');

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Contacts/' + ContactCode + '/Identifications', {
            headers: header,
            params: reqParam
        });
    }

    createIdentification(reqData, ContactCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.1');
        return this.httpclient.post<any>(this.config.NewAPIEndPoint + '/Contacts/' + ContactCode + '/Identifications', reqData, {
            headers: header,
            params: reqParam
        });
    }

    updateIdentification(identification, reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.1');
        return this.httpclient.patch<any>(this.config.NewAPIEndPoint + '/Contacts/Identifications/' + identification, reqData, {
            headers: header,
            params: reqParam
        });
    }

    deleteIdentification(identification): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));
        const reqParam = new HttpParams()
            .set('api-version', '1.1');
        return this.httpclient.delete<any>(this.config.NewAPIEndPoint + '/Contacts/Identifications/' + identification, {
            headers: header,
            params: reqParam
        });
    }

    getIdMandatoryRules(ContactCode): Observable<any> {

        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.1');
        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Contacts/' + ContactCode + '/IdentificationMandatoryRules', {
            headers: header,
            params: reqParam
        });
    }

    getContactTypeIdRules(ContactType): Observable<any> {

        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.1');

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Contacts/Identifications/ContactTypes/' + ContactType + 
            '/IdentificationMandatoryRules', {
            headers: header, params: reqParam
        });
    }

    getIdSufficient(ContactCode, Role): Observable<any> {

        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.1');
        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Contacts/' + ContactCode + '/Role/' + Role + '/IdentificationSufficient', {
            headers: header, params: reqParam
        });
    }

}
