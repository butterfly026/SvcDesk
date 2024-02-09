import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig,  CustomerEmailItem, ContactEmailUsage, ContactEmailHistory, ContactIdentificationType, ContactIdentificationMandatoryRules, ContactIdentificationUpdate, ContactIdentification, TokenInterface, Token_config,  } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ContactsIdentificationService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    ContactIdentificationTypes(): Observable<ContactIdentificationType[]> {

        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken))

        return this.httpclient.get<ContactIdentificationType[]>(this.config.MockingAPIEndPoint + 'ContactIdentification/1.0.0/ContactIdentificationTypes', {
            headers: header
        });
    }

    ContactIdenticationMandatoryRules(): Observable<ContactIdentificationMandatoryRules> {

        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('ContactCode', this.tokens.UserCode);

        return this.httpclient.post<ContactIdentificationMandatoryRules>(this.config.MockingAPIEndPoint + 'ContactIdentification/1.0.0/ContactIdenticationMandatoryRules', {
            headers: header, params: reqParam
        });
    }

    ContactIdentifications(): Observable<ContactIdentification> {

        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('ContactCode', this.tokens.UserCode)
            .append('IncludeTypes', 'true')
            .append('IncludeMandatoryRules', 'true');

        return this.httpclient.get<ContactIdentification>(this.config.MockingAPIEndPoint + 'ContactIdentification/1.0.0/ContactIdentifications', {
            headers: header, params: reqParam
        });
    }

    ContactIdentificationsUpdate(reqData: ContactIdentificationUpdate): Observable<any> {

        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        return this.httpclient.post<any>(this.config.MockingAPIEndPoint + 'ContactIdentification/1.0.0/ContactIdentificationsUpdate', reqData, {
            headers: header
        });
    }

}
