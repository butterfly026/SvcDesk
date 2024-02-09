import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig,  DeviceListItem, TokenInterface, Token_config,  } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class DeviceUpdateService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    getDeviceListFromID(reqData): Observable<DeviceListItem[]> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken))
        const reqParam = new HttpParams()
            .set('ContactCode', this.tokens.UserCode)
            .append('Id', reqData);

        return this.httpclient.get<DeviceListItem[]>(this.config.MockingAPIEndPoint + 'Devices/1.0.0/DeviceList', {
            headers: header, params: reqParam
        });

    }

    updateDevice(): Observable<DeviceListItem[]> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken))
        const reqParam = new HttpParams()
            .set('ContactCode', this.tokens.UserCode)
            // .append('Id', reqData);

        return this.httpclient.get<DeviceListItem[]>(this.config.MockingAPIEndPoint + 'Devices/1.0.0/DeviceList', {
            headers: header, params: reqParam
        });

    }

}
