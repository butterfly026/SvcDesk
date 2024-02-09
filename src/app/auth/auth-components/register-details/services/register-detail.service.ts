import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP_CONFIG, IAppConfig, Token_config, TokenInterface } from "src/app/model";

@Injectable({
    providedIn: 'root'
})

export class RegisterDetailService {
    constructor(
        public httpClient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) private tokens: TokenInterface,
    ) {
    }

    registerEmail(ContactCode, reqBody): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0');

        return this.httpClient.put<any>(this.config.NewAPIEndPoint + '/Users/Register/Email/Contact/' + ContactCode, reqBody, {
            headers: header, params: param
        });
    }

    registerMobile(ContactCode, reqBody): Observable<any> {      
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0');

        return this.httpClient.put<any>(this.config.NewAPIEndPoint + '/Users/Register/Mobile/Contact/' + ContactCode, reqBody, {
            headers: header, params: param
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
}