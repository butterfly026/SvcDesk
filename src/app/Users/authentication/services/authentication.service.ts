import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP_CONFIG, IAppConfig, Token_config, TokenInterface } from "src/app/model";

@Injectable({
    providedIn: 'root'
})

export class AuthenticationService {

    constructor(
        public httpClient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    checkLoginId(loginId: string, contactCode: string ): Observable<any> {
        const headers = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const params = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(
            this.config.NewAPIEndPoint + `/Users/Authentication/ContactCode/${contactCode}/LoginId/${loginId}/Unique`, 
            { headers, params }
        );
    }

    checkEmailValidate(email: string, contactCode: string): Observable<any> {
        const headers = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const params = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(
            this.config.NewAPIEndPoint + `/Users/Authentication/ContactCode/${contactCode}/Email/${email}/Unique`, 
            { headers, params }
        );
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
    checkMobileValidate(mobile: string, contactCode: string): Observable<any> {
        const headers = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const params = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(
            this.config.NewAPIEndPoint + `/Users/Authentication/ContactCode/${contactCode}/Mobile/${mobile}/Unique`, 
            { headers, params }
        );
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


    getRefreshTokenContact(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '3.1');

        return this.httpClient.post<any>(this.config.NewAPIEndPoint +
            '/authentication/' + reqData.SiteId + '/Contact/' + reqData.ContactCode + '/Token/Refresh', JSON.stringify(reqData.UserId), {
            headers: header, params: param
        });
    }

    getAccessTokenContact(refreshToken): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', refreshToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '3.1');

        return this.httpClient.post<any>(this.config.NewAPIEndPoint + '/Authentication/Contact/Token/Access', {}, {
            headers: header, params: param
        });
    }

    addUserWithAccessToken(reqData, reqBody): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', reqData.accessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '3.1');
        return this.httpClient.post<any>(this.config.NewAPIEndPoint + '/Authentication/' + reqData.SiteId + '/SelcommUser/Contact/' +
            + reqData.userId + '/Self', reqBody, {
            headers: header, params: param
        });
    }

    getAuthenticationInfo(contactCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const reqParam = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Users/Authentication/' + contactCode, {
            headers: header, params: reqParam
        });
    }

    saveAuthenticateInfo(reqData, ContactId: string, Category: string): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .set('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0');

        return this.httpClient.put<any>(this.config.NewAPIEndPoint +
            '/Users/' + ContactId + '/Authentication/' + Category, reqData, {
            headers: header, params: param
        });
    }
}