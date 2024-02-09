import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { APP_CONFIG, IAppConfig,  ContactItemList, ContactSearch, TokenInterface, Token_config } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ServiceDeskUpdatePaymentService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
        
    ) { }

    updatePayment(reqData): Observable<any> {
        const reqParam = new HttpParams()
            .set('Authorization', this.tokens.AccessToken)
            .append('ContactCode', reqData)
        return this.httpclient.get<any>('assets/fakeDB/customerDetail.json', {
            params: reqParam
        });
    }

}
