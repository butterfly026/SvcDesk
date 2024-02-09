import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, AliasType, Titles, ContactNames, ContactNameUpdate, ContactNameHistory, ContactAliasHistory, TokenInterface, Token_config, } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class AccountNamesService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,

        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    AliasTypes(): Observable<AliasType[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.1');

        return this.httpclient.get<AliasType[]>(this.config.NewAPIEndPoint + '/Contacts/Aliases/Types', {
            headers: header, params: param
        });
    }

    Titles(): Observable<Titles[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.1');

        return this.httpclient.get<Titles[]>(this.config.NewAPIEndPoint + '/Contacts/Titles', {
            headers: header, params: param
        });
    }

    ContactNames(ContactCode): Observable<ContactNames> {

        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.1');

        return this.httpclient.get<ContactNames>(this.config.NewAPIEndPoint + '/Contacts/' + ContactCode + '/Names', {
            headers: header, params: param
        });
    }

    ContactNamesUpdate(reqData: ContactNameUpdate): Observable<any> {

        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.1');

        return this.httpclient.put<any>(this.config.NewAPIEndPoint + '/Contacts/' + reqData.ContactCode + '/Names', reqData, {
            headers: header, params: param
        });
    }

    ContactNameHistory(ContactCode): Observable<ContactNameHistory[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.1');

        return this.httpclient.get<ContactNameHistory[]>(this.config.NewAPIEndPoint + '/Contacts/' + ContactCode + '/Names/History', {
            headers: header, params: param
        });
    }

    ContactAliasesHistory(ContactCode): Observable<ContactAliasHistory[]> {

        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.1');

        return this.httpclient.get<ContactAliasHistory[]>(this.config.NewAPIEndPoint + '/Contacts/' + ContactCode + '/Aliases/History', {
            headers: header, params: param
        });
    }

}
