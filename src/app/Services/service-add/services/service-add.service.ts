import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP_CONFIG, IAppConfig, Token_config, TokenInterface } from "src/app/model";

@Injectable({
    providedIn: 'root'
})

export class ServiceAddService {

    constructor(
        public httpClient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    serviceAdd(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.2');

        return this.httpClient.post<any>(this.config.NewAPIEndPoint + '/Services', reqData, {
            headers: header, params: reqParam
        });
    }

    getServiceTypes() {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.2');

        return this.httpClient.get<any>(this.config.MockingAPIEndPoint + '/Services/1.2/ServiceTypes/Select', {
            headers: header, params: reqParam
        });
    }

    getServiceTypeWorkflow(ServiceTypeId) {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.2');

        return this.httpClient.get<any>(this.config.MockingAPIEndPoint + '/Services/1.2/ServiceTypes/' + ServiceTypeId + '/ActivationConfiguration', {
            headers: header, params: reqParam
        });
    }
}