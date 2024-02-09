import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from 'src/app/model';
import { ReceiptAllocationItem } from '../../receipt/models';
import { ReallocationRequestBody } from '../financial-transaction-reallocate.component.type';
import { GetFinancialTransactionResponse } from '../../financial-transaction-detail/financial-transaction-detail.page.type';

@Injectable({
  providedIn: 'root'
})
export class FinancialTransactionReallocateService {

  constructor(
    public httpclient: HttpClient,
    @Inject(APP_CONFIG) public config: IAppConfig,
    @Inject(Token_config) public tokens: TokenInterface,
  ) { }

  getFinantialTransactionById(financialTransactionId: number): Observable<GetFinancialTransactionResponse> {
    const headers = new HttpHeaders()
        .set('Authorization', this.tokens.AccessToken)
        .append('Content-Type', 'application/json');

    const params = new HttpParams()
        .set('api-version', '1.0');

    return this.httpclient.get<GetFinancialTransactionResponse>(
      this.config.NewAPIEndPoint + '/FinancialTransactions/' + financialTransactionId, 
      { headers, params }
    );
  }

  getAllocationList(accountCode: string): Observable<ReceiptAllocationItem[]> {
    const headers = new HttpHeaders()
      .set('Authorization', this.tokens.AccessToken)
      .append('Content-Type', 'application/json');

    const params = new HttpParams()
      .set('api-version', '1.0')
      .append('OpenOnly', false);
    
    return this.httpclient.get<ReceiptAllocationItem[]>(
      this.config.NewAPIEndPoint + '/FinancialTransactions/Allocations/AllocatableTransactions/Accounts/' + accountCode, 
      { headers, params }
    );
  }

  clearExistingAllocations(financialTransactionId: number): Observable<void> {
    const headers = new HttpHeaders()
      .set('Authorization', this.tokens.AccessToken)
      .append('Content-Type', 'application/json');

    const params = new HttpParams()
      .set('api-version', '1.0');
    
    return this.httpclient.delete<void>(
      this.config.NewAPIEndPoint + `/FinancialTransactions/Allocations/${financialTransactionId}`,
      { headers, params }
    );
  }

  saveReallocation(financialTransactionId: number, reqData: ReallocationRequestBody): Observable<void> {
    const headers = new HttpHeaders()
      .set('Authorization', this.tokens.AccessToken)
      .append('Content-Type', 'application/json');

    const params = new HttpParams()
      .set('api-version', '1.0');
    
    return this.httpclient.post<void>(
      this.config.NewAPIEndPoint + `/FinancialTransactions/Allocations/${financialTransactionId}`,
      reqData,
      { headers, params }
    );
  }
}
