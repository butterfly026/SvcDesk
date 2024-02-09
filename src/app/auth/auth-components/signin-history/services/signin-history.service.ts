import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP_CONFIG, IAppConfig, Token_config, TokenInterface } from "src/app/model";

@Injectable({
    providedIn: 'root'
})

export class SigninHistoryService {
    constructor(
        public httpClient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) private tokens: TokenInterface,
    ) {
    }

    getUserLoginHistory(ContactCode): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('SkipRecords', '0')
            .set('TakeRecords', '10')
            .set('CountRecords', 'Y')
            .set('api-version', '1.0');

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Users/Login/History/Contact/' + ContactCode, {
            headers: header, params: param
        });
    }

    updateUserSuspect(id): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0');
        return this.httpClient.put<any>(this.config.NewAPIEndPoint + '/Users/Login/History/ToggleSuspect/' + id, {}, {
            headers: header, params: param
        });
    }

}