import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from 'src/app/model';
import { FinancialTransactionStatus } from '../financial-transaction-edit-status.component.type';

@Injectable({
  providedIn: 'root'
})
export class FinancialTransactionStatusService {

  constructor(
    private httpclient: HttpClient,
    @Inject(APP_CONFIG) private config: IAppConfig,

    @Inject(Token_config) private tokens: TokenInterface,
  ) { }

  getAvailableFinancialTransactionsStatuses(financialTransactionId: number): Observable<FinancialTransactionStatus[]> {
    const headers = new HttpHeaders()
        .set('Authorization', this.tokens.AccessToken)
        .append('Content-Type', 'application/json');

    const params = new HttpParams()
        .set('api-version', '1.0');

    return this.httpclient.get<FinancialTransactionStatus[]>(
        this.config.NewAPIEndPoint + `/financialtransactions/${financialTransactionId}/Statuses/Available`, 
        { headers, params }
    );
  }

  updateFinancialTransactionStatus(financialTransactionId: number, statusId: string): Observable<void> {
    const headers = new HttpHeaders()
        .set('Authorization', this.tokens.AccessToken)
        .append('Content-Type', 'application/json');

    const params = new HttpParams()
        .set('api-version', '1.0');

    return this.httpclient.patch<void>(
        this.config.MockingAPIEndPoint + `/financialtransactions/${financialTransactionId}/StatusId/${statusId}`, 
        { headers, params }
    );
  }
}
