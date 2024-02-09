import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG, IAppConfig, TokenInterface, Token_config } from 'src/app/model';
import { DebitAdjustmentRequestBody } from '../models';

@Injectable({
  providedIn: 'root'
})
export class FinancialDebitAdjustmentService {

  constructor(
    public httpclient: HttpClient,
    @Inject(APP_CONFIG) public config: IAppConfig,
    @Inject(Token_config) public tokens: TokenInterface,
  ) { }

  getInvoiceNumber(TypeId): Observable<{Number: string}> {
    const headers = new HttpHeaders()
        .set('Authorization', this.tokens.AccessToken)
        .append('Content-Type', 'application/json');

    const params = new HttpParams()
        .set('api-version', '1.0')
        .append('Open', 'true')
        .append('DefaultOnly', 'false')

    return this.httpclient.get<{Number: string}>(
      this.config.NewAPIEndPoint + '/FinancialTransactions/Numbers/Types/' + TypeId, 
      { headers, params }
    );
}

  createDebitAdjustment(contactCode: string, reqData: DebitAdjustmentRequestBody): Observable<void> {
    const headers = new HttpHeaders()
      .set('Authorization', this.tokens.AccessToken)
      .append('Content-Type', 'application/json');

    const params = new HttpParams()
      .set('api-version', '1.0');
    
    return this.httpclient.post<void>(
      this.config.NewAPIEndPoint + `/FinancialTransactions/DebitAdjustments/Accounts/${contactCode}`, 
      reqData, 
      { headers, params }
    );
  }
}
