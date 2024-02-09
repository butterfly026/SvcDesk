import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ServiceAttributeInstance } from "src/app/Attributes/models/service-attribute-instance";
import { AttributInstance } from "src/app/Events/Instances/models";
import { Token_config, TokenInterface, APP_CONFIG, IAppConfig } from "src/app/model";

@Injectable({
    providedIn: 'root'
})

export class ServiceAttributeFormService {
    constructor(
        private httpClient: HttpClient,
        @Inject(Token_config) public tokens: TokenInterface,
        @Inject(APP_CONFIG) public config: IAppConfig,
    ) {

    }

    postAttributes(ServiceReference, reqBody): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const reqParam = new HttpParams()
            .set('api-version', '1.2')

        return this.httpClient.post<any>(this.config.NewAPIEndPoint + '/Services/' + ServiceReference + '/Attributes/Instances', reqBody, {
            headers: header, params: reqParam
        });
    }

    getDefinitions(ServiceReference, reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('api-version', '1.2')
            .append('SkipRecords', reqData.SkipRecords)
            .append('TakeRecords', reqData.TakeRecords)
            .append('CountRecords', reqData.CountRecords)
            .append('SearchString', reqData.SearchString);

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Services/' + ServiceReference + '/Attributes/Definitions', {
            headers: header, params: reqParam
        });
    }

    getValues(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('api-version', '1.2')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint
             + '/Services/Attributes/ServiceTypes/' 
            //  + reqData.ServiceTypeId 
            + 'NBN'
             + '/Definitions/' 
             + reqData.Id 
             + '/Validate/' 
             + reqData.Value, 
             {
            headers: header, params: reqParam
        });
    }

    getServiceTypes(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/Configurations/ServiceTypes', {
            headers: header, params: param
        });
    }

    patchAttributes(Id, reqBody): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const reqParam = new HttpParams()
            .set('api-version', '1.2')

        return this.httpClient.patch<any>(this.config.NewAPIEndPoint + '/Services/Attributes/Instances/' + Id, reqBody, {
            headers: header, params: reqParam
        });
    }

    getAttributeDetail(Id: string): Observable<ServiceAttributeInstance>{
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const reqParam = new HttpParams()
            .set('api-version', '1.2')

        return this.httpClient.get<ServiceAttributeInstance>(this.config.NewAPIEndPoint + '/Services/Attributes/Instances/' + Id, {
            headers: header, params: reqParam
        });
    }
}