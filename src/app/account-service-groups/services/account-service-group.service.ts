import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, ServiceGroup, ServiceGroupItem, ServiceItem, ServiceGroupStatus, TokenInterface, Token_config, } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class AccountServiceGroupService {

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

    ServiceGroupListDelete(ServiceGroupId): Observable<ServiceGroup[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0');
        return this.httpclient.delete<ServiceGroup[]>(this.config.NewAPIEndPoint + 'ServiceGroups/ServiceGroupId:' + ServiceGroupId, {
            headers: header, params: param
        });
    }

    UnassignedServiceNumberList(ServiceGroupId, ServiceNumberMatchString): Observable<ServiceGroup[]> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('api-version', '1.0')
            .append('ServiceNumberMatchString', ServiceNumberMatchString);
        return this.httpclient.delete<ServiceGroup[]>(this.config.NewAPIEndPoint + 'ServiceGroups/UnassignedServices/ServiceGroupId:', {
            headers: header, params: reqParam
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
            '/ServiceGroups/ServiceGroupId::' + updateParam.Id, reqParam, {
            headers: header, params: param
        });
    }

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

    GetServiceGroupListServiceId(ServiceId): Observable<ServiceGroup> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0');
        return this.httpclient.get<ServiceGroup>(this.config.NewAPIEndPoint + '/ServiceGroups/ServiceId:' + ServiceId, {
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

    getServiceList(): Observable<ServiceItem[]> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('ContactCode', this.tokens.UserCode);

        return this.httpclient.get<ServiceItem[]>(this.config.APIEndPoint + 'Services.svc/rest/ContactServiceTreeViewList', {
            headers: header, params: reqParam
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

    ServiceGroupDisplayForContact(ContactCode): Observable<ServiceGroupStatus[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/ServiceGroups/ServiceGroupsDisplay/ContactCode:' + ContactCode, {
            headers: header, params: param
        });
    }

    ServiceGroupDisplayForService(ServiceId): Observable<ServiceGroupStatus[]> {
        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const param = new HttpParams()
            .set('api-version', '1.0')

        return this.httpclient.get<any>(this.config.NewAPIEndPoint + '/ServiceGroups/ServiceGroupsDisplay/ServiceId:' + ServiceId, {
            headers: header, params: param
        });
    }

}
