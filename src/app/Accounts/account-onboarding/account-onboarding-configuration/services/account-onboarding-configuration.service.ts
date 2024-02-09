import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP_CONFIG, IAppConfig, Token_config, TokenInterface } from "src/app/model";
import { CreditStatusItemDetail } from "../models/account-onboarding-configuration.component.types";

@Injectable({
    providedIn: 'root'
})

export class AccountOnboardingConfigurationService {
    constructor(
        public httpClient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) {

    }

    getAccountOnboardingConfigurations(TypeId): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Accounts/OnBoarding/Configuration/' + TypeId, {
            headers: header,
            params: param
        });
    }

    putAccountOnboardingConfigurations(TypeId, reqBody): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.put<any>(this.config.NewAPIEndPoint + '/Accounts/OnBoarding/Configuration/' + TypeId, reqBody, {
            headers: header, params: param
        });
    }

    getStatusesList(): Observable<CreditStatusItemDetail[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
        
        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<CreditStatusItemDetail[]>(this.config.NewAPIEndPoint + '/Accounts/CreditStatuses', {
            headers: header, params: param
        });
    }
}