import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig,  CustomerEmailItem, ContactEmailUsage, ContactEmailHistory,  ContactEmailType, ContactEmailMandatoryRule, TokenInterface, Token_config } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ContactEmailsService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    getEmailList(ContactCode): Observable<ContactEmailUsage> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')
            .append('IncludeTypes', 'true')
            .append('IncludeMandatoryRules', 'true');

        return this.httpclient.get<ContactEmailUsage>(this.config.NewAPIEndPoint + '/contactemails/Usage/ContactCode:' + ContactCode, {
            headers: header, params: param
        });
    }

    ContactEmailUsageUpdate(reqData): Observable<any> {

        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.post<any>(this.config.NewAPIEndPoint + '/contactemails/UsageUpdate', reqData, {
            headers: header, params: param
        });
    }

    ContactEmailUsageHistory(ContactCode): Observable<ContactEmailHistory[]> {

        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.get<ContactEmailHistory[]>(this.config.NewAPIEndPoint + '/contactemails/UsageHistory/ContactCode:' + ContactCode, {
            headers: header, params: param
        });
    }

    ContactEmailTypes(): Observable<ContactEmailType[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.get<ContactEmailType[]>(this.config.NewAPIEndPoint + '/contactemails/Types', {
            headers: header, params: param
        });
    }

    ContactEmailMandatoryRules(ContactCode): Observable<ContactEmailMandatoryRule[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.get<ContactEmailMandatoryRule[]>(this.config.NewAPIEndPoint + '/contactemails/MandatoryRules/ContactCode:' + ContactCode, {
            headers: header, params: param
        });
    }

}
