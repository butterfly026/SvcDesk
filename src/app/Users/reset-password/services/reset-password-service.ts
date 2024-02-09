import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config, } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ResetPasswordService {

    constructor(
        public httpClient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

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

    prepareResetPassword(ContactCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.post<any>(this.config.NewAPIEndPoint + '/Users/Passwords/Reset/Prepare/Contact/' + ContactCode, {}, {
            headers: header, params: reqParam
        });
    }

    completeResetPassword(ContactCode, reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.post<any>(this.config.NewAPIEndPoint + '/Users/Passwords/Reset/Complete/Contact/' + ContactCode, reqData, {
            headers: header, params: reqParam
        });
    }

    sendPasswordChanged(ContactCode, reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.post<any>(this.config.NewAPIEndPoint + '/Users/PasswordChanged/Contact/' + ContactCode, reqData, {
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

    changePassword(reqData, accessToken): Observable<any> {

        const headers = new HttpHeaders()
            .set('Authorization', accessToken)
            .append('Content-Type', 'application/json')


        const query = new HttpParams()
            .set('api-version', '3.1');

        const reqBody = {
            currentPassword: reqData.OldPassword,
            newPassword: reqData.NewPassword
        }

        let SiteId = localStorage.getItem('SiteId');

        return this.httpClient.post<string>(this.config.NewAPIEndPoint + '/Authentication/' + SiteId + '/SelcommUser/' + this.tokens.UserCode + '/Password'
            , reqBody, { headers: headers, params: query });
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


}
