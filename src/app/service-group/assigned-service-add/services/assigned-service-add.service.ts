import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig,  ServiceGroup,  ServiceGroupItem, ServiceItem, ServiceGroupServiceAssignment, ServiceGroupStatus, TokenInterface, Token_config, } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class AssignedServiceAddService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

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

    ServiceGroupAssignService(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        const reqBody = {
            startDateTime: reqData.startDateTime
        };

        return this.httpclient.post<any>(this.config.NewAPIEndPoint +
            '/ServiceGroups/AssignService/ServiceGroupId:' + reqData.serviceGroupId + 'ServiceId:' + reqData.serviceId
            , reqBody, { headers: header, params: param });
    }
}
