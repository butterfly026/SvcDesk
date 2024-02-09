import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { APP_CONFIG, IAppConfig, Token_config, TokenInterface } from 'src/app/model';
import { GetTransactionResponse } from '../bill-transactions.component.type';

@Injectable({
    providedIn: 'root'
})

export class BillTransactionService {

    constructor(
        public httpClient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) {
    }

    getTransactions(reqData: any, BillId): Observable<GetTransactionResponse> {

        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const params = new HttpParams({ fromObject: { ...reqData} })
            .append('api-version', '1.0')

        return this.httpClient.get<GetTransactionResponse>(this.config.NewAPIEndPoint + '/Bills/Transactions/BillId/' + BillId, { headers, params });
    }

}
