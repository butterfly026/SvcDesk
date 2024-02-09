import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG, IAppConfig, ContactPhoneTypeItem, ContactPhoneHistory, ContactPhoneUsage, ContactPhoneMandatoryRule, TokenInterface, Token_config } from 'src/app/model';
import { PhoneNumberValidationResponse } from '../models';

@Injectable({
    providedIn: 'root'
})

export class ContactPhoneService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,

        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    getPhoneList(ContactCode): Observable<ContactPhoneUsage> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.1')
            .append('IncludeTypes', 'true')
            .append('IncludeMandatoryRules', 'true');
        return this.httpclient.get<ContactPhoneUsage>(this.config.NewAPIEndPoint + '/Contacts/' + ContactCode + '/ContactPhones/Usage', { headers, params });
    }

    getPhoneTypeList(): Observable<ContactPhoneTypeItem[]> {

        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.1');

        return this.httpclient.get<ContactPhoneTypeItem[]>(this.config.NewAPIEndPoint + '/Contacts/ContactPhones/Types', { headers, params });
    }

    ContactPhoneUsageUpdate(reqData, ContactCode): Observable<void> {

        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.1');

        return this.httpclient.post<void>(this.config.NewAPIEndPoint + '/contacts/' + ContactCode + '/ContactPhones/Usage', reqData, { headers, params });
    }

    ContactPhoneUsageHistory(ContactCode): Observable<ContactPhoneHistory[]> {

        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.1');

        return this.httpclient.get<ContactPhoneHistory[]>(this.config.NewAPIEndPoint + '/Contacts/' + ContactCode + '/ContactPhones/UsageHistory', { headers, params });
    }

    ContactPhoneMandatoryRules(ContactCode): Observable<ContactPhoneMandatoryRule[]> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.1');

        return this.httpclient.get<ContactPhoneMandatoryRule[]>(this.config.NewAPIEndPoint + '/ContactPhones/MandatoryRules/' + ContactCode, { headers, params });
    }

    GetPhoneNumberValidationResult(phoneNumber): Observable<PhoneNumberValidationResponse> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.get<PhoneNumberValidationResponse>(this.config.NewAPIEndPoint + `/Messages/ValidatePhoneNumber/${phoneNumber}`, { headers, params });
    }

}
