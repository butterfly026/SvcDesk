import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP_CONFIG, IAppConfig, Token_config, TokenInterface } from "src/app/model";

@Injectable({
    providedIn: 'root'
})

export class TerminationConfigurationService {
    constructor(
        public httpClient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) {

    }

    getTerminationsConfigurations(ServiceTypeId): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const param = new HttpParams()
            .set('api-version', '1.2')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Services/ServiceTypes/' + ServiceTypeId + '/Terminations/Configurations', {
            headers: header, params: param
        });
    }

    putTerminationsConfigurations(ServiceTypeId, reqBody): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const param = new HttpParams()
            .set('api-version', '1.2')

        return this.httpClient.put<any>(this.config.NewAPIEndPoint + '/Services/ServiceTypes/' + ServiceTypeId + '/Terminations/Configurations', reqBody, {
            headers: header, params: param
        });
    }

    getServicesTypesSelect(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const param = new HttpParams()
            .set('api-version', '1.2')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Services/ServiceTypes/Select', {
            headers: header, params: param
        });
    }
}