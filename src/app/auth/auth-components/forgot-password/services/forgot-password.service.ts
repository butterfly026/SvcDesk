import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP_CONFIG, IAppConfig, Token_config, TokenInterface } from "src/app/model";

@Injectable({
    providedIn: 'root'
})

export class ForgotPasswordService {
    constructor(
        public httpClient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) private tokens: TokenInterface,
    ) {
    }

    passwordResetSMS(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0');

        return this.httpClient.post<any>(this.config.NewAPIEndPoint + '/Users/Passwords/Reset/SMS', reqData, {
            headers: header, params: param
        });
    }

    passwordResetEmail(reqData): Observable<any> {
        const headers = new HttpHeaders()
            .set('Authorization', reqData.token)
            .append('Content-Type', 'application/json')

        const query = new HttpParams()
            .set('api-version', '3.1');        
        return this.httpClient.post<string>(this.config.NewAPIEndPoint + '/Authentication/' + reqData.siteId + '/SelcommUser/' + reqData.accountNumber + '/Password/Reset'
            , {}, { headers: headers, params: query });
    }

}