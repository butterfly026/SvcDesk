import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig,  ServiceGroup,  ServiceGroupItem, ServiceItem, ServiceGroupServiceAssignment, ServiceGroupStatus, TokenInterface, Token_config, } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ServiceGroupServiceAddService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

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

    getServiceList(): Observable<ServiceItem[]> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('ContactCode', this.tokens.UserCode);

        return this.httpclient.get<ServiceItem[]>(this.config.APIEndPoint + 'Services.svc/rest/ContactServiceTreeViewList', {
            headers: header, params: reqParam
        });
    }
}
