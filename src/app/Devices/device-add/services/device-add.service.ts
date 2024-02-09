import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig,  DeviceListItem, TokenInterface, Token_config,  } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class DeviceAddService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    AddNewDevice(reqData): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken))
        const reqParam = new HttpParams()
            .set('ContactCode', this.tokens.UserCode)

        return this.httpclient.post<any>(this.config.APIEndPoint + 'Devices.svc/rest/DeviceAdd', reqData, {
            headers: header
        });
    }

    getDeviceStatusList(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken))

        return this.httpclient.get<any>(this.config.APIEndPoint + 'Devices.svc/rest/DeviceStatusList', {
            headers: header
        });
    }

    getDeviceTypeDisplayList(): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken))

        return this.httpclient.get<any>(this.config.APIEndPoint + 'Devices.svc/rest/DeviceTypeDisplayList', {
            headers: header
        });
    }

}
