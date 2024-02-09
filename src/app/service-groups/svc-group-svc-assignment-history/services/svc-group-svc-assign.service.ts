import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig,  ServiceGroupItem, TokenInterface, Token_config, } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ServiceGroupServiceAssignListService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
        
    ) { }

    ServiceGroupAssignedServices(ServiceGroupId): Observable<ServiceGroupItem[]> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('ServiceGroupId', ServiceGroupId)
            .append('EffectiveDateTime', '')
            .append('SkipRecords', '')
            .append('TakeRecords', '');

        return this.httpclient.get<ServiceGroupItem[]>(this.config.MockingAPIEndPoint + 'ServiceGroups/1.0.0/ServiceGroupAssignedServicesList', {
            headers: header, params: reqParam
        });
    }
}
