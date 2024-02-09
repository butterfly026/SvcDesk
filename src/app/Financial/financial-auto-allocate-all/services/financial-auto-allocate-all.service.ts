import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from 'src/app/model';
import { AllocateRequestBody, FinancialTransactionReason } from '../models';

@Injectable({
  providedIn: 'root'
})
export class FinancialAutoAllocateAllService {

  constructor(
    public httpclient: HttpClient,
    @Inject(APP_CONFIG) public config: IAppConfig,
    @Inject(Token_config) public tokens: TokenInterface,
  ) { }

  getFinancialTransactionReasons(): Observable<FinancialTransactionReason[]> {
    const headers = new HttpHeaders()
      .set('Authorization', this.tokens.AccessToken)
      .append('Content-Type', 'application/json');

    const params = new HttpParams()
        .set('api-version', '1.0');

    return this.httpclient.get<FinancialTransactionReason[]>(this.config.NewAPIEndPoint + '/FinancialTransactions/Reasons', { headers, params });
  }

  allocateAllFinancialTransactionsAutomatically(reqBody: AllocateRequestBody): Observable<void> {
    const headers = new HttpHeaders()
      .set('Authorization', this.tokens.AccessToken)
      .append('Content-Type', 'application/json');

    const params = new HttpParams()
        .set('api-version', '1.0');

    return this.httpclient.post<void>(this.config.NewAPIEndPoint + '/FinancialTransactions/Allocate', reqBody, { headers, params });
  }

}
