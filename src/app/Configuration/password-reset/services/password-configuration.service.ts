import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable, Inject } from "@angular/core";
import { Observable } from "rxjs";
import { Token_config, TokenInterface, APP_CONFIG, IAppConfig } from "src/app/model";
import { ResetConfig } from "../password-reset.component.types";

@Injectable({
    providedIn: 'root'
})

export class PasswordConfigurationService {
    constructor(
        private httpClient: HttpClient,
        @Inject(Token_config) public tokens: TokenInterface,
        @Inject(APP_CONFIG) private config: IAppConfig,
    ) { }


    getPasswordResetConfig(): Observable<ResetConfig> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<ResetConfig>(this.config.NewAPIEndPoint + '/Users/Passwords/Reset/Configuration/Administration', {
            headers: header, params: param
        });
    }

    updatePasswordResetConfig(reqData: ResetConfig): Observable<ResetConfig> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.put<ResetConfig>(this.config.NewAPIEndPoint + '/Users/Passwords/Reset/Configuration/Administration', reqData, {
            headers: header, params: param
        });
    }
}