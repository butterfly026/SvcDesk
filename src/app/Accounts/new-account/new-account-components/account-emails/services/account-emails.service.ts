import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP_CONFIG, ContactEmailUsage, IAppConfig, Token_config, TokenInterface } from "src/app/model";
import { AccountEmailTypeItem, AccountEmailMandatoryRule } from "../models";

@Injectable({
    providedIn: 'root'
})

export class AccountEmailsService {

    constructor(
        public httpClient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,

        @Inject(Token_config) public tokens: TokenInterface,
    ) {

    }

    getEmailList(ContactCode: string): Observable<ContactEmailUsage> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.0')
            .append('IncludeTypes', 'true')
            .append('IncludeMandatoryRules', 'true');

        return this.httpClient.get<ContactEmailUsage>(
            this.config.NewAPIEndPoint + '/contactemails/Usage/ContactCode:' + ContactCode, 
            {headers, params}
        );
    }

    getEmailTypeList(): Observable<AccountEmailTypeItem[]> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.1');

        return this.httpClient.get<AccountEmailTypeItem[]>(
            this.config.NewAPIEndPoint + '/Contacts/Emails/Types', 
            {headers, params}
        );
    }

    getAccountEmailMandatoryRules(ContactCode: string): Observable<AccountEmailMandatoryRule[]> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.0');

        return this.httpClient.get<AccountEmailMandatoryRule[]>(
            this.config.NewAPIEndPoint + '/contactemails/MandatoryRules/ContactCode:' + ContactCode, 
            {headers, params}
        );
    }

}