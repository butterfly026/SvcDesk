import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig,   ServiceGroupItem, ServiceGroup, TokenInterface, Token_config } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ServiceGroupDetailService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    ServiceAssignedServiceGroups(ServiceId): Observable<ServiceGroupItem[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')
            .append('EffectiveDateTime', new Date().toISOString().split('T')[0]);

        return this.httpclient.get<any>(this.config.NewAPIEndPoint +
            '/ServiceGroups/ServiceAssignment/ServiceAssignedServiceGroups/ServiceId:' + ServiceId, {
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

    ServiceGroupListContactCode(ContactCode): Observable<ServiceGroup[]> {

        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0');

        return this.httpclient.get<ServiceGroup[]>(this.config.NewAPIEndPoint + '/ServiceGroups/ContactCode:' + ContactCode, {
            headers: header, params: param
        });
    }
}
