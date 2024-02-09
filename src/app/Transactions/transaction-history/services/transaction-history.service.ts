import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { APP_CONFIG, IAppConfig, Token_config, TokenInterface } from 'src/app/model';

@Injectable({
    providedIn: 'root'
})

export class TransactionHistoryService {

    constructor(
        public httpClient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) {
    }

    getTransactions(reqQuery: any, BillId): Observable<any[]> {

        const header = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken);

        const reqParam = new HttpParams()
            .set('CountRecords', reqQuery.CountRecords)
            .append('SkipRecords', reqQuery.SkipRecords)
            .append('TakeRecords', reqQuery.TakeRecords)
            .append('SearchString', '*' + reqQuery.SearchString + '*');

        return this.httpClient.get<any[]>(this.config.MockingAPIEndPoint + '/Bills/1.1/Transactions/BillId/' + BillId, {
            headers: header, params: reqParam
        });
    }

}
