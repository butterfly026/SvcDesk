import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP_CONFIG, IAppConfig, Token_config, TokenInterface } from "src/app/model";

@Injectable({
    providedIn: 'root'
})

export class ServiceAddRelatedContactService {

    constructor(
        public httpClient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    getNextId(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.1');

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Contacts/NextId', {
            headers: header, params: reqParam
        });
    }

    postNextId(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.1');

        return this.httpClient.post<any>(this.config.NewAPIEndPoint + '/Contacts/NextId', {}, {
            headers: header, params: reqParam
        });
    }

    generatePassword(apiUrl): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.0');

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + apiUrl, {
            headers: header, params: reqParam
        });
    }

    checkLoginId(apiUrl): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.0');

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + apiUrl, {
            headers: header, params: reqParam
        });
    }

    checkEmailValidate(apiUrl): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.0');

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + apiUrl, {
            headers: header, params: reqParam
        });
    }

    getConfiguration(apiUrl): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.0');

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + apiUrl, {
            headers: header, params: reqParam
        });
    }

    checkMobileValidate(apiUrl): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.0');

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + apiUrl, {
            headers: header, params: reqParam
        });
    }

    postPasswordStrengthCheck(password, apiUrl): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.post<any>(this.config.NewAPIEndPoint + apiUrl + password, {
            headers: header, params: param
        });
    }

    getRelationshipTypes(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.1');

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Contacts/RelationshipTypes', {
            headers: header, params: reqParam
        });
    }

    getDefaultTimeZone(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.1');

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Contacts/Timezones/Default', {
            headers: header, params: reqParam
        });
    }

    getSearchTimeZone(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.1')
            .append('SearchString', reqData.SearchString)
            .append('SkipRecords', reqData.SkipRecords)
            .append('TakeRecords', reqData.TakeRecords)

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Contacts/Timezones/Search', {
            headers: header, params: reqParam
        });
    }

    addRelatedContact(ContactCode, reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.1')

        return this.httpClient.post<any>(this.config.NewAPIEndPoint + '/Contacts/RelatedContacts/' + ContactCode, reqData, {
            headers: header, params: reqParam
        });
    }
}