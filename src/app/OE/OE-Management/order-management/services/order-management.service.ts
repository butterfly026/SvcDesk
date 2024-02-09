import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig,  OrderManagement, TokenInterface, Token_config } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class OrderManagementService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
        
    ) { }

    getOrderList(reqData): Observable<OrderManagement[]> {
        let header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        let reqParam = new HttpParams()
            .set('ContactCode', reqData.ContactCode)
            .append('SkipRecords', reqData.SkipRecords)
            .append('TakeRecords', reqData.TakeRecords);

        return this.httpclient.get<OrderManagement[]>('assets/fakeDB/OE/OrderManagement/OrderManagement.json', {
            headers: header, params: reqParam
        });
    }

}
