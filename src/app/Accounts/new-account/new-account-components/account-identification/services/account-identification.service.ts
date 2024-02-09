import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP_CONFIG, IAppConfig, Token_config, TokenInterface } from "src/app/model";

@Injectable({
    providedIn: 'root'
})

export class AccountIdentificationService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,

        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    getIdentificationTypes(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        return this.httpclient.get<any>(this.config.MockingAPIEndPoint + '/Contacts/1.0/IdentificationTypes', {
            headers: header,
            // params: reqParam
        });
    }

    getCustomerIdList(ContactCode): Observable<any> {

        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        return this.httpclient.get<any>(this.config.MockingAPIEndPoint + '/Contacts/1.0/Identifications/' + ContactCode, {
            headers: header,
            // params: reqParam
        });

    }

    createIdentification(reqParam, ContactCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        return this.httpclient.post<any>(this.config.MockingAPIEndPoint + '/Contacts/1.0/Identifications/' + ContactCode, reqParam, {
            headers: header,
            // params: reqParam
        });
    }

    updateIdentification(identification, reqParam, ContactCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        return this.httpclient.put<any>(this.config.MockingAPIEndPoint + '/Contacts/1.0/Identifications/' + identification, reqParam, {
            headers: header,
            // params: reqParam
        });
    }

    deleteIdentification(identification, ContactCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        return this.httpclient.delete<any>(this.config.MockingAPIEndPoint + '/Contacts/1.0/Identifications/' + identification, {
            headers: header,
            // params: reqParam
        });
    }

    getIdMandatoryRules(ContactCode): Observable<any> {

        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        return this.httpclient.get<any>(this.config.MockingAPIEndPoint + '/Contacts/1.0/IdentificationMandatoryRules/' + ContactCode, {
            headers: header
        });
    }

    getContactTypeIdRules(ContactType, SubTypeCode): Observable<any> {

        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('SubTypeCode', SubTypeCode)

        return this.httpclient.get<any>(this.config.MockingAPIEndPoint + '/Contacts/1.0/IdentificationMandatoryRules/ContactType/' + ContactType, {
            headers: header, params: reqParam
        });
    }

    getIdSufficient(ContactCode): Observable<any> {

        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        return this.httpclient.get<any>(this.config.MockingAPIEndPoint + '/Contacts/1.0/IdentificationSufficient/' + ContactCode, {
            headers: header
        });
    }

}