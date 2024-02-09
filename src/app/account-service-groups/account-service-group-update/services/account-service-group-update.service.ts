import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, ServiceGroup, ServiceGroupStatus, TokenInterface, Token_config } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class AccountServiceGroupUpdateService {

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

    ServiceGroupStatusList(): Observable<ServiceGroupStatus[]> {

        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/ServiceGroups/ServiceGroupStatuses', {
            headers: header, params: param
        });
    }

    ServiceGroupUpdate(updateParam: ServiceGroup): Observable<ServiceGroup> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        const reqParam = {
            name: updateParam.Name,
            code: updateParam.Code,
            additionalInformation1: updateParam.AdditionalInformation1,
            additionalInformation2: updateParam.AdditionalInformation2,
            additionalInformation3: updateParam.AdditionalInformation3,
            email: updateParam.Email,
            statusId: updateParam.StatusId,
            // ContactCode: this.tokens.UserCode,
            // Id: updateParam.Id,
        };

        return this.httpclient.put<any>(this.config.NewAPIEndPoint +
            '/ServiceGroups/ServiceGroupId:' + updateParam.Id, reqParam, {
            headers: header, params: param
        });
    }

}
