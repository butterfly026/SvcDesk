import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig,  RechargeSimpleNewItem, DeviceListItem, AutoPurchaseConfiguration, TokenInterface, Token_config,  } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class RechargeAutoPurchaseService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

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

    getRechargeList(): Observable<RechargeSimpleNewItem[]> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam1 = new HttpParams()
            .set('ContactCode', this.tokens.UserCode)
            .append('CategoryId', '1');

        return this.httpclient.get<RechargeSimpleNewItem[]>(this.config.APIEndPoint + 'Recharges.svc/rest/ContactAvailableRechargeList',
            { headers: header, params: reqParam1 }
        );

    }

    AutoPurchaseConfigurationAdd(reqParam): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        return this.httpclient.post<any>(this.config.APIEndPoint + 'RechargeAutoPurchase.svc/rest/AutoPurchaseConfigurationAdd', reqParam,
            { headers: header }
        );
    }

    AutoPurchaseConfigurationUpdate(reqParam): Observable<any> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        return this.httpclient.put<any>(this.config.APIEndPoint + 'RechargeAutoPurchase.svc/rest/AutoPurchaseConfigurationUpdate', reqParam,
            { headers: header }
        );
    }

    AutoPurchaseConfiguration(ServiceReference): Observable<AutoPurchaseConfiguration[]> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            // .set('Id', DeviceId)
            // .set('ContactCode', this.tokens.UserCode)
            .set('ServiceReference', ServiceReference)

        return this.httpclient.get<AutoPurchaseConfiguration[]>(this.config.APIEndPoint + 'RechargeAutoPurchase.svc/rest/AutoPurchaseConfiguration', {
            headers: header, params: reqParam
        });
    }

    AutoPurchaseConfigurationDelete(RechargeId): Observable<AutoPurchaseConfiguration[]> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('Id', RechargeId)

        return this.httpclient.delete<AutoPurchaseConfiguration[]>(this.config.APIEndPoint + 'RechargeAutoPurchase.svc/rest/AutoPurchaseConfigurationDelete', {
            headers: header, params: reqParam
        });
    }


}
