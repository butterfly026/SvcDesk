import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, ServiceGroupItem, ServiceItem, ServiceGroup, TokenInterface, Token_config } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ServiceGroupAssignedService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    GetServiceGroupListGroupId(ServiceGroupId): Observable<ServiceGroup> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.get<ServiceGroup>(this.config.NewAPIEndPoint + '/ServiceGroups/ServiceGroupId:' + ServiceGroupId, {
            headers: header, params: param
        });
    }

    ServiceServiceGroupAssignment(reqData): Observable<ServiceGroupItem[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')
        // .append('EffectiveDateTime', '')
        // .append('SkipRecords', reqData.SkipRecords)
        // .append('TakeRecords', reqData.TakeRecords)

        return this.httpclient.get<ServiceGroupItem[]>(this.config.NewAPIEndPoint +
            '/ServiceGroups/AssignedServices/ServiceGroupId:' + reqData.serviceId, {
            headers: header, params: param
        });
    }

    ServiceGroupUnAssignService(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        const reqBody = {
            endDateTime: reqData.endDateTime
        };
        return this.httpclient.post<any>(this.config.NewAPIEndPoint +
            '/ServiceGroups/UnAssignService/ServiceGroupId:' + reqData.serviceGroupId + 'ServiceId:' + reqData.serviceId, reqBody, {
            headers: header, params: param
        });
    }


}
