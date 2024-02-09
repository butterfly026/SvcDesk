import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP_CONFIG, IAppConfig, Token_config, TokenInterface } from "src/app/model";
import { CreateServiceRequestBody, CreateServiceResponse, NextServiceId, ServiceConfiguration, ServiceTypeItem } from "../models";

@Injectable({
    providedIn: 'root'
})

export class ServiceNewService {

    constructor(
        public httpClient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }


    getServiceTypes(): Observable<ServiceTypeItem[]>  {
        const headers = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const params = new HttpParams()
            .set('api-version', '1.2');

        return this.httpClient.get<ServiceTypeItem[]>(
            this.config.NewAPIEndPoint + '/Services/ServiceTypes/Select', 
            { headers, params }
        );
    }

    getServiceConfiguration(serviceTypeId): Observable<ServiceConfiguration>  {
        const headers = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const params = new HttpParams()
            .set('api-version', '1.2');

        return this.httpClient.get<ServiceConfiguration>(
            this.config.NewAPIEndPoint + `/Services/ServiceTypes/${serviceTypeId}/OnBoarding/Configuration`, 
            { headers, params }
        );
    }

    getDefaultConfiguration(): Observable<ServiceConfiguration>  {
        const headers = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const params = new HttpParams()
            .set('api-version', '1.2');

        return this.httpClient.get<ServiceConfiguration>(
            this.config.NewAPIEndPoint + '/Services/OnBoarding/Configuration/Default', 
            { headers, params }
        );
    }

    getServiceId(serviceTypeId: string): Observable<NextServiceId>  {
        const headers = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const params = new HttpParams()
            .set('api-version', '1.2');

        return this.httpClient.post<NextServiceId>(
            this.config.NewAPIEndPoint + `/Services/ServiceTypes/${serviceTypeId}/NextServiceId`, 
            {}, 
            { headers, params}
        );
    }

    createNewService(reqBody: CreateServiceRequestBody): Observable<CreateServiceResponse> {
        const headers = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const params = new HttpParams()
            .set('api-version', '1.2');

        return this.httpClient.post<CreateServiceResponse>(
            this.config.NewAPIEndPoint + '/Services', 
            reqBody, 
            { headers, params}
        );
    }
    
}