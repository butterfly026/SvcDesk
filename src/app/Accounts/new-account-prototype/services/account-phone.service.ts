import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { APP_CONFIG, IAppConfig, Token_config, TokenInterface } from "src/app/model";
import { AccountPhoneMandatoryRule, AccountPhoneTypeItem, PhoneNumberValidationResponse } from "../models";


@Injectable({
    providedIn: 'root'
})

export class AccountPhoneService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,

        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    getPhoneTypeList(): Observable<AccountPhoneTypeItem[]> {

        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const params = new HttpParams()
            .set('api-version', '1.1');

        return this.httpclient.get<AccountPhoneTypeItem[]>(
            this.config.NewAPIEndPoint + '/Contacts/ContactPhones/Types', 
            { headers, params }
        );
    }

    getAccountPhoneMandatoryRules(contactCode: string): Observable<AccountPhoneMandatoryRule[]> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const params = new HttpParams()
            .set('api-version', '1.1');

        return this.httpclient.get<AccountPhoneMandatoryRule[]>(
            this.config.NewAPIEndPoint + `/Contacts/${contactCode}/ContactPhones/MandatoryRules`, 
            { headers, params }
        );
    }

    getPhoneNumberValidationResult(phoneNumber): Observable<PhoneNumberValidationResponse> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const params = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.get<PhoneNumberValidationResponse>(
            this.config.NewAPIEndPoint + `/Messages/ValidatePhoneNumber/${phoneNumber}`, 
            { headers, params }
        );
    }

}