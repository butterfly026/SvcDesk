import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP_CONFIG, IAppConfig, Token_config, TokenInterface } from "src/app/model";

@Injectable({
    providedIn: 'root'
})

export class PlanChangeConfigurationService {
    constructor(
        public httpClient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) {

    }

    getPlanChangesConfigurations(ServiceTypeId): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const param = new HttpParams()
            .set('api-version', '1.2')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Services/ServiceTypes/' + ServiceTypeId + '/PlanChanges/Configurations', {
            headers: header, params: param
        });
    }

    putPlanChangesConfigurations(ServiceTypeId, reqBody): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)

        const param = new HttpParams()
            .set('api-version', '1.2')

        return this.httpClient.put<any>(this.config.NewAPIEndPoint + '/Services/ServiceTypes/' + ServiceTypeId + '/PlanChanges/Configurations', reqBody, {
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