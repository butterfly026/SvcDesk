import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from 'src/app/model';
import { GetChargesInstanceResponse } from '../bill-charges.component.type';

@Injectable({
    providedIn: 'root'
})

export class BillChargesService {

    constructor(
        public httpclient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) {

    }

    getChargeList(reqData, billId): Observable<GetChargesInstanceResponse> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const params = new HttpParams({ fromObject: { ...reqData }})
            .append('api-version', '1.0')

        return this.httpclient.get<GetChargesInstanceResponse>(this.config.NewAPIEndPoint + '/Bills/Charges/BillId/' + billId, { headers, params });
    }

}
