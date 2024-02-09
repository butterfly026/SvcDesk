import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP_CONFIG, IAppConfig, Token_config, TokenInterface } from "src/app/model";
import { AuthenticationInfo } from "../contact-authentication.types";

@Injectable({
    providedIn: 'root'
})

export class ContactsAuthService {

    constructor(
        public httpClient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    checkLoginId(LoginId): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Users/Authentication/LoginId/' + LoginId + '/Unique', {
            headers: header, params: reqParam
        });
    }

    checkEmailValidate(Email): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Users/Authentication/Email/' + Email + '/Unique', {
            headers: header, params: reqParam
        });
    }

    checkEmailFormatValidate(Email): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Messages/Emails/ValidateFormat/' + Email, {
            headers: header, params: reqParam
        });
    }
    checkMobileValidate(Mobile): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Users/Authentication/Mobile/' + Mobile + '/Unique', {
            headers: header, params: reqParam
        });
    }

    checkMobileFormatValidate(Mobile): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Messages/SMSs/ValidateNumber/' + Mobile, {
            headers: header, params: reqParam
        });
    }
    passwordStrengthCheck(Password): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.0')
            .append('Password', Password)

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Users/Passwords/CheckComplexity', {
            headers: header, params: reqParam
        });
    }

    generatePassword(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Users/Passwords/Suggestion', {
            headers: header, params: reqParam
        });
    }

    getAuthenticationUser(authId: string): Observable<AuthenticationInfo> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<AuthenticationInfo>(this.config.NewAPIEndPoint + `/Users/Authentication/${authId}`, {
            headers: header, params: reqParam
        });
    }

    createAuthenticationUser(authId: string, category: string, reqData: AuthenticationInfo): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.put<any>(this.config.NewAPIEndPoint + `/Users/${authId}/Authentication/${category}`, reqData, {
            headers: header, params: reqParam
        });
    }



}