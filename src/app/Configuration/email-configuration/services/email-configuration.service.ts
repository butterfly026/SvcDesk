import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Token_config, TokenInterface, APP_CONFIG, IAppConfig } from "src/app/model";

@Injectable({
    providedIn: 'root'
})

export class EmailConfigurationService {
    constructor(
        private httpClient: HttpClient,
        @Inject(Token_config) public tokens: TokenInterface,
        @Inject(APP_CONFIG) private config: IAppConfig,
    ) {

    }

    getEmailConfiguration(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.MockingAPIEndPoint + '/Messages/1.0/Emails/Configuration', {
            headers: header, params: param
        });
    }

    emailConfiguration(apiUrl): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + apiUrl, {
            headers: header, params: param
        });
    }

    updateEmailConfiguration(reqBody): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.put<any>(this.config.MockingAPIEndPoint + '/Messages/1.0/Emails/Configuration', reqBody, {
            headers: header, params: param
        });
    }

    uEmailConfiguration(reqBody, apiUrl): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.put<any>(this.config.NewAPIEndPoint + apiUrl, reqBody, {
            headers: header, params: param
        });
    }
}