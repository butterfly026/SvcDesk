import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig,  ErrorItems, TerminationDetailItem, DeviceListItem, NotificationConfigration, RechargeNotification, TokenInterface, Token_config,  } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class NotificationProcedureService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    getUserInfo(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('ContactCode', this.tokens.UserCode);

        return this.httpclient.get<any>('assets/fakeDB/userInfo.json', {
            headers: header, params: reqParam
        });
    }

    getDeviceList(): Observable<DeviceListItem[]> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('ContactCode', this.tokens.UserCode)
            .append('ActiveOnly', 'true');

        return this.httpclient.get<DeviceListItem[]>(this.config.APIEndPoint + 'Devices.svc/rest/CustomerAssignedDeviceList', {
            headers: header, params: reqParam
        });
    }

    NotificationConfiguration(ServiceReference): Observable<NotificationConfigration[]> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            // .set('Id', DeviceId)
            // .set('ContactCode', this.tokens.UserCode)
            .set('ServiceReference', ServiceReference)

        return this.httpclient.get<NotificationConfigration[]>(this.config.APIEndPoint + 'RechargeNotifications.svc/rest/NotificationConfiguration', {
            headers: header, params: reqParam
        });
    }

    NotificationConfigurationUpdate(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        return this.httpclient.put<any>(this.config.APIEndPoint + 'RechargeNotifications.svc/rest/NotificationConfigurationUpdate', reqData, {
            headers: header
        });
    }

    NotificationConfigurationStatusUpdate(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        return this.httpclient.post<any>(this.config.APIEndPoint + 'RechargeNotifications.svc/rest/NotificationConfigurationStatusUpdate', reqData, {
            headers: header
        });
    }
    NotificationConfigurationAdd(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        return this.httpclient.post<any>(this.config.APIEndPoint + 'RechargeNotifications.svc/rest/NotificationConfigurationAdd', reqData, {
            headers: header
        });
    }

    NotificationConfigurationDelete(NotificationId): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('Id', NotificationId)

        return this.httpclient.delete<any>(this.config.APIEndPoint + 'RechargeNotifications.svc/rest/NotificationConfiguration', {
            headers: header, params: reqParam,
        });
    }


}
