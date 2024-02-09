import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, IAppConfig,  ErrorItems, TokenInterface, Token_config,  } from 'src/app/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ProcedureBalanceService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        
        @Inject(Token_config) public tokens: TokenInterface,
    ) { }

    getRechargeList(CategoryId): Observable<ErrorItems> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam1 = new HttpParams()
            .set('ContactCode', this.tokens.UserCode)
            .append('CategoryId', '1');


        return this.httpclient.get<ErrorItems>(this.config.APIEndPoint + 'Recharges.svc/rest/ContactRechargeList',
            { headers: header, params: reqParam1 }
        );

    }

    checkActivationKey(rechargeId): Observable<string> {
        const header = new HttpHeaders()
            .set('Authorization', (this.tokens.AccessToken));

        const reqParam = new HttpParams()
            .set('Id', rechargeId);

        return this.httpclient.get<string>(this.config.APIEndPoint + 'Recharges.svc/rest/RechargeActivationKey',
            { headers: header, params: reqParam }
        );

    }

}
