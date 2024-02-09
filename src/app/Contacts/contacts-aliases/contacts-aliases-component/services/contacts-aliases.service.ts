import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, AliasType, Titles, ContactNames, ContactNameUpdate, ContactNameHistory, ContactAliasHistory, TokenInterface, Token_config, } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ContactsAliasesService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,

        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    AliasTypes(): Observable<AliasType[]> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.1');

        return this.httpclient.get<AliasType[]>(`${this.config.NewAPIEndPoint}/Contacts/Aliases/Types`, { headers, params });
    }

    Titles(): Observable<Titles[]> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.1');

        return this.httpclient.get<Titles[]>(`${this.config.NewAPIEndPoint}/Contacts/Titles`, { headers, params });
    }

    ContactNames(ContactCode): Observable<ContactNames> {

        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.1');

        return this.httpclient.get<ContactNames>(`${this.config.NewAPIEndPoint}/Contacts/${ContactCode}/Names`, { headers, params });
    }

    ContactNamesUpdate(reqData: ContactNameUpdate, contactCode: string): Observable<void> {

        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.1');

        return this.httpclient.put<void>(`${this.config.NewAPIEndPoint}/Contacts/${contactCode}/Names`, reqData, { headers, params });
    }

    ContactNameHistory(ContactCode): Observable<ContactNameHistory[]> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.1');

        return this.httpclient.get<ContactNameHistory[]>(`${this.config.NewAPIEndPoint}/Contacts/${ContactCode}/Names/History`, { headers, params });
    }

    ContactAliasesHistory(ContactCode): Observable<ContactAliasHistory[]> {

        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('api-version', '1.1');

        return this.httpclient.get<ContactAliasHistory[]>(`${this.config.NewAPIEndPoint}/Contacts/${ContactCode}/Aliases/History`, { headers, params });
    }

}
