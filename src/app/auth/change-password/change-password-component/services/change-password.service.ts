import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAppConfig, APP_CONFIG, TokenInterface, Token_config } from 'src/app/model';

@Injectable({
    providedIn: 'root'
})

export class ChangePasswordService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    changePassword(reqData): Observable<any> {

        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json')

        const query = new HttpParams()
            .set('api-version', '3.1');

        const reqBody = {
            currentPassword: reqData.OldPassword,
            newPassword: reqData.NewPassword
        }

        let SiteId = localStorage.getItem('SiteId');

        return this.httpclient.post<string>(this.config.NewAPIEndPoint + '/Authentication/' + SiteId + '/SelcommUser/' + this.tokens.UserCode + '/Password'
            , reqBody, { headers: headers, params: query });
    }

    passwordsSuggestion(): Observable<any> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const query = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Users/Passwords/Suggestion'
            , { headers: headers, params: query });
    }

    changePasswordConfiguration(): Observable<any> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const query = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Users/ChangePassword/Configuration'
            , { headers: headers, params: query });
    }

    passwordStrengthCheck(Password): Observable<any> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')
            .append('Password', Password)

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/Users/Passwords/CheckComplexity',
            { headers: headers, params: param });
    }

    sendPasswordChanged(ContactCode, reqData): Observable<any> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const query = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.post<any>(this.config.NewAPIEndPoint + '/Users/PasswordChanged/Contact/' + ContactCode, reqData
            , { headers: headers, params: query });
    }

}
