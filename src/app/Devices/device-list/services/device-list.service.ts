import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig,  DeviceListItem, TokenInterface, Token_config } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class DeviceListService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
        
    ) { }

    getDeviceList(reqData): Observable<DeviceListItem[]> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken))
        const reqParam = new HttpParams()
            .set('CollectMethod', 'DD')
            .append('SkipRecords', reqData.SkipRecords)
            .append('TakeRecords', reqData.TakeRecords);

        return this.httpclient.get<DeviceListItem[]>(this.config.APIEndPoint + 'Devices.svc/rest/DeviceList', {
            headers: header, params: reqParam
        });
    }

    DeviceDelete(deviceId): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken))
        const reqParam = new HttpParams()
            .set('DeviceId', deviceId)

        return this.httpclient.delete<any>(this.config.APIEndPoint + 'Devices.svc/rest/DeviceDelete', {
            headers: header, params: reqParam
        });
    }

}
