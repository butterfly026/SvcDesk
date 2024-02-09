import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ServiceDeskNewPaymentService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,

    ) { }

    addPayment(reqData): Observable<any> {
        const reqParam = new HttpParams()
            .set('Authorization', this.tokens.AccessToken)
            .append('ContactCode', reqData)
        return this.httpclient.get<any>('assets/fakeDB/customerDetail.json', {
            params: reqParam
        });
    }

}
