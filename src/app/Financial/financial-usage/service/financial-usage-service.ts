import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from 'src/app/model';


@Injectable({
    providedIn: 'root'
})
export class FinancialUsageService {


    constructor(
        public httpClient: HttpClient,
        @Inject(APP_CONFIG) public config: IAppConfig,
        @Inject(Token_config) public tokens: TokenInterface,
    ) {
    }


    public getUsageHistory = (): Observable<any[]> => {

        return this.httpClient.get<any[]>('assets/fakeDB/usageHistory.json')
            .pipe(
                map(arr => arr)
            );

    };

    FinancialUsageService(FinancialId, reqData): Observable<any> {
        const headers = new HttpHeaders()
            .set('Authorization', this.tokens.AccessToken)
            .append('Content-Type', 'application/json');

        const params = new HttpParams({ fromObject: { ...reqData }})
            .append('api-version', '1.0')

        return this.httpClient.get<any>(this.config.NewAPIEndPoint + '/FinancialTransactions/Invoices/UsageTransactions/' + FinancialId, { headers, params });
    }

}
