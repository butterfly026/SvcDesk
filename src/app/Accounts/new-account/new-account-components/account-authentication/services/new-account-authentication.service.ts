import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP_CONFIG, IAppConfig, Token_config, TokenInterface } from "src/app/model";

@Injectable({
    providedIn: 'root'
})

export class NewAccountAuthenticationService {

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

    unBlockUser(userId): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '3.1')

        return this.httpClient.delete<any>(this.config.NewAPIEndPoint + '/Authentication/SelcommUser/Lockout/name:' + userId, {
            headers: header, params: reqParam
        });
    }

    LockoutUser(userId, reqBody): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken))
            .append('Content-Type', 'application/json');

        const reqParam = new HttpParams()
            .set('api-version', '3.1')

        return this.httpClient.put<any>(this.config.NewAPIEndPoint + '/Authentication/SelcommUser/Lockout/name:' + userId, reqBody, {
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

    addRole(reqData, additionalPath): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '3.1');

        return this.httpClient.put<any>(this.config.NewAPIEndPoint + '/Authentication/SelcommUser/' + additionalPath + reqData.userId
            + '/Role/' + reqData.roleId, {}, {
            headers: header, params: param
        });
    }

    deleteRole(reqData, additionalPath): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '3.1');

        return this.httpClient.delete<any>(this.config.NewAPIEndPoint + '/Authentication/SelcommUser/' + additionalPath + reqData.userId
            + '/Role/' + reqData.roleId, {
            headers: header, params: param
        });
    }
    
    putEnableMFA(contactCode): Observable<any> {
        const header = new HttpHeaders()
        .set('Authorization', this.tokens.AccessToken)
        .append('Content-Type', 'application/json');

        const reqParam = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.put<any>(this.config.NewAPIEndPoint + '/Users/MFA/Enable/Contact/' + contactCode,null, {
            headers: header, params: reqParam
        });
    }

    putDisableMFA(contactCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const reqParam = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.put<any>(this.config.NewAPIEndPoint + '/Users/MFA/Disable/Contact/' + contactCode,null, {
            headers: header, params: reqParam
        });
    }


}